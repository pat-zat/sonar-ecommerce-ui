import React from 'react';
import ReactDOM from 'react-dom';
import { process } from '@progress/kendo-data-query';

export class SierraLoader extends React.Component {
    advSearchUrl = 'http://10.92.48.29:9002/api/AdvancedSearch/Details/';
    init = { method: 'GET', accept: 'application/json', headers: {} };

    lastSuccess = '';
    pending = '';
    requestDataIfNeeded = () => {
        if ( this.props.sierraSearch === true && this.props.advancedSearchType === "sierra") {
        if ((this.pending || JSON.stringify(this.props.dataState) === this.lastSuccess)) {
            console.log("request returned");
            return;
        }

        this.pending = JSON.stringify(this.props.dataState);
   
            console.log("sierra ran");
            fetch(this.advSearchUrl + '?id=' + 'sierrapart'
                + '&parentCategoryId=' + this.props.parentCategoryId
                + '&parentCategoryName=' + this.props.parentCategoryName
                + '&childCategoryId=' + this.props.childCategoryId
                + '&childCategoryName=' + this.props.childCategoryName
                + '&productNumber=' + this.props.productNumber
                + '&queryType=' + this.props.queryType,
                this.init)
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

