import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './main.js';
import {addStyles} from 'react-mathquill'
import {Helmet} from 'react-helmet'

addStyles();


ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>DS en ligne</title>
    </Helmet>
    <Main />
  </React.StrictMode>,
  document.getElementById('root'),
);

