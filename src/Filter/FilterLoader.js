import React from 'react';
import ReactDOM from 'react-dom';
//import { toODataString } from '@progress/kendo-data-query';
import { process } from '@progress/kendo-data-query';

export class ProductLoader extends React.Component {
    baseUrl = 'http://10.92.48.29:9002/api/SimpleSearch/GetProducts/';
    catsUrl = 'http://10.92.48.29:9002/api/FilterItemSearch/Details/';
    //catsUrl = 'http://10.92.48.29:9002/api/SimpleSearch/GetProducts/';
    init = { method: 'GET', accept: 'application/json', headers: {} };

    lastSuccess = '';
    pending = '';
  
    requestDataIfNeeded = () => {
        
        if ((this.pending || JSON.stringify(this.props.dataState) === this.lastSuccess) || (this.props.search === false)) {
            return;
        }

     

        this.pending = JSON.stringify(this.props.dataState);
      
            console.log(this.props.cat);
            fetch(this.catsUrl + this.props.cat, this.init)
            .then(response => response.json())
            .then(json => {

                this.lastSuccess = this.pending;
               
                this.pending = '';

                
                if (JSON.stringify(this.props.dataState) === this.lastSuccess) {
                    // debugger;
                    this.props.onDataRecieved.call(undefined, {
                        data: process(json.Data, this.props.dataState),
                        total: json['@odata.count']
                    });
                    // try moving this up after the pending unset 
                    this.lastSuccess = '';
                    
                } else {
                    this.requestDataIfNeeded();
                }
            });
           
        }
      

    render() {
        this.requestDataIfNeeded();
        return this.pending && <LoadingPanel onChange={this.props.action} />;
    }
}


class LoadingPanel extends React.Component {
    render() {
        const loadingPanel = (
            <div className='k-loading-mask'>
                <span className="k-loading-text">Loading</span>
                <div className="k-loading-image"></div>
                <div className="k-loading-color"></div>
            </div>
        );

        const gridContent = document && document.querySelector('.k-grid-content');
        return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
    }
}

