import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import LoaderGrid from './components/Search/LoaderGrid';


const Routes = ()=>{
  return (
    <Layout>
      <div>
        <Route exact path="/" component={Home}/>

              <Route path="/searchc" component={LoaderGrid} />  
      </div>
    </Layout>
  );
};

export default Routes;
