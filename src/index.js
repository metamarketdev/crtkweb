import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MoralisProvider } from "react-moralis";
import './index.scss';

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL

ReactDOM.render(
  <MoralisProvider
    appId={appId}
    serverUrl={serverUrl}
  >
    <App />
  </MoralisProvider>,
  document.getElementById('root')
);
