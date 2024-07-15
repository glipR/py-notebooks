import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import Terminals from "../../games/Terminal/Terminal";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";
import Turtles from "../../games/Turtle/Turtle";

const cond1MD = `\
## Conditions

We're slowly gaining tools in our toolbox, but everything we've done so far has been pretty 'static'.

What makes programs so great is that they are smarter than that, they can change what they do dependant on the information they are given.
For example, when videogames can play completely differently depending on the buttons you press and actions you take.

It's about time we looked at how this is done in Python, with the \`if\` statement.

## What's an \`if\`?

Sometimes in a recipe, you might see something like:

> If you are using a fan forced oven, then keep your food in for 10 less minutes.

This sentence has a clear structure:

* The keyword \`if\`
* Some *predicate*, Which is just something that can be true or false (You are using a fan forced oven)
* The keywork \`then\`
* Something you should do only if the predicate is true (Keep your food in for 10 less minutes)

In python, the structure is extremely similar. This same rule in Python might look something like this:

~~~python
if oven_type == "fan_forced":
    oven_time = oven_time - 10
~~~

Let's dissect the structure here:

* We start with the \`if\` keyword, followed by a space
* Next, we have an expression (\`oven_type == "fan_forced"\`). We'll cover how we can make more comparisons later.
* Next, we have the colon \`:\` character
* Next, we have the code we want to execute, except it is *indented* (Moved to the right by pressing tab or space)

That's all there is to an \`if\` statement!

Try changing the value of \`x\` in the code on the right and seeing how things change.
Notice that no matter what, \`x\` is always printed. This is because it is *not* indented in the same way \`x = x + 10\` is.

## Comparison

To get more in detail on \`if\` statements, let's look at what we can put in the expression between \`if\` and \`:\`.

There's actually an even simpler type of data we haven't looked at yet, which \`if\` statements use.
Try running the following code: \`print(1 == 1)\`. You'll get the value \`True\` printed out, and trying \`print(1 == 0)\` will get you \`False\`.
These are special values called Booleans, named after George Boole.

We can use many different comparisons between numbers and strings. These are the main ones you'll be using:

* \`num1 == num2\`: Returns \`True\` if the numbers are the same, \`False\` otherwise (Note the double \`=\` so this doesn't look like a variable assignment in code)
* \`num1 < num2\`: Returns \`True\` if num1 is less than num2, \`False\` otherwise. Swap \`<\` for \`>\` for greater than instead.
* \`num1 <= num2\`: Returns \`True\` if num1 is less than *or equal to* num2, \`False\` otherwise. Swap \`<\` for \`>\` for greater than or equal to instead.
* \`str1 == str2\`: Returns \`True\` if the strings of text are **exactly** the same. They are the same length, the first character is exactly the same, the second is, ...
* \`num1 <= num2 < num3\`: Returns \`True\` only if num2 is greater than or equal to num1, and num2 is less than num3. You can add/remove the \`=\` from each side to allow/disallow 'equal to' as an option.

## Challenge

Comment out Example 1 on the right and Un-Comment Example 2. Fix the bug in the code so that liftoff can only occur if the fuel temp is between 15 and 20 degrees inclusive *and* the astronaut's name is "Buzz"
`;
const cond1Code = {
  "code.py": makeCode(`\
# Example 1: Simple Ifs
x = 5
if x < 5:
  x = x + 10
print(x)

# Example 2: Space liftoff
# fuel_temp = 10
# astronaut_name = "Neil"
# correct_checks = 0

# if 20 < fuel_temp <= 15:
#     print("Fuel Temp at", fuel_temp, "is looking good!")
#     correct_checks = correct_checks + 1
#
# if astronaut_name == "Buzz":
#     print("Shouldn't Buzz be commanding this shuttle? Not", astronaut_name)
# if astronaut_name != "Buzz":
#     print("Commander", astronaut_name, "ready for liftoff")
#     correct_checks = correct_checks + 1
#
# if correct_checks > 2:
#     print("All checks complete, lifting off in 3, 2, 1... 💥")
`)
}
const cond1Ref = createRef<Terminals>();
export const cond1 = (
<ProblemDetail
  markdown_text={cond1MD}
  template_code={cond1Code}
  game_ref={cond1Ref}
  startScript='code.py'
  nextLink="/notebooks/conditions/2">
  <Terminals ref={cond1Ref} />
</ProblemDetail> );

