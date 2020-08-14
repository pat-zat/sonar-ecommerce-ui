import React from 'react';
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import SearchBar from './SearchBar';
//import queryString from 'query-string';


export default function RouterControl() {
  let query = useQuery();

  //const parsed = queryString.parse(useLocation().search);
  return (
  
      <div>
        <Switch>
        {/* <Route  query={parsed} path="/api/SimpleSearch/GetProducts/" component={SearchBar} /> */}
      <Route  query={query.get("query")} path="/" component={SearchBar} /> 
          {/* <Route path="/api/SimpleSearch/GetProducts/:query" component={Results} /> */}
        </Switch>
      </div>
 
  );
}
//if url has query string send flag that request was made from url
function useQuery() {
  return new URLSearchParams(useLocation().search);
}


// function Results() {
//   // The `path` lets us build <Route> paths that are
//   // relative to the parent route, while the `url` lets
//   // us build relative links.
//   let { path, url } = useRouteMatch();
//   let query = useQuery();
//   return (
//     <div>  
//       <Switch>        
//         <Route path={`${path}/:query`} query={query.get("query")}>
//           <Result />
//         </Route>        
//       </Switch>
//     </div>
//   );
// }

// function Result({ query }) {
//   // The <Route> that rendered this component has a
//   // path of `/topics/:topicId`. The `:topicId` portion
//   // of the URL indicates a placeholder that we can
//   // get from `useParams()`.
//  // let { urlQuery } = useParams();

//   return (
//     <div>
     
//           <LoaderGrid urlQuery={query} />
       
//     </div>
//   );
// }