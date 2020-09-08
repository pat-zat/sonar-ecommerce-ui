import React from 'react';
import ReactDOM from 'react-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './simpleSearch.scss';
import './ui.scss';
import './site.css';


ReactDOM.render(
    <SimpleReactLightbox><App /></SimpleReactLightbox>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
