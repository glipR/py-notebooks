import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import Terminals from "../../games/Terminal/Terminal";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";

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

Let's disect the structure here:

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
#     print("Commander", astronaut, "ready for liftoff")
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
TODO: \`and\`, \`or\`, \`not\`
`;
const cond2Code = {
  "code.py": makeCode(`\
`)
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
TODO: \`else\` and \`elif\`
`;
const cond3Code = {
  "code.py": makeCode(`\
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
TODO: Challenge utilising more complex stuff all together.
`;
const cond4Code = {
  "code.py": makeCode(`\
`)
}
const cond4Ref = createRef<Terminals>();
export const cond4 = (
<ProblemDetail
  markdown_text={cond4MD}
  template_code={cond4Code}
  game_ref={cond4Ref}
  startScript='code.py'>
  <Terminals ref={cond4Ref} />
</ProblemDetail> );
