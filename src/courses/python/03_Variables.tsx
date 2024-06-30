import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import Terminals from "../../games/Terminal/Terminal";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";

const variables1MD = `\
## Variables

Ok, data is all well and good, and we can print this to the screen, but we aren't doing much transforming are we? It's just math equations!

Well, it'll be a little while longer before we can properly do complex transformations. But we can start by adding some intermediate steps to our transformations.

In a recipe, often you'll get steps which you do one after the other:

1. Crack the egg over a bowl
2. Whisk the egg
3. Mix in some sugar
4. ...

But for now, all of our transformations have been done on a single line, before getting printed.

What our toolbox needs is a way to save the result of some transformations, so we can keep applying stuff, For example:

1. Pick a number
2. Double it
3. Add 3
4. Print your number

We can do this with variables! We can write \`my_variable = <some data>\` to associate some data with the name \`my_variable\`, so we can use that name later to reference the exact same data!
What do I mean by this? I mean you can do some calculation, store the result, and then retrieve that result in a later print function:

~~~python
my_addition = 3 + 5
print(my_addition)
~~~

In fact, we can use variables anywhere where normal data would be valid - so we can do more computation on top of that!

~~~python
variable_num = 3 + 5
print(variable_num + 10)
~~~

And, most importantly, we can use variables when defining other variables!

~~~python
variable1 = 2 + 4
variable2 = variable1 / 2
print(variable1, "divided by", 2, "equals", variable2)
~~~
`;
const variables1Code = {
  "code.py": makeCode(`\
# Try me out with other values!
# Add more variables!

variable1 = 2 + 4
variable2 = variable1 / 2
print(variable1, "divided by", 2, "equals", variable2)

# We can redefine variables by simply writing another \`=\` statement
variable1 = 10 * 2
variable2 = variable1 + 5
print(variable1, "plus", 5, "equals", variable2)
`)
}
const variables1Ref = createRef<Terminals>();
export const variables1 = (
<ProblemDetail
  markdown_text={variables1MD}
  template_code={variables1Code}
  game_ref={variables1Ref}
  startScript='code.py'
  nextLink="/notebooks/variables/2">
  <Terminals ref={variables1Ref} />
</ProblemDetail> );

const variables2MD = `\
## Challenge #1
On the right is some template code which modifies variables, and then prints the result.

Modify the template so the program takes the number in \`var1\`, and:

* Doubles the value, then
* Multiplies the value by the original value \`var1\`, then
* Subtracts 5 and stores the value in \`result\`.

So, for \`var1 = 4\`, our steps should:

* Double the value (Currently: 8)
* Multiply the value by the original value \`var1\` (Currently: 8 * 4 = 32)
* Subtracts 5 and stores the value in \`result\`. (Finally 32 - 5 = 27)

:::note{.hint}
If you're having trouble figuring out where your code goes wrong, feel free to add extra \`print\` statements in between variable setting so you can test every step of the process independently.

~~~python
var1 = 4
double_it = ...
print(var1, "becomes", double_it)
...
print(result)
~~~
:::
`;
const variables2Code = {
  "code.py": makeCode(`\
|var1 = 4|
double_it = ?
# ... What goes here?
result = ?
|print(result)|
`, '|', false, false)
}
const variables2Ref = createRef<Terminals>();
export const variables2 = (
<ProblemDetail
  markdown_text={variables2MD}
  template_code={variables2Code}
  game_ref={variables2Ref}
  startScript='code.py'
  nextLink="/notebooks/variables/3">
  <Terminals ref={variables2Ref} />
</ProblemDetail> );

