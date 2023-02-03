import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import App from './flow_1/App';
import reportWebVitals from './reportWebVitals';
import {setToLocalStorage} from "./utils/storage";
import * as themes from "./utils/theme/themeSchema.json"

const root = ReactDOM.createRoot(document.getElementById('root'));
setToLocalStorage('themes', themes.default);
console.log(themes.default);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
