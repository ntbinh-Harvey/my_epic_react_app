import React from "react";
import ReactDOM from "react-dom";
import { AuthProviders } from "context";
import { loadDevTools } from "./dev-tools/load";
import App from "./App";
import "./bootstrap";
import reportWebVitals from "./reportWebVitals";

loadDevTools(() =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <AuthProviders>
      <App />
    </AuthProviders>,
    document.getElementById("root")
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
