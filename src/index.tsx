import React, { createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import GridSquares from './games/GridSquares/GridSquares';
import Turtles from './games/Turtle/Turtle';
import ProblemDetail from './pages/ProblemDetail/ProblemDetail';
import * as markdowns from './markdown_texts';
import * as templates from './code_templates';

const container = document.getElementById('root')!;
const root = createRoot(container);

let ref1 = createRef<GridSquares>();
let ref2 = createRef<Turtles>();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/noteboooks/1",
    element: (
    <ProblemDetail markdown_text={markdowns.WELCOME_MARKDOWN} template_code={templates.CUBES_CODE} game_ref={ref1}>
      <GridSquares ref={ref1} gridHeight={3} gridWidth={10} />
    </ProblemDetail>
    )
  },
  {
    path: "/noteboooks/2",
    element: (
    <ProblemDetail markdown_text={markdowns.TURTLE_MARKDOWN} template_code={templates.TURTLE_CODE} game_ref={ref2}>
      <Turtles ref={ref2} areaHeight={100} areaWidth={100} />
    </ProblemDetail>
    )
  }
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
