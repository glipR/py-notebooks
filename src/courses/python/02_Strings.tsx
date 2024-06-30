import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import Terminals from "../../games/Terminal/Terminal";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";

const strings1MD = `\
## Strings

Now that we've got numbers under control, let's start on the next type of data python can deal with: *Strings*.

When writing programs, we often want to show text on the screen. For this, we need some data to represent the text. But we need Python to know we are writing text, and not code!

For example, if I wanted to show 'print' on the terminal, I might try running \`print( print )\`, but Python has no idea what we *want* it to do, so it just takes whatever is written at face value - it knows \`print\` is the name of a function, so it shows that in the terminal instead.

To let Python know we are writing text data rather than code, we surround the text in **quotes**, Like \`'\` or \`"\`.

Run the Python on the right and see the difference between \`print(print)\` and \`print("print")\`

You can also do some of the same operations we did on numbers with strings too!
`;
const strings1Code = {
  "code.py": makeCode(`\
print(print) # I'm a comment! Try using quotation marks to surround the inner print!
# Python won't look at any text after a \`#\` symbol in the line.

print("X" + "Y")
# Notice how we have to include the spaces within the quotation marks to include them in the final data.
print("My " + "name " + "is " + "<Your Name Goes Here>")
print("Ha" * 3)
`)
}
const strings1Ref = createRef<Terminals>();
export const strings1 = (
<ProblemDetail
  markdown_text={strings1MD}
  template_code={strings1Code}
  game_ref={strings1Ref}
  startScript='code.py'
  startX={420}
  nextLink="/notebooks/strings/2">
  <Terminals ref={strings1Ref} />
</ProblemDetail> );

const strings2MD = `\
## Challenge

Strings aren't too complicated once you're comfortable with adding text together.

One other trick - you can put multiple bits of data inside \`print( )\`, separated by commas, and it will print the bits of data separated by a space!

Using the code on the right, print the following essay:

~~~
A: Hey, want to hear a joke about "<topic>"?
B: Yes please! I love jokes.
A: What did the <insert setup TODO>
B: What?
A: They <insert punchline TODO>
B: Haha! That's a great joke! I love jokes about "<topic".
~~~

:::note{.warning}
If you get an error when running your code: \`Syntax Error: unterminated string literal\`, or something similar,
it's probably because the text you want to print contains the same quotation marks as the ones you are using to contain the text!

For example, \`print('What's the time?')\` will fail because your text (which contains a \`'\`), is bookended by \`'\`. You can fix this by changing the surrounding \`'\` to \`"\`, or vice-versa.
:::
`;
const strings2Code = {
  "code.py": makeCode(`\
# Remember that Python can show strings in a few different ways, two of them being ' and "
# If you have text containing either symbol, use the other!
print("A:", 'Hey, want to hear a joke about "<topic>"?')
print("B:", "Yes please!", "I love jokes.")
print("A: " + "What did the " + "<insert setup TODO>")
# Continue below...
`)
}
const strings2Ref = createRef<Terminals>();
export const strings2 = (
<ProblemDetail
  markdown_text={strings2MD}
  template_code={strings2Code}
  game_ref={strings2Ref}
  startScript='code.py'
  startX={600}
  nextLink="/notebooks/variables/1">
  <Terminals ref={strings2Ref} />
</ProblemDetail> );
