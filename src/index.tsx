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
import Terminals from './games/Terminal/Terminal';
import ProblemDetail from './pages/ProblemDetail/ProblemDetail';
import * as markdowns from './markdown_texts';
import * as templates from './code_templates';
import { PythonProvider } from 'react-py';
import { intro1, intro2, intro3 } from './courses/python/01_Intro_Nums';
import { strings1, strings2 } from './courses/python/02_Strings';
import { variables1, variables2, variables3 } from './courses/python/03_Variables';

const container = document.getElementById('root')!;
const root = createRoot(container);

let ref1 = createRef<GridSquares>();
let ref2 = createRef<Turtles>();
let ref3 = createRef<Terminals>();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/notebooks/1",
    element: (
    <ProblemDetail markdown_text={markdowns.WELCOME_MARKDOWN} template_code={templates.CUBES_CODE} game_ref={ref1} startScript='code.py'>
      <GridSquares ref={ref1} gridHeight={3} gridWidth={10} />
    </ProblemDetail>
    )
  },
  {
    path: "/notebooks/2",
    element: (
    <ProblemDetail markdown_text={markdowns.TURTLE_MARKDOWN} template_code={templates.TURTLE_CODE} game_ref={ref2} startScript='code.py'>
      <Turtles ref={ref2} areaHeight={100} areaWidth={200} splotches={[
        { x: 10, y: 10, width: 20, height: 20, color: '#ef476f' },
        { x: 70, y: 35, width: 60, height: 30, color: '#118ab2' },
        { x: 140, y: 20, width: 40, height: 60, color: '#06d6a0' },
      ]} />
    </ProblemDetail>
    )
  },
  {
    path: "/notebooks/3",
    element: (
    <ProblemDetail markdown_text={markdowns.WELCOME_MARKDOWN} template_code={templates.TERMINAL_CODE} game_ref={ref3} startScript='code.py'>
      <Terminals ref={ref3} />
    </ProblemDetail>
    )
  },
  {
    path: "/notebooks/intro/1",
    element: intro1,
  },
  {
    path: "/notebooks/intro/2",
    element: intro2,
  },
  {
    path: "/notebooks/intro/3",
    element: intro3,
  },
  {
    path: "/notebooks/strings/1",
    element: strings1,
  },
  {
    path: "/notebooks/strings/2",
    element: strings2,
  },
  {
    path: "/notebooks/variables/1",
    element: variables1,
  },
  {
    path: "/notebooks/variables/2",
    element: variables2,
  },
  {
    path: "/notebooks/variables/3",
    element: variables3,
  },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PythonProvider>
      <RouterProvider router={router} />
      </PythonProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
