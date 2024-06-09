import React from 'react';

import { useResizable } from "react-resizable-layout";
import {indentWithTab} from "@codemirror/commands"
import CodeMirror from '@uiw/react-codemirror'
import { keymap } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import StyledMarkdown from '../../components/StyledMarkdown/StyledMarkdown';

import { cn } from '../../utils/cn';
import styles from './ProblemDetail.module.css';

import * as constants from './constants';

type Props = {
  // Define your props here
};

const extensions = [python(), keymap.of([indentWithTab])];
const code = `\
print("Hello World")

a = 2 + 3\
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

  const [codeValue, ] = React.useState(code);

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
        <button className={cn(styles.top_bar_item, styles.top_bar_small)}>{'|>'}</button>
        <button className={cn(styles.top_bar_item, styles.top_bar_small)}>{'||'}</button>
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
            />
          </div>
        }
        <div className={cn(styles.resizeBar, styles.resizeVertical)} {...codeDragBarProps}>
          {
            window.document.body.clientWidth - 10 - contentW > 32 &&
            <>
            <button
              className={cn(styles.vertical_snapper, styles.top_snapper)}
              onClick={()=>codeDragBarSet(35)}
            />
            <button
              className={cn(styles.vertical_snapper, styles.bottom_snapper)}
              onClick={()=>codeDragBarSet(window.document.body.clientHeight - 10)} // TODO
            />
            </>
          }
        </div>
        <div className={cn('game', styles.grow)}></div>
      </div>
    </div>
  );
};

export default ProblemDetail;
