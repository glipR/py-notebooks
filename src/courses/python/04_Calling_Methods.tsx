import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";
import Turtles from "../../games/Turtle/Turtle";

const functions1MD = `\
## Calling Functions

While we've got the hang of basic data and variables, we can't really do much with that yet before we discuss how to have our code affect things *outside* of our code.

This is achieve in Python by calling *functions*. We won't cover how to write our own functions for a while, but we can think of functions like little snippets of code that we can execute, **but** we can specify the values of certain variables in our code instead.

We've already gotten quite familiar with one function, the \`print\` function!

All functions are run by typing the function name, followed by a pair of brackets.
The values you want to give to the function to use as variables are called arguments, which go in between the brackets.

Using functions lets us start writing code that affects other parts of the editor. Let's start doing this by working on the "Turtle" program.

In the bottom right of the editor, you'll see a little turtle. Using code and functions, we can move, rotate and collect information from this turtle!
There are a few commands we'll use in these first few examples:

* \`forward(distance)\` - Moves the turtle forward by a certain distance (The window is 200 units wide and 100 units tall)
* \`backward(distance)\` - Moves the turtle backward by a certain distance
* \`right(angle)\` - Rotates the turtle right by a certain angle in degrees (90 is a quarter turn)
* \`left(angle)\` - Rotates the turtle left by a certain angle in degrees (90 is a quarter turn)
* \`read_distance()\` - Returns the distance from the turtle to the nearest wall

:::note{.info}
In order to use functions not from the Python standard library, we need to import them. This is done in the scaffold in the first two lines - We'll cover in more detail how to import custom python code in future - for now it will always be in the scaffold.
:::

## Challenge #1

Let's start by just executing the template given. Next, try changing the code so that we navigate to the red square.
`;
const functions1Code = {
  "code.py": makeCode(`\
from turtle.movement import * # Import all movement options

# Each of these functions will stop execution of our code until the turtle has finished moving
forward(30)
right(90)
forward(20)
left(45)
backward(40)
`)
}
const functions1Ref = createRef<Turtles>();
export const functions1 = (
<ProblemDetail
  markdown_text={functions1MD}
  template_code={functions1Code}
  game_ref={functions1Ref}
  startScript='code.py'
  nextLink="/notebooks/functions/2">
  <Turtles ref={functions1Ref} areaHeight={100} areaWidth={200} splotches={[
    {x: 25, y: 80, width: 10, height: 10, color: "#3333CC"},
    {x: 165, y: 10, width: 10, height: 10, color: "#CC3333"},
  ]} walls={[
    {x: 0, y: 0, width: 200, height: 5, color: "#000000"},
    {x: 0, y: 0, width: 5, height: 100, color: "#000000"},
    {x: 0, y: 95, width: 200, height: 5, color: "#000000"},
    {x: 195, y: 0, width: 5, height: 100, color: "#000000"},
    {x: 0, y: 0, width: 90, height: 45, color: "#000000"},
    {x: 75, y: 70, width: 40, height: 30, color: "#000000"},
    {x: 115, y: 30, width: 20, height: 70, color: "#000000"},
    {x: 150, y: 0, width: 5, height: 20, color: "#000000"},
  ]} beginTransform={{
    x: 30,
    y: 85,
    bearing: 0,
  }} />
</ProblemDetail> );

const functions2MD = `\
## Return values

With just function calls, we can communicate with other bits of code.
Functions can also produce a value, which you can then store in a variable.
This allows the other bits of code to then communicate with our code.

In our turtle example, the \`read_distance\` function returns closest distance to a wall as a number.

## Challenge #2

Use the \`read_distance\` function to move 10 units away from the wall, then turn left, move 10 units away from the wall, etc. Until you complete the maze provided.

:::note{.hint}
\`read_distance\` may need to be called multiple times (for example before every movement is made.)
:::

:::note{.info}
Consider the following code: \`backward(read_distance())\`. This works because the arguments of a function get evaluated before the function code itself.

TODO: Image
:::
`;
const functions2Code = {
  "code.py": makeCode(`\
from turtle.movement import * # Import all movement options
from turtle.sense import read_distance

wall_dist = read_distance()
print(wall_dist)
`)
}
const functions2Ref = createRef<Turtles>();
export const functions2 = (
<ProblemDetail
  markdown_text={functions2MD}
  template_code={functions2Code}
  game_ref={functions2Ref}
  startScript='code.py'
  nextLink="/notebooks/conditions/1">
  <Turtles ref={functions2Ref} areaHeight={100} areaWidth={200} splotches={[
    {x: 25, y: 10, width: 10, height: 10, color: "#3333CC"},
    {x: 180, y: 10, width: 10, height: 10, color: "#CC3333"},
  ]} walls={[
    {x: 0, y: 0, width: 200, height: 5, color: "#000000"},
    {x: 0, y: 0, width: 5, height: 100, color: "#000000"},
    {x: 0, y: 95, width: 200, height: 5, color: "#000000"},
    {x: 195, y: 0, width: 5, height: 100, color: "#000000"},
    {x: 40, y: 0, width: 20, height: 80, color: "#000000"},
    {x: 90, y: 60, width: 20, height: 60, color: "#000000"},
    {x: 40, y: 0, width: 120, height: 35, color: "#000000"},
    {x: 90, y: 0, width: 20, height: 40, color: "#000000"},
    {x: 140, y: 0, width: 20, height: 80, color: "#000000"},
  ]} beginTransform={{
    x: 30,
    y: 15,
    bearing: 180,
  }} />
</ProblemDetail> );
