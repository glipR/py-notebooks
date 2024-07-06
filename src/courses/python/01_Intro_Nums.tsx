import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import Terminals from "../../games/Terminal/Terminal";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";

const intro1MD = `\
## Welcome

Congratulations on starting your journey in Python.
It takes a lot of effort to start something new, and learning to program is a fun process that leaves you with a very powerful tool in the palm of your hands!

A bit of a disclaimer with this notebook, and learning programming in general - you aren't going to be making the most amazing things from day 1.
Programming Languages are just that - a language, and so the first few steps are pretty much always going to be learning the basics, and practicing those.

Let's first ask ourselves, what **are** the basics of a programming language, or maybe even more abstract - what is a programming language?

At it's heart, programs and all their tools are all about **data**. A program takes some data, then transforms it into some other data that we want.

For example:
* Text Programs like word take data of keystrokes from your keyboard and turn that into textual data and show it on the screen
* Search engines like google take in the data of your search query and turns this into a multitude of related documents
* Video programs take compressed data from video files and turn this into graphics data which your screen uses to show images

:::note{.success}
Try to think of different technologies you use, and what data they start with / what data they transform that into.
:::

## Data

So with that in mind, let's start this notebook by exploring what data we have at our fingertips with Python, and how we can transform it.

One of the most basic data structure is one you'll be very familiar with - *numbers*.

Numbers in python come in two main flavours:

* Integers (Fancy term for whole numbers, positive, negative and zero). Examples: \`4\`, \`-2\`, \`0\`
* Floating Point (Technical term for decimals, we'll explore it later). Examples: \`3.2\`, \`0.5\`, \`-12.8\`

How I've written them above is exactly how you write them in python code. Simple right? You can also *transform* this data using the symbols you normally see in math:
* \`+\`: Adds numbers together (plus, Written with Shift and \`=\`)
* \`-\`: Subtracts one number from another (minus, This is the dash key on your keyboard)
* \`*\`: Multiplies two numbers (times, Written with Shift and \`8\`)
* \`/\`: Divides two numbers (This is the forward slash key on your keyboard)

One final tool you'll have to trust me about for now is the \`print\` function. When you write \`print( )\`, any data in-between the brackets will be shown in the terminal window below.

## Using this notebook

With that in mind, you should be able to have a play around with the code on the right. Press the "Play" button at the top right of the screen to run your Python code, and see the output in the bottom right terminal window!
You can also use the bars separating the left/right and top/bottom of the screen to resize windows to your liking.

This is a slow start but the start of a very exciting journey ahead. Press the "Next" button when you're ready for your first challenge!

:::note{.success}
While this notebook aims to have a lot of interesting challenges along the way to make sure you understand the basics, python is like any other tool - you get better with practice and experimentation.
One thing to always keep in mind is that running Python code is free! No one will ever get mad at you if you run some Python code and it doesn't work (well, maybe once you get a job in Python)

For now though - if there's something you're unsure of or something you think might work, then just try running the code! Try to avoid searching up answers as much as you can. The worst thing that happens is your code crashes, and even then you learn something about why it crashed.

**NEVER STOP EXPERIMENTING!**
:::
`;
const intro1Code = {
  "code.py": makeCode(`\
print(3)
print(3 + 4)
print(5 - 2)
print(3 * 3)
print(10 / 3)
`)
}
const intro1Ref = createRef<Terminals>();
export const intro1 = (
<ProblemDetail
  markdown_text={intro1MD}
  template_code={intro1Code}
  game_ref={intro1Ref}
  startScript='code.py'
  startX={735}
  nextLink="/notebooks/intro/2">
  <Terminals ref={intro1Ref} />
</ProblemDetail> );

const intro2MD = `\
## Challenge #1

Run the code on the right and see what happens - four numbers are printed.

Now, modify the green sections of code on the right so that it prints these four numbers:

* 10
* 24
* 37
* 10 (or 10.0)

:::note{.info}
Having trouble? Just try putting in some different operations and look at the results in the terminal after pressing "Run".

Python looks at operators in the same order you learn in school - BODMAS, PEMDAS, BIDMAS, whatever you want to call it.
:::
`;
const intro2Code = {
  "code.py": makeCode(`\
print(7| - |3)
print(2| + |3| / |4)
print(32| / |10| * |5)
print((4| + |2)| - |(24| + |12))
`, '|', true, true)
}
const intro2Ref = createRef<Terminals>();
export const intro2 = (
<ProblemDetail
  markdown_text={intro2MD}
  template_code={intro2Code}
  game_ref={intro2Ref}
  startScript='code.py'
  nextLink="/notebooks/intro/3">
  <Terminals ref={intro2Ref} />
</ProblemDetail> );

const intro3MD = `\
## Challenge #2

Run the code on the right and see what happens - three numbers are printed.

Now, modify the green sections of code on the right so that it prints these three numbers:

* 12
* 9
* 17

:::note{.info}
Having trouble? Just try putting in some different numbers and seeing how your terminal changes when pressing the "Run" button.
You can solve this problem using only whole numbers.
:::

## Challenge #3

Think you've got the hang of it? Modify the same bits of code to give:

* 8.5
* -3
* 7 (or 7.0)

:::note{.hint}
This one you'll need to think outside the box a bit. You can write decimal numbers by simply writing them out in code with a decimal point in between, like \`8.5\`.
:::
`;
const intro3Code = {
  "code.py": makeCode(`\
print( 3 +| 4 |)
print(| 3.5 |-| 1.5 |)
print( ( 4 *| 2 |) + 1 )
`, '|', true, true)
}
const intro3Ref = createRef<Terminals>();
export const intro3 = (
<ProblemDetail
  markdown_text={intro3MD}
  template_code={intro3Code}
  game_ref={intro3Ref}
  startScript='code.py'
  nextLink="/notebooks/strings/1">
  <Terminals ref={intro3Ref} />
</ProblemDetail> );
