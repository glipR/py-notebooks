import React, { createRef } from 'react';
import ProblemDetail from './pages/ProblemDetail/ProblemDetail'
import GridSquares from './games/GridSquares/GridSquares';

import * as markdowns from './markdown_texts';
import * as templates from './code_templates';

function App() {
  let ref = createRef<GridSquares>();
  return (
    <div className="App">
      <ProblemDetail markdown_text={markdowns.WELCOME_MARKDOWN} template_code={templates.CUBES_CODE} game_ref={ref}>
        <GridSquares ref={ref} gridHeight={3} gridWidth={10} />
      </ProblemDetail>
    </div>
  );
}

export default App;