const cond2MD = `\
## Combining Conditions

The last example in the previous slide might've seemed a bit hard to write, for as simple as the English instructions are:

> If the fuel temperature is between 15 and 20 degrees inclusive, and the astronaut's name is "Buzz", then liftoff can occur.

We had to achieve this in code using a counter variable for the correct checks, and then compare this with 2.

For the next few pages, we'll be looking at tools that make \`if\` statements easier to use and more like their English counterparts.

Just like you can use \`+ - * /\` to combine numbers, you can use \`and\`, \`or\`, and \`not\` to combine/alter boolean values.

### \`and\`

The \`and\` keyword is used to combine two booleans, and only returns \`True\` if both booleans are true, just like you'd expect.

~~~python
True and False       # False
1 == 1 and 2 == 2    # True
0 == 1 and 0 < 1 < 1 # False

"hello" == "hello" and "world" == "world" # True

if 15 <= fuel_temp <= 20 and astronaut_name == "Buzz":
    print("All checks complete, lifting off in 3, 2, 1... 💥")
~~~

### \`or\`

The \`or\` keyword is used to combine two booleans, and returns \`True\` if *either* boolean is true.

~~~python
True or False       # True
1 == 1 or 2 == 2    # True
0 == 1 or 0 < 1 < 1 # False

"hello" == "hello" or "world" == "world" # True
~~~

This might not completely line up with the English definition of 'or'. Take the second line for example; is it true that 1 equals 1 or 2 equals 2?
Well, 1 equals 1 **and** 2 equals 2, but it doesn't really *feel* right to say *or*. It's like if you are asked to bring an umbrella or stay inside, and you stay inside with an umbrella.

Often in English 'or' is used to mean 'exclusively one or the other', but in Python, we're completely happy if both conditions are satisfied.

This is helpful when coding, because often you'll need one of two things to be true, but you don't mind if both end up being true.

~~~python
# In this example, having both be true is impossible
if age < 18 or age > 65:
    print("You get a discount!")

# In this example, both could be true, but we only need one for a discount
if age < 18 or is_student:
    print("You get a discount!")
~~~

### \`not\`

If we want to do something if a condition is *not* true, we could write it like this:

~~~python
if (1 == 2) == False:
    print("1 is not 2")
~~~

However, this can be a bit hard to read - in general you should avoid ever writing Booleans in conditions explicitly. We can instead use the \`not\` keyword:

* \`(not True)\`  is \`False\`
* \`(not False)\` is \`True\`

~~~python
if not (1 == 2):
    print("1 is not 2")
~~~

Using these tools, let's fix the code on the right for the following problem:

You are managing a tournament of 3 players, and you need to determine the winner of the tournament.
Each player is given a score, and the winner is the player with the highest score.

First, if there's a clear winner, we'd like to print the winner's name.
Next, if there's a tie between two players, we'd like to print "It's a tie!".
Finally, if all 3 players have the same score, we'd like to print "Everyone's a winner!".

:::note{.info}
If you have many different expressions on a single line, you can use brackets \`()\` to make it easier to read, and also ensure the order of operations is correct.

~~~python
x or y and z   # This is ambiguous. What happens if x is True and y/z is False?
x or (y and z) # This is clear - it should be true
(x or y) and z # This is clear - it should be false
~~~
:::
`;
const cond2Code = {
  "code.py": makeCode(`\
player1 = |70|
player2 = |50|
player3 = |85|

# Checking each individual winner
if |True|:
    print("Player 1 wins!")
if |True|:
    print("Player 2 wins!")
if |True|:
    print("Player 3 wins!")

# 2 player tie check
if |True|:
    print("It's a tie!")
# 3 player tie check
if |True|:
    print("Everyone's a winner!")
`, '|', true, true)
}
const cond2Ref = createRef<Terminals>();
export const cond2 = (
<ProblemDetail
  markdown_text={cond2MD}
  template_code={cond2Code}
  game_ref={cond2Ref}
  startScript='code.py'
  nextLink="/notebooks/conditions/3">
  <Terminals ref={cond2Ref} />
</ProblemDetail> );

