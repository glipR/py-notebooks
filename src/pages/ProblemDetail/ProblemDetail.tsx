import React from 'react';

import { useResizable } from "react-resizable-layout";
import {indentWithTab} from "@codemirror/commands"
import CodeMirror from '@uiw/react-codemirror'
import { keymap } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { PythonProvider, usePython } from 'react-py'
import { Stage, Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js'
import StyledMarkdown from '../../components/StyledMarkdown/StyledMarkdown';

import { cn } from '../../utils/cn';
import styles from './ProblemDetail.module.css';

import * as constants from './constants';

type Props = {
  // Define your props here
};

const extensions = [python(), keymap.of([indentWithTab])];
const code = `\
colours = [
  0xFF0000,
  0xFFFF00,
  0x00FF00,
  0x00FFFF,
  0x0000FF,
  0xFF00FF
]

import time

for t in range(3):
  for a in range(30):
    prev = (a-3) % 30
    px, py = prev % 10, prev // 10
    x, y = a % 10, a // 10
    send_cube(px, py, 0x000000)
    send_cube(x, y, colours[a % len(colours)])
    time.sleep(0.05)
  time.sleep(1)
`

const markdown = `\
# Welcome to the Codebook!

This is all about doing the fun parts of coding, without any of the fluff.

From here you can write code in the right sidebar, and see your results directly in the game window below!

:::note{.info}
### Window Controls

Drag the bars separating this text, the code and the game window to the size you want.

You can also press the arrow buttons on the line to minimise / maximise certain windows.
:::

Your first task is to print your name on the screen.

Names and other bits of text are represented as strings in Python. So that Python doesn't confuse your name for code, strings are surrounded by quotation marks (\`"\` or \`'\`).

Your friend for these first few problems is the \`print\` function. You can place any string inside the brackets right of the \`print\` function to display it on the big screen.

:::note{.warning}
### Resetting
If at any point you want to revert the code to the original state, you can press the reset button in the top right corner of the code window.
:::

~~~python
print("Hello World!")
~~~
`;

const defaultGrid: number[][] = [];
for (let i = 0; i < 3; i++) {
  const row = [];
  for (let j = 0; j < 10; j++) {
    row.push(0x000000);
  }
  defaultGrid.push(row);
}

const ProblemDetail: React.FC<Props> = (props) => {
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

  const [codeValue, setCode] = React.useState(code);
  const [stdoutValue, setStdout] = React.useState('');
  const [lastAnalysed, setAnalysed] = React.useState(-1);
  const [squaresVal, setSquares] = React.useState(defaultGrid);
  const {runPython, stdout, isLoading, isRunning} = usePython({
    packages: {
      micropip: ['pyodide-http']
    }
  });

  const gameHeight = window.innerHeight - codeH - 10;
  const gameWidth = window.innerWidth - contentW - 10;

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
          if (obj.type === 'cube') {
            const newGrid = [...squaresVal];
            newGrid[obj.y][obj.x] = obj.color;
            setSquares(newGrid);
          }
        }
      }
      setAnalysed(curAnalysed);
      setStdout(stdout);
    }
  }, [stdout, stdoutValue, squaresVal, lastAnalysed]);

  // async method for onclick
  const playPressed = async () => {
    await runPython(constants.PYTHON_PREAMBLE + '\n' + codeValue);
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
          <StyledMarkdown content={markdown} />
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
        <Stage options={{ background: 0x2D3032 }} height={gameHeight} width={gameWidth}>
          {squaresVal.map((row, y) => row.map((color, x) => <Sprite
            key={`${x}-${y}`}
            texture={PIXI.Texture.WHITE}
            x={gameWidth/20.0 + x * gameWidth/10.0}
            y={gameHeight/6.0 + y * gameHeight/3.0}
            tint={color}
            anchor={{ x: 0.5, y: 0.5 }}
            width={gameWidth/10.0}
            height={gameHeight/3.0}
          />))}
        </Stage>
        </div>
      </div>
    </div>
    </PythonProvider>
  );
};

export default ProblemDetail;
