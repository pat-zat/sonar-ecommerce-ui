import * as React from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component{
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3 navbar">
            <NavMenu />
          </div>
          <div className="col-sm-12 ">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
