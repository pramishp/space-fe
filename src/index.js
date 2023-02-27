import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App, {Navigator} from "./App";
import PresentationWrapper from "./space/PresentationWrapper";

// WARNING: Memory Leak Detected.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*<Workspace />*/}
    <App />
    {/*  <PresentationWrapper/>*/}
    <Navigator/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
