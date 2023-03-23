import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App, {Navigator} from "./App";
import PresentationWrapper, {PRESENTATION_TYPES} from "./space/PresentationWrapper";
import TestCanvasUI from "./space/Editor/components/xruitest";

// WARNING: Memory Leak Detected.
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/*<Workspace />*/}
    {/*  <App />*/}
    {/*  <PresentationWrapper/>*/}
    <Navigator/>

    {/*  <TestCanvasUI/>*/}
  </React.StrictMode>
);
var log = console.log
console.log = function () {
  log.apply (console, arguments);
  // Print the stack trace
  console.trace ();
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();