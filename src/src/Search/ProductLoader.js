import React from 'react';
import ReactDOM from 'react-dom';
import { process } from '@progress/kendo-data-query';

export class ProductLoader extends React.Component {
    baseUrl = 'http://10.92.48.29:9002/api/SimpleSearch/GetProducts/';
    catsUrl = 'http://10.92.48.29:9002/api/FilterSet/Details/';
    advSearchUrl = 'http://10.92.48.29:9002/api/AdvancedSearch/Details/';
    init = { method: 'GET', accept: 'application/json', headers: {} };

    lastSuccess = '';
    pending = '';
    //1830753
    requestDataIfNeeded = () => {
        if ((this.pending || JSON.stringify(this.props.dataState) === this.lastSuccess) || (this.props.search === false)) {
            console.log("request returned");
            return;
        }

        this.pending = JSON.stringify(this.props.dataState);

        console.log("requestingIfNeeded Ran");
        if (this.props.searchingForCats === true) {
            console.log(this.props.cat);
            fetch(this.catsUrl + this.props.cat, this.init)
            .then(response => response.json())
            .then(json => {
                this.lastSuccess = this.pending;             
                this.pending = '';
    
                if (JSON.stringify(this.props.dataState) === this.lastSuccess) {
                    this.props.onDataRecieved.call(undefined, {
                        data: process(json.Data, this.props.dataState),
                        total: json['@odata.count']
                    });
                    this.lastSuccess = '';
                } else {
                    this.requestDataIfNeeded();
                }
            });
        }
        else if (this.props.advancedSearchType === 'Interchange' && this.props.releaseSearch === true && this.pending !== "") {
            console.log("interchange ran");
            fetch(this.advSearchUrl + '?id=' + 'interchange' + '&oeNumber=' + this.props.oenumber, this.init)
                .then(response => response.json())
                .then(json => {
                    this.lastSuccess = this.pending;
                    this.pending = '';
                    if (JSON.stringify(this.props.dataState) === this.lastSuccess) {
                        this.props.onDataRecieved.call(undefined, {
                            data: process(json.Data, this.props.dataState),
                            total: json['@odata.count']
                        });
                        //console.log("Interchange search fetch" + this.lastSuccess);
                        this.lastSuccess = '';
                    } else {
                        this.requestDataIfNeeded();
                    }
                });
        }

        if (this.props.advancedSearchType === 'brand' && this.props.releaseSearch === true) {
            console.log(this.props.myLocation.search);
            if ( this.props.storeStack.includes(this.props.myLocation.search) === false ) {
                fetch(this.advSearchUrl + '?id=' + 'brandmodel'
                + '&brand=' + this.props.brand
                + '&modelNumber=' + this.props.modelNo
                + '&year=' + this.props.year
                + '&hp=' + this.props.hp
                + '&serialNumber=' + this.props.serialNo
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
                    }
                });
            }
            
        }

        if (this.props.advancedSearchType === 'sierra' && this.props.releaseSearch === true) {
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

