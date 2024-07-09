export const WELCOME_MARKDOWN = `\
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

export const TURTLE_MARKDOWN = `\
# Drawing with the Turtle

Turtle++ is a library, meaning it's a collection of code that someone else wrote to make your life easier.
This library allows us to control the turtle in the game window, allowing it to move, rotate, and read things like the colour under the turtle, or how close it is to a wall.

## Controlling the Turtle

The Turtle is controlled via a series of commands. These commands are functions that you can call to make the turtle do something.

~~~python
# Move the turtle forward
forward(50) # 100 units is about the length of the game window, so 50 is about half the window.
# Rotate the turtle 90 degrees to the right, then move forward
right(90)
forward(30)
# Move the turtle left, without worrying about it's direction
shift_left(10)
~~~
`;

export const SANDPILES_MARKDOWN = `\
# Sandpiles
`
