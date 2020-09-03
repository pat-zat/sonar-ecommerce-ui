

import React from 'react';
import { SRLWrapper } from 'simple-react-lightbox'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { SimpleLoader } from './SimpleLoader.js';
import { process } from '@progress/kendo-data-query';
import Button from '@material-ui/core/Button';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout'
import $ from 'jquery';
import { Window } from '@progress/kendo-react-dialogs';
import history from '../../history.js';
import { Route, Link } from 'react-router-dom';

function setParams(location, skip) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("skip", skip || "0");
    return searchParams.toString();
}

class CustomCell extends React.Component {
    //conditional render jsx
    //if this.props.dataItem[this.props.field] === ""
    render() {
        const value = "https://sonar-embed.seastarsolutions.com/productImages/product/" + this.props.dataItem[this.props.field];
        return (<td><SRLWrapper><img className="thumbnail" src={value} alt='' /></SRLWrapper></td>);
    }
}

class SimpleGrid extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };

    productDetailsUrl = 'http://10.92.48.29:9002/api/SierraPartSearch/Details/';
    tabsUrl = 'http://10.92.48.29:9002/api/SierraPartPartialSearch/Details/?itemRow=';
    gridWidth = 600;

    constructor(props) {
        super(props);

        this.state = {
            left: false,
            windowVisible: false,
            gridClickedRow: {},
            productSearch: "product",
            detailType: 'product',
            active: false,

            products: { data: [], total: 0 },
            dataState: this.props.resetState,

            productDetailData: [],
            productDetailDataTab: [],

            columns: [
                { field: "saleItem", title: "Product #", width: 220 },
                { field: "categoryParent", title: "Parent category", width: 300 },
                { field: "categoryChild", title: "Child category", width: 300 },
                { field: "descriptionLong", title: "description", width: 300 },
                { field: "imagePath", title: "imagePath", cell: CustomCell, width: 300 },
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
            columnsA: [
                { field: "saleItem", title: "Product #", width: 220 },
                { field: "categoryParent", title: "Parent category", width: 300 },
                { field: "categoryChild", title: "Child category", width: 300 },
                { field: "descriptionLong", title: "description", width: 300 },
                { field: "imagePath", title: "imagePath", cell: CustomCell, width: 300 },
            ],
            columnsB: [
                { field: "brandName", title: "brandName" },
                { field: "engineId", title: "Engine Id" },
                { field: "startYear", title: "Start Year" },
                { field: "stopYear", title: "Stop Year"},
                { field: "horsePower", title: "Horsepower" },
                { field: "stroke", title: "stroke" },
                { field: "liters", title: "liters"},
                { field: "serialNumberStart", title: "Serial # Start" },
                { field: "serialNumberStop", title: "Serial # Stop"},
            ],
                     
            results: [],
        };
    }

    reset = () => { this.setState({ dataState: { take: 10, skip: 0 } }); }

    closeWindow = () => {
        this.setState({
            windowVisible: false
        });
    }

    handleSelect = (e) => {
        this.setState({ selected: e.selected })
    }

    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.forceUpdate();
    };

    updateURL = () => {
        let page = Math.round(this.state.dataState.skip / 10)
        const url = setParams({ skip: page });
        history.push("/simpleSearch/api/?id=simpleSearch&query=" + this.props.query + '&skip=' + page);
    };

    dataStateChange = (e) => {
        this.setState({
            ...this.state,
            dataState: e.data
        }, () => {
            this.updateURL();
        });
    }

    dataRecieved = (products) => {
        this.props.releaseAction();
        localStorage.setItem(this.props.location.search, JSON.stringify(this.state.products.data));
        let stack = [];
        for (var i = 0; i < localStorage.length; i++) {
            stack = localStorage.key(i);
        }
        this.setState({
            ...this.state,
            products: products,
            active: true,
            results: products.data
        });
        //console.log(this.state.products.data.data);
    }

    componentDidMount = () => {
        window.addEventListener("popstate", this.props.urlAction());

        if (this.props.urlQuery.skip !== '0') {
            this.setState({
                dataState: { skip: this.props.urlQuery.skip, take: 10 }
            });
        }

        this.props.urlQuery.query = "";

        if (this.props.urlQuery.itemRow) {
            let uId = this.props.urlQuery.itemRow;
            this.setState({
                windowVisible: true,
            });
            fetch(this.productDetailsUrl + uId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailData: json.Data }));
            fetch(this.tabsUrl + uId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailDataTab: json.Data }));
        }
    }
    handleGridRowClick1 = (e) => {
        window.scrollTo(0, 0);
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
        fetch(this.productDetailsUrl + e.dataItem.itemRow, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailData: json.Data }));
        fetch(this.tabsUrl + e.dataItem.itemRow, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailDataTab: json.Data }));
        history.push("/sierra/details/api/SimpleSearch/GetProducts/?itemRow=" + e.dataItem.itemRow);
    }

    columnHasValue = () => {
        let hasValue = false; 
        // console.log(this.state.products.data.data);  
        this.state.products.data.data.forEach(item => {
            if (item.engineId !== null && item.engineId !== "" && item.engineId !== undefined ) {
                hasValue = true;         
               // console.log("has value  " + item.engineId );       
            }
        });
        return hasValue;    
    }

    componentDidUpdate(prevProps, prevState) {
      
        if (this.state.products !== prevState.products) {
            console.log("prevState " + prevState.products.data.total);
            console.log("currentState " + this.state.products.data.total);
        }

        
      }

    render() {
        
        //let columnsToShow;
        if (this.state.active === true) {
            if (this.columnHasValue(this.state.columnsB.engineId) ) {
                var columnsToShow = this.state.columnsB.map((column, index) => {        
                    return <Column field={column.field} title={column.title} key={index} width={column.width}   />;   
                })
            }
            else {
                var columnsToShow = this.state.columnsA.map((column, index) => {        
                    return <Column field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;   
                })  
            }
        }
            
    
        // var columnsToShow = this.state.columns.map((column, index) => {
        //     return <Column field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;
        // })


        return (
            <div className="searchGrid">
                <div className={this.state.active ? 'activeToggle' : 'hiddenToggle'}><Button onClick={() => { this.setState({ dataState: { take: 10, skip: 0 } }); }}>Clear grid</Button></div>
                <div>
                    <div className={this.props.urlQuery.query !== "" ? 'visigrid' : 'hider'}>
                        <Grid
                            style={{ height: '600px' }}
                            ref={div => this.gridWidth = div}
                            pageable={true}
                            resizable={true}
                            take={this.state.dataState.take}
                            total={this.state.products.total}
                            {...this.state.dataState}
                            {...this.state.products}
                            onChange={this.props.action}
                            onDataStateChange={this.dataStateChange}
                            onRowClick={this.handleGridRowClick1}
                            filterable={true}
                            sortable={true}>
                            {columnsToShow}
                        </Grid>
                    </div>
                    <Route path="/simpleSearch/details">
                        {this.state.windowVisible && this.state.detailType === 'product' &&
                            <Window title="Product Details" onClose={this.closeWindow} >
                                <div className='detailsCon'>
                                    <div className="close-btn">
                                        <button onClick={this.closeWindow} className="k-button" >close</button>
                                    </div>
                                    {this.state.productDetailData.map(details =>
                                        <div>
                                            <h1>{"Item#:  " + details.sale_item}</h1>
                                            <div className='details'>
                                                <div className="flexrow startStop">
                                                    <div>Category: {details.categoryParent}</div>
                                                    <div>Subcategory: {details.categoryChild}</div>
                                                </div>
                                                <div className="flexrow">
                                                    <div>Description: {details.descriptionShort}</div>
                                                </div>

                                                <div className="flexrow">
                                                    <SRLWrapper><img src={"https://sonar-embed.seastarsolutions.com/productImages/product/" + details.imageDetails[0].fileName} alt='' /></SRLWrapper>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.productDetailDataTab.map(details =>
                                        <TabStrip selected={this.state.selected} onSelect={this.handleSelect}>
                                            <TabStripTab disabled={details.productDetails.length > 0 ? false : true} contentClassName='detailsTab' title="Details">
                                                <h2>Features</h2>
                                                <div>
                                                    {details.productDetails.map(productDetail =>
                                                        <div>{productDetail.attributeValue}</div>
                                                    )}
                                                </div>
                                            </TabStripTab>
                                            <TabStripTab disabled={details.productSpecs.length > 0 ? false : true} title="Specs">
                                                <div>
                                                    <h2>Specifications</h2>
                                                    {details.productSpecs.map(productSpec =>
                                                        <div>
                                                            <div><span>weight: </span>{productSpec.weight}</div>
                                                            <div><span>height: </span>{productSpec.height}</div>
                                                            <div><span>depth: </span>{productSpec.depth}</div>
                                                            <div><span>width: </span>{productSpec.width}</div>
                                                            <div><span>superceed: </span>{productSpec.superceed}</div>
                                                            <div><span>unitOfMeasure: </span>{productSpec.unitOfMeasure}</div>
                                                            <div><span>itemStatus: </span>{productSpec.itemStatus}</div>
                                                            <div><span>upc: </span>{productSpec.upc}</div>
                                                            <div><span>stdPkg: </span>{productSpec.stdPkg}</div>
                                                            <div><span>casePkg: </span>{productSpec.casePkg}</div>
                                                            <div><span>hsc: </span>{productSpec.hsc}</div>
                                                            <div><span>eccn: </span>{productSpec.eccn}</div>
                                                            <div><span>origin: </span>{productSpec.origin}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabStripTab>
                                            <TabStripTab disabled={details.interchangeDetails.length > 0 ? false : true} contentClassName='detailsTab' title="Interchange">
                                                <h2>Interchange</h2>
                                                <div>
                                                    {details.interchangeDetails.map(interchangeDetail =>
                                                        <div>
                                                            <div> {interchangeDetail.brandName}</div>
                                                            <div>{interchangeDetail.oeNumber}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabStripTab>

                                            {/* contains: 18-2771 */}
                                            <TabStripTab disabled={details.containsDetails.length > 0 ? false : true} contentClassName='detailsTab' title="Contains">
                                                <h2>Contains</h2>
                                                <div>
                                                    {details.containsDetails.map(containsDetail =>
                                                        <div>
                                                            <hr />
                                                            <div>{containsDetail.nssDesc}</div>
                                                            <div>{containsDetail.item}</div>
                                                            <div>{containsDetail.qty}</div>
                                                            <SRLWrapper><img className="conImg" alt='' src={"https://sonar-embed.seastarsolutions.com/productImages/product/" + containsDetail.image} /></SRLWrapper>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabStripTab>

                                            {/* docs: 18-8607 */}
                                            <TabStripTab disabled={details.documentDetails.length > 0 ? false : true} contentClassName='detailsTab' title="Documents">
                                                <h2>Documents</h2>
                                                <div>
                                                    {details.documentDetails.map(documentDetail =>
                                                        <div>
                                                            <h3>{documentDetail.docDescription}</h3>
                                                            <div>{documentDetail.docRow}</div>
                                                            <div>{documentDetail.docName}</div>
                                                            <div>{documentDetail.docType}</div>
                                                            <div>{documentDetail.LastUpdated}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabStripTab>
                                        </TabStrip>
                                    )}
                                </div>
                            </Window>
                        }
                    </Route>
                </div>
                <SimpleLoader
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                    query={this.props.urlQuery.query ? this.props.urlQuery.query : this.props.query}
                    simSearch={this.props.urlQuery.query ? true : false}
                    action={this.props.action}
                    myLocation={this.props.myLocation}
                    advancedSearchType={this.props.advancedSearchType}                
                />
            </div >
        );
    }
}

export default SimpleGrid;