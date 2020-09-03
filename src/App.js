import React from 'react';
import { Router } from "react-router-dom";
import '@progress/kendo-theme-material/dist/all.css';
import { Link } from 'react-router-dom';

import history from './history';
import UncontrolledLottie from "./Sonar/UncontrolledLottie";
import SvgSierra from './Sonar/SvgSierra.js';
import RouterControl from './Search/RouterControl';

window.onpopstate = function (event) {
 // window.location.reload();
 //removing this stopped page reload on back.forward...and the url still changes
};

function App() {
  return (
    <Router history={history} forceRefresh={true} >
      <div>
        <div className="top-bar">
          <Link to="/"><div className="top-third"><SvgSierra /></div></Link>
          <div className="Logo"><div className="lottieLogo"><UncontrolledLottie ></UncontrolledLottie></div></div>
          {/*<div className="top-third flex-end"><div></div></div>*/}
        </div>
        <RouterControl />
      </div>
    </Router>
  );
}

export default App;
