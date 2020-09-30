import React from 'react';
import ReactDOM from 'react-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import './index.css';
import App from './App';
import './simpleSearch.scss';
import './ui.scss';
import './site.css';


ReactDOM.render(
    <SimpleReactLightbox><App /></SimpleReactLightbox>,
    document.getElementById('root'));


