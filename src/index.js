import React from 'react';
import ReactDOM from 'react-dom';
import { AppProviders } from 'context';
import { Profiler } from 'components/profiler';
import { loadDevTools } from './dev-tools/load';
import App from './App';
import './bootstrap';
import reportWebVitals from './reportWebVitals';

// eslint-disable-next-line react/no-render-return-value
loadDevTools(() => ReactDOM.render(
  <Profiler id="App root" phases={['mount']}>
    <AppProviders>
      <App />
    </AppProviders>
  </Profiler>,
  document.getElementById('root'),
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
