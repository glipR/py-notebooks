import React from 'react';

import { useResizable } from "react-resizable-layout";

import StyledMarkdown from '../../components/StyledMarkdown/StyledMarkdown';

import { cn } from '../../utils/cn';
import styles from './ProblemDetail.module.css';

import * as constants from './constants';

type Props = {
  // Define your props here
};

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
    // isDragging: isContentDragging,
    position: contentW,
    separatorProps: contentDragBarProps
  } = useResizable({
    axis: "x",
    initial: 450,
    min: 0
  });
  const {
    // isDragging: isCodeDragging,
    position: codeH,
    separatorProps: codeDragBarProps
  } = useResizable({
    axis: "y",
    initial: 600,
    min: 0
  });

  return (
    <div
      className={styles.windowContainer}
    >
      <div className={cn('content', styles.shrink, styles.contentContainer)} style={{width: contentW - constants.CONTENT_HORIZONTAL_PADDING}}>
        <StyledMarkdown content={markdown} />
      </div>
      <div className={cn(styles.resizeBar, styles.resizeHorizontal)} {...contentDragBarProps}></div>
      <div className={cn('code_game', styles.grow, styles.flexContainer)} style={{flexDirection: 'column'}}>
        <div className={cn('code', styles.shrink)} style={{height: codeH}}></div>
        <div className={cn(styles.resizeBar, styles.resizeVertical)} {...codeDragBarProps}></div>
        <div className={cn('game', styles.grow)}></div>
      </div>
    </div>
  );
};

export default ProblemDetail;