const cond3MD = `\
## What Else?

So far everything we've looked at is only following a single "branch" of decisions (are we ready to takeoff? who won the tournament?)

But in many examples, we want to do something when a condition is true, *and* something else when the condition is false.

In python, we *could* do

~~~python
if test:
    print("Yes")
if not test:
    print("No")
~~~

But in a recipe, you don't really see this, instead you'll see:

* If you're cooking the 12 servings version of this recipe, use 500g
* **Otherwise**, use 250g

In Python, we can do the same with the \`else\` keyword:

~~~python
if x < 15:
    print("<15")
else:
    print(">=15")
~~~

The code within the \`else\` block will only get run if the previous \`if\` block result was \`False\`.
This \`else\` needs to come *directly* after the \`if\`, so something like this, with unindented code inbetween, would not work:

~~~python
if x < 15:
    print("<15")
print("test")
else:
    print(">=15")
~~~

## If This, If That...

Another tool in our arsenal is *nesting* - because any code can go within the indented if block, we can add further indents to branch into more than 2 outcomes:

~~~python
if age < 18:
    print("Underage, you get cheaper tickets!")
else:
    print("Adult")
    if is_student:
        print("Adult Student, you get cheaper tickets!")
    else:
        print("Adult Non-Student, full price ticket please.")
~~~

This avoids having to recheck \`age >= 18\` for the two outcomes which are double indented.

## Challenge #1

With these new tools, let's work on some code to display the expected ticket price for an entrant.

The logic for ticket prices are as follows:

* Ages 5 and under are free ($0 ticket price)
* Ages between 6 and 14 have a ticket price of $10
* Ages between 15 and 18 have a ticket price of $18
* Ages between 19 and 59 have a ticket price of $25
* Ages 60 and up have a ticket price of $15

However for certain age ranges, being a student reduces the price of a ticket:

* Students between the ages of 15 and 18 only pay $13
* Students between the ages of 19 and 59 only pay $20

To make sure you're using the tools from this notebook, you need to solve this problem two ways:

* Once, without using the keywords \`and\`, \`or\` or \`not\`
* Once, while only using the keywords \`if\` and \`else\` 7 times each.


TODO: Make a counter for this stuff in the editor
TODO: This would benefit from showing different solutions in the slide after, I think.
`;
const cond3Code = {
  "code.py": makeCode(`\
age = 26
is_student = False
# Code goes here :)
# Set ticket_price within some conditionals.


print("You'll have to pay", ticket_price)
`)
}
const cond3Ref = createRef<Terminals>();
export const cond3 = (
<ProblemDetail
  markdown_text={cond3MD}
  template_code={cond3Code}
  game_ref={cond3Ref}
  startScript='code.py'
  nextLink="/notebooks/conditions/4">
  <Terminals ref={cond3Ref} />
</ProblemDetail> );

const cond4MD = `\
## Elif

While nesting is useful, as you might have seen in the previous challenge, it can go overboard when all you want to do is check a few different conditions:

~~~python
if age < 18:
    print(1)
else:
    if age < 25:
        print(2)
    else:
        if age < 40:
            print(3)
        else:
            print(4)
            # ...
~~~

And this pattern, where we want to do something if condition 1 is true, then something if condition 1 is false, but condition 2 is true, and so on, is so common that Python has a keyword for it: \`elif\`.

This is a shortening of \`else\`, followed by \`if\`. And if you look at the code above, squishing together each \`else\` with the following \`if\` gives us this code:

~~~python
if age < 18:
    print(1)
elif age < 25: # Originally else: (new line) if age < 25:
    print(2)
elif age < 40: # Originally else: (new line) if age < 40:
    print(3)
else:
    print(4)
    # ...
~~~

Notice this is different from just using replacing \`elif\` with \`if\` - the code would print 1, 2 and 3 if \`age = 12\`.
Also, our \`else\` block is still there, and will only run if *all* the previous conditions are false.

## Challenge #2

Now that we've learnt a bunch more, let's use our turtle to crack into a vault!

The vault is blocked by a key, which fortunately our turtle is small enough to fit into.
The vault only opens when the correct buttons are pushed in the mechanism, can you help us?
`;

