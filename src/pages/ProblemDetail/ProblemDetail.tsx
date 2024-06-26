import React, { ReactElement } from 'react';

import { useResizable } from "react-resizable-layout";
import {indentWithTab} from "@codemirror/commands"
import { keymap } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { usePython } from 'react-py'
import StyledMarkdown from '../../components/StyledMarkdown/StyledMarkdown';

import { cn } from '../../utils/cn';
import styles from './ProblemDetail.module.css';

import * as constants from './constants';
import GameWindow from '../../components/GameWindow/GameWindow';
import MultiFileEditor, { CodeBlock, TreeStructure, getCodeFromFolder, makeCode } from '../../components/MultiFileEditor/MultiFileEditor';

type Props = {
  markdown_text: string;
  template_code: TreeStructure;
  startScript: string;
  children: ReactElement;
  game_ref: React.RefObject<GameWindow>;
  startX?: number;
  startY?: number;
};

const extensions = [
  python(),
  keymap.of([indentWithTab]),
];

const ProblemDetail: React.FC<Props> = ({ markdown_text, template_code, children, game_ref, startScript, startX, startY }) => {
  const {
    position: contentW,
    separatorProps: contentDragBarProps,
    setPosition: contentDragBarSet,
  } = useResizable({
    axis: "x",
    initial: startX ?? 700,
    min: 0
  });
  const {
    position: codeH,
    separatorProps: codeDragBarProps,
    setPosition: codeDragBarSet,
  } = useResizable({
    axis: "y",
    initial: startY ?? 600,
    min: 0
  });
  const {
    position: debuggerH,
    separatorProps: debuggerDragBarProps,
    setPosition: debuggerDragBarSet
  } = useResizable({
    axis: "y",
    initial: 5,
    min: 0,
    reverse: true,
  })

  React.useEffect(() => {
    navigator.serviceWorker
      .register('/react-py-sw.js')
      .then((registration) =>
        console.log(
          'Service Worker registration successful with scope: ',
          registration.scope
        )
      )
      .catch((err) => console.log('Service Worker registration failed: ', err))
  }, [])

  const [codeValue, setCode] = React.useState(template_code);
  const {runPython, stdout, stderr, isLoading, isRunning, watchModules, writeFile, sendInput, mkdir, isAwaitingInput} = usePython({
    packages: {
      micropip: ['pyodide-http']
    },
    printInput: false,
  });

  const [prevStderr, setPrevStderr] = React.useState('');
  const [actualStderr, setActualStderr] = React.useState('');
  const [writtenFiles, setWrittenFiles] = React.useState<{[key: string]: boolean}>({})
  const [awaitingSends, setAwaitingSends] = React.useState<string[]>([]);

  const gameHeight = window.innerHeight - codeH - 10;
  const gameWidth = window.innerWidth - contentW - 10;
  game_ref.current?.setDimensions?.(gameWidth, gameHeight);

  React.useEffect(() => {
    const term = document.querySelector("." + styles.terminal);
    term?.scrollTo(0, term.scrollHeight);
  }, [stdout])

  React.useEffect(() => {
    game_ref.current?.setStdout?.(stdout);
  }, [stdout, game_ref])

  React.useEffect(() => {
    if (awaitingSends.length && isAwaitingInput) {
      console.log("GAME:", JSON.parse(awaitingSends[0]))
      sendInput(awaitingSends[0]);
      setAwaitingSends(prev => prev.slice(1))
    }
  }, [isAwaitingInput, awaitingSends, sendInput])

  React.useEffect(() => {
    if (stderr !== prevStderr) {
      const newLines = stderr.split('\n').splice(prevStderr.split('\n').length - (prevStderr === '' ? 1 : 0))
      newLines.forEach((line) => {
        if (line.startsWith('message=')) {
          const msg = JSON.parse(line.split('message=')[1]);
          console.log("PROC:", msg)
          game_ref.current?.ingestMessage?.(msg, s => {
            setAwaitingSends(prev => [...prev, s])
          });
        }
      })
      const newActual = newLines.filter((line) => !line.startsWith('message=')).join('\n');
      setActualStderr(a => a + (!!newActual ? '\n' : '') + newActual);
      setPrevStderr(stderr);
    }
  }, [stderr, game_ref, prevStderr, sendInput, isAwaitingInput]);

  // async method for onclick
  const playPressed = async () => {
    const curFiles = {...writtenFiles}
    const collectTree = (t: TreeStructure, prefix?: string, folderPath?: string): {path: string, modulePath: string, code: string}[] => {
      let v:{path: string, modulePath: string, code: string}[] = [];
      for (const key in t) {
        const extensionless = key.split('.')[0];
        const path = !!prefix ? `${prefix}.${extensionless}` : extensionless;
        const actualPath = !!prefix ? `${folderPath}/${key}` : key;
        if ('type' in t[key] && t[key].type === 'code') {
          v.push({path: actualPath, modulePath: path, code: (t[key] as CodeBlock).code});
        } else {
          if (!writtenFiles[actualPath]) {
            mkdir(actualPath)
            curFiles[actualPath] = true;
          }
          v = [...v, ...collectTree(t[key] as TreeStructure, path, actualPath)];
        }
      }
      return v;
    }
    const actualTree = {
      ...codeValue,
      utils: {
        "mocking.py": makeCode(constants.UTILS_CODE)
      },
      ...game_ref.current?.getPythonPreamble?.()
    };
    ['communication', 'communication/process', 'communication/game'].forEach(folder => {
      if (!writtenFiles[folder]) {
        mkdir(folder)
        curFiles[folder] = true;
      }
    })
    const modules = collectTree(actualTree);
    watchModules(modules.map(m => m.modulePath));
    modules.forEach(({path, code}) => {
      writeFile(path, code);
    })
    setWrittenFiles(curFiles)
    await runPython(constants.PYTHON_PREAMBLE + '\n' + getCodeFromFolder(actualTree, startScript)?.code);
  };

  return (
    <div
      className={styles.windowContainer}
    >
      <div className={styles.top_bar}>
        <div className={styles.top_bar_item}>
          <span className={styles.top_bar_text}>File</span>
          <button className={styles.top_bar_subitem}>New File</button>
          <button className={styles.top_bar_subitem}>Rename File</button>
        </div>
        <button className={styles.top_bar_item}>Edit</button>
        <button className={styles.top_bar_item}>Window</button>
        <div className={styles.top_bar_spacer}></div>
        <button disabled={isRunning || isLoading} onClick={playPressed} className={cn(styles.top_bar_item, styles.top_bar_small)}>{'|>'}</button>
        <button disabled={!isRunning} className={cn(styles.top_bar_item, styles.top_bar_small)}>{'||'}</button>
      </div>
      <div className={cn(styles.shrink, styles.contentContainer)} style={{width: contentW - constants.CONTENT_HORIZONTAL_PADDING}}>
      {contentW - constants.CONTENT_HORIZONTAL_PADDING > 10 &&
        <>
        <div className={cn(styles.content, styles.grow)}>
          <StyledMarkdown content={markdown_text} />
        </div>
        <div className={cn(styles.resizeBar, styles.resizeVertical)} {...debuggerDragBarProps}>
          {
            contentW - constants.CONTENT_HORIZONTAL_PADDING > 10 &&
            <>
            <button
              className={cn(styles.vertical_snapper, styles.top_snapper)}
              onClick={()=>debuggerDragBarSet(window.document.body.clientHeight - constants.CODE_VERTICAL_PADDING - 10)}
            />
            <button
              className={cn(styles.vertical_snapper, styles.bottom_snapper)}
              onClick={()=>debuggerDragBarSet(0)}
            />
            </>
          }
        </div>
        { debuggerH - constants.DEBUGGER_VERTICAL_PADDING > 10 &&
        <div className={cn(styles.shrink, styles.debuggerContainer)} style={{height: debuggerH - constants.DEBUGGER_VERTICAL_PADDING, width: "100%"}}>
          {
            // WINDOW:
            <>
            <div className={styles.debuggerSection}>
              <div className={styles.debuggerSectionTitle}>Variables</div>
              <div className={styles.debuggerVariablesContainer}>
                <div className={styles.debuggerVariable}>
                  <div className={styles.debuggerVariableKey}>x</div>
                  <div className={styles.debuggerVariableValue}>3</div>
                </div>
                <div className={styles.debuggerVariable}>
                  <div className={styles.debuggerVariableKey}>y</div>
                  <div className={styles.debuggerVariableValue}>2</div>
                </div>
                <div className={styles.debuggerVariable}>
                  <div className={styles.debuggerVariableKey}>z</div>
                  <div className={styles.debuggerVariableValue}><code>Hello World</code></div>
                </div>
              </div>
            </div>
            <div className={styles.debuggerSection}>
              <div className={styles.debuggerSectionTitle}>Watched Values</div>
              <div className={styles.debuggerVariablesContainer}>
                <div className={styles.debuggerVariable}>
                  <div className={styles.debuggerVariableKeyInput}><input value='x'></input></div>
                  <div className={styles.debuggerVariableValue}>3</div>
                </div>
              </div>
            </div>
            <div className={styles.debuggerSection}>
              <div className={styles.debuggerSectionTitle}>Call Stack</div>
              <div className={styles.debuggerCallStackContainer}>
                <div className={styles.debuggerCallStackItem}>
                  <div className={styles.debuggerCallStackItemFunctionName}>main</div>
                </div>
              </div>
            </div>
            </>

            // MISC:
            // Highlight Breakpoints
          }
        </div>
        }
        </>
      }
      </div>
      <div className={cn(styles.resizeBar, styles.resizeHorizontal)} {...contentDragBarProps}>
        <button
          className={cn(styles.horizontal_snapper, styles.left_snapper)}
          onClick={()=>contentDragBarSet(16)}
        />
        <button
          className={cn(styles.horizontal_snapper, styles.right_snapper)}
          onClick={()=>contentDragBarSet(window.document.body.clientWidth - 10)} // TODO
        />
      </div>
      <div className={cn(styles.code_game, styles.grow, styles.flexContainer)} style={{flexDirection: 'column'}}>
        {
          codeH - constants.CODE_VERTICAL_PADDING > 10 &&
          <div
            className={cn('code', styles.shrink)}
            style={{height: codeH - constants.CODE_VERTICAL_PADDING}}
          >
            {actualStderr /* TODO: Make an actual stderr location (debugger?) */}
            <MultiFileEditor
              tree={codeValue}
              height={`${codeH - constants.CODE_VERTICAL_PADDING}px`}
              theme={okaidia}
              extensions={extensions}
              onChange={setCode}
            />
          </div>
        }
        <div className={cn(styles.resizeBar, styles.resizeVertical)} {...codeDragBarProps}>
          {
            window.innerWidth - 10 - contentW > 32 &&
            <>
            <button
              className={cn(styles.vertical_snapper, styles.top_snapper)}
              onClick={()=>codeDragBarSet(35)}
            />
            <button
              className={cn(styles.vertical_snapper, styles.bottom_snapper)}
              onClick={()=>codeDragBarSet(window.innerHeight - 10)}
            />
            </>
          }
          {stdout && !game_ref.current?.terminalDisabled && <div className={styles.terminal}>
            <code>
            {stdout}
            </code>
          </div>}
        </div>
        <div className={cn('game', styles.grow)}>
        {children}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
