import { createRef } from "react";
import { makeCode } from "../../components/MultiFileEditor/MultiFileEditor";
import Terminals from "../../games/Terminal/Terminal";
import ProblemDetail from "../../pages/ProblemDetail/ProblemDetail";

const intro1MD = `\
## TODO
`;
const intro1Code = {
  "code.py": makeCode(`\
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
  startScript='code.py'>
  <Terminals ref={intro1Ref} />
</ProblemDetail> );
