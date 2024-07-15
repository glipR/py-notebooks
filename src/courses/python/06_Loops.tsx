import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import Terminals from "../../games/Terminal/Terminal";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";
import Turtles from "../../games/Turtle/Turtle";

const loop1MD = `\
## Repeat After Me

Hopefully by now it feels like we're getting somewhere, and our code is getting a bit smarter.
It can now make decisions, and interact with other bits of code to complete complex tasks.

There are still a few tools that we normally have when describing tasks that Python hasn't revealed to us yet though.
There's more to be done!

What I think is probably the largest crutch are code has at the moment is that every line of code can only be executed once.
Conditions make it so our code is sometimes isn't executed, but there's no way to do something like:

* A. Add 30ml of water to the dough
* B. Knead the dough vigorously for 5 minutes
* C. If the dough is still dry, go back to step A.
* D. Place the dough on the counter to rest for 10hrs.

While Python doesn't have an exact equivalent to 'go to', we can achieve the same thing with something called a \`while\` loop.

The structure of a \`while\` loop is identical to an \`if\` branch, save for the keyword:

~~~python
while dough == 'dry':
    add_water(30)
    knead(5)
    dough = feel_dough()
rest_dough(10)
~~~

Rather than an \`if\` block, where the indented code is executed repeatedly until the condition at the top is \`True\`.

While the code above is a pretty contrived example, look at this code below that prints the numbers from \`1-10\`:

~~~python
top_num = 10
current = 1
while current <= top_num:
    print(current)
    current = current + 1
~~~

The first time we hit the while loop, \`current = 1\` and \`1 <= 10\`, so we print, increment \`current\`, and are back at our condition check.
\`current = 2\`, and \`2 <= 10\`.

This continues until \`current = 11\` and \`11 <= 10\` is \`False\`. Then the indented code is not executed.

The \`while\` loop is extremely versatile, but it takes a lot of practice to learn exactly what you can do with it.

Let's start with some basic stuff and then as we work through the next few pages we can ramp things up.

## Challenge

Write a while loop to print the following sequences of numbers:

1. All of the even numbers from 0 until \`top_num\`
2. All of the square numbers (\`1*1, 2*2, 3*3...\`) until \`top_num\`
3. All of the powers of two less than or equal to \`top_num\` ending in 2 or 8. (\`x % 10\` gives the ending digit for \`x\`)

## Bonus Challenge

This one's tough:

Print all of the squares, cubes, quartics, etc... less than or equal to \`top_num\`. You should stop once the only value lesser or equal to \`top_num\` is \`1\`

Example output when \`top_num = 50\`:

~~~
Powers of 2:
1^2 = 1
2^2 = 4
3^2 = 9
4^2 = 16
5^2 = 25
6^2 = 36
7^2 = 49
Powers of 3:
1^3 = 1
2^3 = 8
3^3 = 27
Powers of 4:
1^4 = 1
2^4 = 16
Powers of 5:
1^5 = 1
2^5 = 32
~~~

:::note{.info}
You can compute the power of a number using the notation. \`x ** y\`. For example, \`4 ** 3\` is \`4 * 4 * 4\`.
:::

:::note{.hint}
You can nest \`while\` loops just like you can nest \`if\` conditions. This allows you to repeat a group of actions multiple times, with different variable values present.

For this particular problem, you've already solved the problem of printing all squares smaller than \`top_num\`.
How can we modify and use this so it does this for all powers up until only 1 would be printed?
:::
`;
const loop1Code = {
  "code.py": makeCode(`\
top_num = 16
`)
}
const loop1Ref = createRef<Terminals>();
export const loop1 = (
<ProblemDetail
  markdown_text={loop1MD}
  template_code={loop1Code}
  game_ref={loop1Ref}
  startScript='code.py'
  nextLink="/notebooks/loops/2">
  <Terminals ref={loop1Ref} />
</ProblemDetail> );

const loop2MD = `\
## Looping and Looping

Let's get some more practice in and also get used to nested loops - a \`while\` loop which we run multiple times because it's indented in another \`while\` loop.

We can use this new tooling to draw some pretty pictures with our turtle, using the new \`pen_down\` and \`pen_up\` functions!

* \`pen_down\` - all future turtle movement will leave a trail. This function takes 0 *or* 1 arguments.
  * If no arguments are given, the default (or previous) color is used for the trail
  * If 1 argument is given, this should be a number specifying the color of the trail (This is done using hexadecimal numbers and RGB color-codes, you don't need to worry about this for now)
* \`pen_up\` - all future turtle movement will no longer leave a trail.

Edit the sections of the code so the following picture is printed:

`;
const loop2Code = {
  "code.py": makeCode(`\
from turtle.movement import *

iterations = |3|
horizontal = |60|
vertical = |90|
while iterations > 0:
    |pen_down(0xeebb55)
    forward(horizontal)
    right(90)
    pen_down(0x00aa00)
    forward(vertical)
    right(90)
    pen_down(0xaa00aa)
    forward(horizontal)
    right(90)
    pen_up()
    forward(vertical)|
    # Move to the next "corner" of the square
    pen_up()
    backward(|5|)
    right(90)
    forward(|5|)
    horizontal = horizontal - |10|
    vertical = vertical - |20|
    iterations = iterations - 1
`, '|', true, true)
}
const loop2Ref = createRef<Turtles>();
export const loop2 = (
<ProblemDetail
  markdown_text={loop2MD}
  template_code={loop2Code}
  game_ref={loop2Ref}
  startScript='code.py'
  nextLink="/notebooks/loops/3">
  <Turtles turtleSpeedMultiplier={3} beginTransform={{x: 10, y: 10, bearing: -90}} areaHeight={100} areaWidth={200} ref={loop2Ref} />
</ProblemDetail> );
