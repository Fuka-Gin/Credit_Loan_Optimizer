import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import $ from 'jquery'; 
import Popper from 'popper.js'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";

const history = createBrowserHistory({
  future: {
    v7_startTransition: true,  // Opt-in to startTransition changes
    v7_relativeSplatPath: true // Opt-in to relative Splat path changes
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();