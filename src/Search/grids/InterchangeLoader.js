import React from 'react';
import ReactDOM from 'react-dom';
import { process } from '@progress/kendo-data-query';

export class InterchangeLoader extends React.Component {
    advSearchUrl = 'http://10.92.48.29:9002/api/AdvancedSearch/Details/';
    init = { method: 'GET', accept: 'application/json', headers: {} };

    lastSuccess = '';
    pending = '';
    requestDataIfNeeded = () => {
        if ( this.props.interSearch === true && this.props.advancedSearchType === "Interchange") {
        if ((this.pending || JSON.stringify(this.props.dataState) === this.lastSuccess) || (this.props.search === false)) {
            console.log("request returned");
            return;
        }

        this.pending = JSON.stringify(this.props.dataState);

        console.log("requestingIfNeeded Ran");

       
            console.log("intercahnge ran");
            fetch(this.advSearchUrl + '?id=interchange&oeNumber=' + this.props.oenumber, this.init)
                .then(response => response.json())
                .then(json => {
                    this.lastSuccess = this.pending;
                    this.pending = '';
                    if (JSON.stringify(this.props.dataState) === this.lastSuccess) {
                        this.props.onDataRecieved.call(undefined, {
                            data: process(json.Data, this.props.dataState),
                            total: json['@odata.count']
                        });
                        //console.log("sierra search fetch" + this.pending);
                        this.lastSuccess = '';
                        this.pending = '';
                    } else {
                        this.requestDataIfNeeded();
                    }
                });
        }

        else {
            return;
        }
    }

    render() {
        this.requestDataIfNeeded();
        return this.pending && <LoadingPanel />;
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

