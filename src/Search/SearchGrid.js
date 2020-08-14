﻿import React from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { filterBy } from '@progress/kendo-data-query';
import { process } from '@progress/kendo-data-query';
import FilterDrawer from "../Filter/FilterDrawer";
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import SonarFilter from '../Filter/SonarFilter';
import { Tween, Timeline } from 'react-gsap';
import { ColumnMenu } from './columnMenu.js';
import { emptyStatement } from '@babel/types';

class CustomCell extends React.Component {
    render() {
        const value = "https://sonar-embed.seastarsolutions.com/productImages/product/" + this.props.dataItem[this.props.field];
        return (<td><img className="thumbnail" src={value} /></td>);
    }
}

class SearchGrid extends React.Component {
    gridWidth = 600;
    lastSuccess = '';
    pending = '';
    payload = false;
    baseUrl = 'http://10.92.48.29:9002/api/SimpleSearch/GetProducts/';
    init = { method: 'GET', accept: 'application/json', headers: {} };

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            results: [],
            columns: [
                { field: "productNumber", title: "Product #", width: 120 },
                { field: "interchangeNumber", title: "interchange", width: 120 },
                { field: "categoryParent", title: "Parent category", width: 150 },
                { field: "categoryChild", title: "Child category", width: 150 },
                { field: "description", title: "description Long", width: 300 },
                { field: "description", title: "description", width: 300 },
                { field: "imagePath", title: "imagePath", cell: CustomCell, width: 200 },
                { field: "brandName", title: "brandName", width: 200 },
                { field: "engineId", title: "Engine Id", width: 150 },
                { field: "modelNumber", title: "Model Number", width: 250 },
                { field: "startYear", title: "Start Year", width: 100 },
                { field: "stopYear", title: "Stop Year", width: 100 },
                { field: "horsePower", title: "Horsepower", width: 100 },
                { field: "stroke", title: "stroke", width: 100 },
                { field: "liters", title: "liters", width: 100 },
                { field: "serialNumberStart", title: "Serial # Start", width: 100 },
                { field: "serialNumberStop", title: "Serial # Stop", width: 100 }
            ],
            columnsA: [
                { field: "productNumber", title: "Product #", width: 120 },
                { field: "interchangeNumber", title: "interchange", width: 120 },
                { field: "categoryParent", title: "Parent category", width: 150 },
                { field: "categoryChild", title: "Child category", width: 150 },
                { field: "description", title: "description", width: 300 },
                { field: "imagePath", title: "imagePath", cell: CustomCell, width: 300 },

            ],
            columnsB: [
                { field: "brandName", title: "brandName", width: 200 },
                { field: "engineId", title: "Engine Id", width: 150 },
                { field: "modelNumber", title: "Model Number", width: 250 },
                { field: "startYear", title: "Start Year", width: 100 },
                { field: "stopYear", title: "Stop Year", width: 100 },
                { field: "horsePower", title: "Horsepower", width: 100 },
                { field: "stroke", title: "stroke", width: 100 },
                { field: "liters", title: "liters", width: 100 },
                { field: "serialNumberStart", title: "Serial # Start", width: 100 },
                { field: "serialNumberStop", title: "Serial # Stop", width: 100 },
            ],
            skip: 0, take: 10,
            query: '',
            filter: {
                logic: "and",
                filters: [                   
                    { field: "description", operator: "contains", value: this.props.filter }
                ]
            },
            left: false,
            myGrid: null,
            searchTween: null,
            productSearch: true
        };
    }

    handleChange = (event) => {
        this.setState({ query: event.target.value });
    };

    onDataStateChange = (e) => {
        e.preventDefault();
        fetch(this.baseUrl + this.state.query, this.init)
            .then(response => response.json())
            .then(json => this.setState({ results: json.Data }));
        this.payload = true;
        this.setState({ active: true });
        
    };

    
    setPercentage = (percentage) => {
        return Math.round(this.gridWidth / 100) * percentage;
    }

    toggleDrawer = () => {
        if (this.state.left === false) {
            this.setState({ left: true });
        }
        if (this.state.left === true) {
            this.setState({ left: false });
        }
    }

    SearchTypeA = () => {
        this.setState({ productSearch: true });
    }

    SearchTypeB = () => {
        this.setState({ productSearch: false });
    }
    
    pageChange = (event, field) => {
        this.setState({
            skip: event.page.skip,
            take: event.page.take
        });      
    }

    columnHasValue = () => {
        let hasValue = false;   
        this.state.results.forEach(item => {
            if (item.engineId !== null && item.engineId !== "" && item.engineId !== undefined ) {
                hasValue = true;              
            }
        });
        return hasValue;    
    };
    
    render() {
    if (this.columnHasValue(this.state.columns.engineId) ) {
        var columnsToShow = this.state.columns.slice(7, 16).map((column, index) => {        
            return <Column field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} columnMenu={ColumnMenu} />;     
        })
    }
    else {
        var columnsToShow = this.state.columns.slice(0, 6).map((column, index) => {        
            return <Column field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} columnMenu={ColumnMenu} />;     
        })

    }

        return (
            <div className="SimpleSearch">
                <div className={this.state.active ? 'activeSearch' : 'searchCon'}>
                    <form className="searchBar" onSubmit={this.onDataStateChange}>
                        <input placeholder="SEARCH" type="text" name="query" value={this.state.query} onChange={this.handleChange} />
                        <button type={'submit'} className="k-button"><span>Search</span>
                            <div className="arrow-con"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68.85 30.49"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path className="arrow" d="M53.25.35l14.89 14.89-14.89 14.9M0 15.24h63.22" /></g></g></svg></div>
                        </button>
                    </form>
                    {/* <h3>Your searching for: {this.state.query}</h3> */}
                </div>

                <div className={this.state.active ? 'activeToggle' : 'hiddenToggle'}>
                    <Button onClick={this.SearchTypeA}>I'm looking for Parts</Button>
                    <Button onClick={this.SearchTypeB}>I'm looking for Engines</Button>
                </div>

                <div className={this.payload === true ? 'visigrid' : 'hider'}>
                    <Grid
                        ref={div => this.gridWidth = div}
                        style={{ height: '600px' }}
                        sortable
                        onDataStateChange={this.dataStateChange}
                        data={filterBy(this.state.results.slice(this.state.skip, this.state.take + this.state.skip))}
                        total={this.state.results.length}
                        skip={this.state.skip}
                        take={this.state.take}
                        pageable={true}
                        onPageChange={this.pageChange}
                    >
                        {/* {this.state.productSearch ? columnsToShowA : columnsToShowB} */}
                        {columnsToShow}
                    </Grid>
                </div>
                {/*<FilterDrawer />*/}
                <Drawer open={this.state.left} onClose={this.toggleDrawer}>
                    <Button onClick={this.toggleDrawer}>Open Left</Button>
                    <SonarFilter />
                </Drawer>
            </div>
        );
    }
}

export default SearchGrid;