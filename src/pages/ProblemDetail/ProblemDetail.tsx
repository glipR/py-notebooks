import React, { ReactElement } from 'react';

import { useResizable } from "react-resizable-layout";
import {indentWithTab} from "@codemirror/commands"
import CodeMirror from '@uiw/react-codemirror'
import { keymap } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { PythonProvider, usePython } from 'react-py'
import StyledMarkdown from '../../components/StyledMarkdown/StyledMarkdown';

import { cn } from '../../utils/cn';
import styles from './ProblemDetail.module.css';

import * as constants from './constants';
import GameWindow from '../../components/GameWindow/GameWindow';

type Props = {
  markdown_text: string;
  template_code: string;
  children: ReactElement;
  game_ref: React.RefObject<GameWindow>;
};

const extensions = [python(), keymap.of([indentWithTab])];

const ProblemDetail: React.FC<Props> = ({ markdown_text, template_code, children, game_ref }) => {
  const {
    position: contentW,
    separatorProps: contentDragBarProps,
    setPosition: contentDragBarSet,
  } = useResizable({
    axis: "x",
    initial: 450,
    min: 0
  });
  const {
    position: codeH,
    separatorProps: codeDragBarProps,
    setPosition: codeDragBarSet,
  } = useResizable({
    axis: "y",
    initial: 600,
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

  const [codeValue, setCode] = React.useState(template_code);
  const [stdoutValue, setStdout] = React.useState('');
  const [lastAnalysed, setAnalysed] = React.useState(-1);
  const {runPython, stdout, isLoading, isRunning} = usePython({
    packages: {
      micropip: ['pyodide-http']
    }
  });

  const gameHeight = window.innerHeight - codeH - 10;
  const gameWidth = window.innerWidth - contentW - 10;
  game_ref.current?.setDimensions(gameWidth, gameHeight);

  React.useEffect(() => {
    if (stdoutValue !== stdout) {
      let curAnalysed = lastAnalysed;
      if (!stdout.startsWith(stdoutValue)) {
        curAnalysed = -1;
      }
      const lines = stdout.split('\n');
      while (curAnalysed < lines.length - 1) {
        const line = lines[curAnalysed + 1];
        curAnalysed = curAnalysed + 1;
        let obj: any = undefined;
        try {
          obj = JSON.parse(line);
        } catch (e) {}
        if (obj !== undefined) {
          game_ref.current?.ingestMessage(obj)
        }
      }
      setAnalysed(curAnalysed);
      setStdout(stdout);
    }
  }, [stdout, stdoutValue, lastAnalysed, game_ref]);

  // async method for onclick
  const playPressed = async () => {
    await runPython(constants.PYTHON_PREAMBLE + '\n' + game_ref.current?.getPythonPreamble() + '\n' + codeValue);
  };

  return (
    <PythonProvider>
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
            <CodeMirror
              height={`${codeH - constants.CODE_VERTICAL_PADDING}px`}
              value={codeValue}
              theme={okaidia}
              extensions={extensions}
              onChange={(value) => setCode(value)}
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
        </div>
        <div className={cn('game', styles.grow)}>
        {children}
        </div>
      </div>
    </div>
    </PythonProvider>
  );
};

export default ProblemDetail;