/* Solution:
from turtle.movement import *
from turtle.sense import read_color

col = read_color()
extra = 0
if col == "red":
  extra = 20
elif col == "green":
  extra = 30
elif col == "blue":
  extra = 40
forward(17.5 + extra)

left(90)
forward(12.5)
backward(12.5)
left(90)
forward(extra)
right(90)
forward(50)
left(90)
forward(17.5)
right(180)

# Repeat 3 more times
*/
const cond4Code = {
  "code.py": makeCode(`\
from turtle.movement import *
shift_right(12.5)
forward(70)
`)
}
const cond4Ref = createRef<Turtles>();
export const cond4 = (
<ProblemDetail
  markdown_text={cond4MD}
  template_code={cond4Code}
  game_ref={cond4Ref}
  startScript='code.py'
  nextLink="/notebooks/loops/1">
  <Turtles areaHeight={100} areaWidth={200} ref={cond4Ref}
    splotches={(state: any) => [
      {x: 32.5, width: 5, y: 62.5, height: 5, color: "#ff0000"},
      {x: 32.5, width: 5, y: 72.5, height: 5, color: "#00ff00"},
      {x: 32.5, width: 5, y: 82.5, height: 5, color: "#0000ff"},
      {x: 82.5, width: 5, y: 62.5, height: 5, color: "#ff0000"},
      {x: 82.5, width: 5, y: 72.5, height: 5, color: "#00ff00"},
      {x: 82.5, width: 5, y: 82.5, height: 5, color: "#0000ff"},
      {x: 132.5, width: 5, y: 62.5, height: 5, color: "#ff0000"},
      {x: 132.5, width: 5, y: 72.5, height: 5, color: "#00ff00"},
      {x: 132.5, width: 5, y: 82.5, height: 5, color: "#0000ff"},
      {x: 182.5, width: 5, y: 62.5, height: 5, color: "#ff0000"},
      {x: 182.5, width: 5, y: 72.5, height: 5, color: "#00ff00"},
      {x: 182.5, width: 5, y: 82.5, height: 5, color: "#0000ff"},

      {x: 10, width: 10, y: 20, height: 10, color: state.colors[state.keys[0]]},
      {x: 60, width: 10, y: 20, height: 10, color: state.colors[state.keys[1]]},
      {x: 110, width: 10, y: 20, height: 10, color: state.colors[state.keys[2]]},
      {x: 160, width: 10, y: 20, height: 10, color: state.colors[state.keys[3]]},

      {x: 12.5, width: 5, y: 2.5, height: 5, color: state.dead ? "#ff0000" : (state.activated[0] ? "#00ff00" : "#666666")},
      {x: 62.5, width: 5, y: 2.5, height: 5, color: state.dead ? "#ff0000" : (state.activated[1] ? "#00ff00" : "#666666")},
      {x: 112.5, width: 5, y: 2.5, height: 5, color: state.dead ? "#ff0000" : (state.activated[2] ? "#00ff00" : "#666666")},
      {x: 162.5, width: 5, y: 2.5, height: 5, color: state.dead ? "#ff0000" : (state.activated[3] ? "#00ff00" : "#666666")},
    ]}
    buttons={(staleState: any) => {

      const buttons = [];
      for (let x = 0; x < 4; x ++) {
        for (let y = 0; y < 3; y ++) {
          buttons.push({
            x: 30 + 50 * x,
            width: 5,
            y: 60 + 10 * y,
            height: 5,
            onPress: (newState: any) => {
              const newActivated = [...newState.activated];
              let newDead = newState.dead;
              if (newState.keys[x] === y) {
                newActivated[x] = true;
              } else {
                newDead = true;
              }
              return {...newState, dead: newDead, activated: newActivated}
            }
          })
        }
      }
      return buttons;
    }}
    initialCustomState={() => {
      const keys: Array<number> = [];
      const colors = ["#ff0000", "#00ff00", "#0000ff"]
      const length = 4;
      for (let x=0; x<length; x++) {
        keys.push(Math.floor(Math.random() * colors.length));
      }
      const activated = Array.from({length: length}, () => false);

      return {
        dead: false,
        colors,
        keys,
        activated,
      }
    }}
    walls={(state: any) => {
      const walls = [
        {x: 0, width: 200, y: 10, height: 5, color: "#000000"},
        {x: 45, width: 5, y: 50, height: 60, color: "#000000"},
        {x: 45, width: 5, y: 10, height: 20, color: "#000000"},
        {x: 95, width: 5, y: 50, height: 60, color: "#000000"},
        {x: 95, width: 5, y: 10, height: 20, color: "#000000"},
        {x: 145, width: 5, y: 50, height: 60, color: "#000000"},
        {x: 145, width: 5, y: 10, height: 20, color: "#000000"},
      ]
      if ((state.activated.filter((x: boolean) => !x).length !== 0) || state.dead) {
        walls.push({
          x: 190, width: 10, y: 0, height: 120, color: "#444444"
        })
      }
      return walls;
    }}
    beginTransform={{
      x: 15,
      y: 25,
      bearing: 180,
    }}
  />
</ProblemDetail> );