const variables3MD = `\
## Challenge #2

Let's get more comfortable with modifying variables with a few challenges.

First off, swapping variables. In the code example on the right, write some code that will move whatever is stored in a into b, and vice versa.

:::note{.warning}
Remember that each instruction is executed one after the other. So you can't execute any line that would overwrite \`a\` or \`b\` without first copying their value elsewhere.
:::

:::note{.hint}
Rather than worrying about getting \`a\` and \`b\` to have these new values. The problem would be a lot easier if we just had to store the swapped values in new variables \`c\` and \`d\`, right?
If so, then after doing that you're just one step away from updating \`a\` and \`b\`!
:::

`;
const variables3Code = {
  "code.py": makeCode(`\
a = "hello"
b = "world"
|# Your code here...
# You might need multiple lines|
print(b, a) # Should print 'hello world'
`, '|', true, false)
}
const variables3Ref = createRef<Terminals>();
export const variables3 = (
<ProblemDetail
  markdown_text={variables3MD}
  template_code={variables3Code}
  game_ref={variables3Ref}
  startScript='code.py'
  nextLink="/notebooks/variables/4">
  <Terminals ref={variables3Ref} />
</ProblemDetail> );

const variables4MD = `\
## Variables defining themselves?

Let's dig deeper into how variables actually work and are understood by Python. While the way we write variable setting looks like math equality, it's important we understand the key differences that sets the two apart.

When python sees \`var1 = <some expression>\`, it does the following (in this order):

1. Figure out the data represented by \`<some expression>\`. For example, \`5 + 3\` might represent the data \`8\`.
2. Associate the word \`var1\` with that data for all *future* instructions in the program.

The key things to note is that:
* Step 1 is completed before Step 2.
* Variable assignments only apply for all future instructions.

For example, this code makes sense in Math, but fails in Python (Try running it! Why does it fail?)

~~~python
z = y + x
x = 3
y = 5
print(z)
~~~

Whereas this code makes sense in Python, but is nonsensical in Math! (Without executing, what do you think the final value of \`var1\` is?)

~~~python
var1 = 1
print(var1)
var1 = var1 + var1
print(var1)
~~~

:::note{.info}
This works because we also figure out the data on the right hand side before associating with the left word.
So when we get to \`var1 = var1 + var1\`, we first evaluate \`var1 + var1\`. This is \`1 + 1 = 2\`, so then we set \`var1 = 2\`.
:::

Fix the code on the right so that 8 is printed for z.
`;
const variables4Code = {
  "code.py": makeCode(`\
z = y + x
x = 3
y = 5
print(z)

var1 = 1
print(var1)
var1 = var1 + var1
print(var1)
`)
}
const variables4Ref = createRef<Terminals>();
export const variables4 = (
<ProblemDetail
  markdown_text={variables4MD}
  template_code={variables4Code}
  game_ref={variables4Ref}
  startScript='code.py'
  nextLink="/notebooks/variables/5">
  <Terminals ref={variables4Ref} />
</ProblemDetail> );

const variables5MD = `\
## Challenge #3

Now we've got self-modification under our belt, let's cap variables off with one last challenge, then we can move onto more interesting stuff than this bland terminal in the bottom right.

The code on the right computes some value, but we're unsure what of.

In the green section, enter the number you think is stored in \`val\`. Don't worry too much about the last line of the code for now. We'll cover what it means in due time.

:::note{.hint}
Feeling stuck? Pull out a pen and paper and jot down the values of \`val\` after each line.
:::

:::note{.info}
Not a helpful hint, but how else could we make this code print \`true\` without guessing the value of \`val\`?
:::
`;
const variables5Code = {
  "code.py": makeCode(`\
val = 1
val = (val + val) * (val + val)
val = (val * 3) * (val - 2)
val = val - 20
print(val == |?|)
`, '|', true, true)
}
const variables5Ref = createRef<Terminals>();
export const variables5 = (
<ProblemDetail
  markdown_text={variables5MD}
  template_code={variables5Code}
  game_ref={variables5Ref}
  startScript='code.py'
  nextLink="/notebooks/functions/1">
  <Terminals ref={variables5Ref} />
</ProblemDetail> );
