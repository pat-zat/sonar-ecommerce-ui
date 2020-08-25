﻿import React from 'react';
import { SRLWrapper } from 'simple-react-lightbox'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { ProductLoader } from './ProductLoader.js';
import { process } from '@progress/kendo-data-query';
import Button from '@material-ui/core/Button';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout'
import $ from 'jquery';
import { GridColumnMenuSort, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { Window } from '@progress/kendo-react-dialogs';
import history from '../history.js';
import gauges from '../json/gauges.json';

function setParams(location, skip) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("skip", skip || "0");
    //console.log("function Set Params works");
    return searchParams.toString();
}

class ColumnMenu extends React.Component {
    render() {
        return (
            <div>
                <GridColumnMenuSort {...this.props} />
                <GridColumnMenuFilter {...this.props} />
            </div>
        );
    }
}

class CustomCell extends React.Component {
    //conditional render jsx
    //if this.props.dataItem[this.props.field] === ""
    render() {
        const value = "https://sonar-embed.seastarsolutions.com/productImages/product/" + this.props.dataItem[this.props.field];
        return (<td><SRLWrapper><img className="thumbnail" src={value} alt='' /></SRLWrapper></td>);
    }
}

// 1.	Engine Details Section - http://10.92.48.29:9002/api/EngineDetails/Details/400456
// 2.	Parts for this Engine - http://10.92.48.29:9002/api/CategorySearch/Details/?custId=000000&id=405562
// 3.	Filter by choosing a Category - http://10.92.48.29:9002/api/ProductSearch/Details/?custId=000000&id=400456


class LoaderGrid extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };
    enginePartsUrl = 'http://10.92.48.29:9002/api/productsearch/details/';
    PartsUrl = 'http://10.92.48.29:9002/api/categorysearch/details/';
    engineDetailsUrl = 'http://10.92.48.29:9002/api/EngineDetails/Details/';
    productDetailsUrl = 'http://10.92.48.29:9002/api/SierraPartSearch/Details/';
    containsTabUrl = 'http://10.92.48.29:9002/api/SierraPartPartialSearch/Details/?id=contains&containsItemRow=';
    docsTabUrl = 'http://10.92.48.29:9002/api/SierraPartPartialSearch/Details/?id=documents&documentsItemRow=';
    gridWidth = 600;
    payload = false;

    constructor(props) {
        super(props);

        this.state = {
            products: { data: [], total: 0 },
            dataState: this.props.resetState,
            engineDetailData: [],
            productDetailData: [],
            productDetailDataDoc: [],
            productDetailDataCon: [],
            detailType: 'product',
            details: [],
            sort: '',
            filter: '',
            active: false,
            left: false,
            columnsA: [
                { field: 'productNumber', title: "Product #" },
                { field: "interchangeNumber", title: "interchange" },
                { field: "categoryParent", title: "Parent category" },
                { field: "categoryChild", title: "Child category" },
                { field: "descriptionLong", title: "description Long", width: 300 },
                { field: "imagePath", title: "imagePath", cell: CustomCell },
            ],
            columnsB: [
                { field: "brandName", title: "brandName", width: 300 },
                { field: "engineId", title: "Engine Id" },
                { field: "modelNumber", title: "Model Number" },
                { field: "startYear", title: "Start Year" },
                { field: "stopYear", title: "Stop Year" },
                { field: "horsePower", title: "Horsepower" },
                { field: "stroke", title: "stroke" },
                { field: "liters", title: "liters" },
                { field: "serialNumberStart", title: "Serial # Start" },
                { field: "serialNumberStop", title: "Serial # Stop" },
            ],
            columnsC: [
                { field: 'productNumber', title: "Product #" },
                { field: "categoryParent", title: "Parent category" },
                { field: "categoryChild", title: "Child category" },
                { field: "descriptionLong", title: "description Long", width: 300 },
                { field: "imagePath", title: "imagePath", cell: CustomCell },
            ],
            productSearch: "product",
            windowVisible: false,
            gridClickedRow: {},
            enginePartsData: [],
            selected: 0,
            selected2: 0,
            selected3: 0,
            dataState2: { skip: 0, take: 60, group: [{ field: 'cat1_name' }] },
            results: [],
            storeStack: [],
        };
    }

    handleSelect = (e) => {
        this.setState({ selected: e.selected })
    }
    handleSelect2 = (e) => {
        this.setState({ selected2: e.selected2 })
    }
    handleSelect3 = (e) => {
        this.setState({ selected3: e.selected3 })
    }
    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.forceUpdate();
    };

    patsDataStateChange = (e) => {
        this.setState({
            enginePartsData: process(this.state.enginePartsData, this.state.dataState2),
            dataState2: e.data
        });
    };

    SearchTypeA = () => {
        this.setState({ productSearch: "product" });
    }

    SearchTypeB = () => {
        this.setState({ productSearch: 'engine' });
    }

    SearchTypeD = () => {
        this.setState({ productSearch: 'filter' });
    }

    dataStateChange = (e) => {
        this.setState({
            ...this.state,
            dataState: e.data
        }, () => {
            this.updateURL();
        });
    }

    updateURL = () => {
        let page = Math.round(this.state.dataState.skip / 10)
        const url = setParams({ skip: page });
        //console.log(page)
        history.push("/api/AdvancedSearch/Details/" + '?id=' + 'brandmodel'
            + '&brand=' + this.props.urlQuery.brand
            + '&modelNumber=' + this.props.urlQuery.modelNumber
            + '&year=' + this.props.urlQuery.year
            + '&hp=' + this.props.urlQuery.hp
            + '&serialNumber=' + this.props.urlQuery.serialNo
            + '&queryType=' + this.props.urlQuery.checked
            + '&skip=' + page);

    };
   

    dataRecieved = (products) => {

        console.log("data received");
        //this should be setting true to false
        this.props.action();

        localStorage.setItem(this.props.location.search, JSON.stringify(this.state.products.data));
        const storedData = JSON.parse(localStorage.getItem('searchGridData'));
        let stack = [];
        for ( var i = 0; i < localStorage.length; i++) {
            stack = localStorage.key(i);
            console.log(stack);
          }

        this.setState({
            ...this.state,
            products: products,
            active: true,
            results: products.data,
            storeStack: stack
        });

    }

    closeWindow = (products) => {
        this.setState({
            windowVisible: false
        });
    }

    columnProps(field) {
        return {
            field: field,
            columnMenu: ColumnMenu,
            headerClassName: this.isColumnActive(field, this.state.dataState) ? 'active' : ''
        };
    }

    isColumnActive(field, dataState, filter, sort) {
        return GridColumnMenuFilter.active(field, filter) ||
            GridColumnMenuSort.active(field, sort);
    }

    handleGridRowClick = (e) => {
        let eId = e.dataItem.engineId;
        window.scrollTo(0, 0)
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
        fetch(this.engineDetailsUrl + eId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ engineDetailData: json.Data }));

        fetch(this.PartsUrl + eId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ enginePartsData: process(json.Data, this.state.dataState2) }));

        fetch(this.docsTabUrl + eId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailDataDoc: json.Data }));

        fetch(this.containsTabUrl + eId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailDataCon: json.Data }));
        this.setState({
            detailType: 'engine'
        });
        history.push("/api/SimpleSearch/GetProducts/?urlEngineId=" + e.dataItem.engineId);
    }

    handleGridRowClick1 = (e) => {
        window.scrollTo(0, 0)
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
        fetch(this.productDetailsUrl + e.dataItem.itemRow, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailData: json.Data }));
        fetch(this.docsTabUrl + e.dataItem.itemRow, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailDataDoc: json.Data }));
        fetch(this.containsTabUrl + e.dataItem.itemRow, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailDataCon: json.Data }));
        this.setState({
            detailType: 'product'
        });
        history.push("/api/SimpleSearch/GetProducts/?itemRow=" + e.dataItem.itemRow);
    }

    handleGridRowClick2 = (e) => {
        console.log(e.target.className);
        window.scrollTo(0, 0)
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
        fetch(this.productDetailsUrl + e.dataItem.C_item_row, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailData: json.Data }));
        this.setState({
            detailType: 'product'
        });
        history.push("/api/SimpleSearch/GetProducts/?C_item_row=" + e.dataItem.C_item_row);
    }

    reset = () => { this.setState({ dataState: { take: 10, skip: 0 } }); }

    componentDidMount = () => {

        //TODO 2 ADD NEW FUNCTION HERE THAT DETECTS IF BACK OR FORWARD AND CALLS PREVIOUS STORAGE OR close window
        //always update local storage on new search.
        //if location.search !== local storage key
        window.addEventListener("popstate", this.closeWindow);

        //if I set state in mount from url it only happens on refresh or navigation
        if (this.props.urlQuery.skip !== '0') {
            console.log("paged");
            this.setState({
                dataState: { skip: this.props.urlQuery.skip, take: 10 }
            });
        }
        console.log("Grid Mounted");

        this.props.urlQuery.query = "";

        if (this.props.urlQuery.urlEngineId) {
            let eId = this.props.urlQuery.urlEngineId;
            this.setState({
                windowVisible: true,
            });
            fetch(this.engineDetailsUrl + eId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ engineDetailData: json.Data }));
            fetch(this.PartsUrl + eId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ enginePartsData: process(json.Data, this.state.dataState2) }));
            fetch(this.docsTabUrl + eId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailDataDoc: json.Data }));
            fetch(this.containsTabUrl + eId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailDataCon: json.Data }));
            this.setState({
                detailType: 'engine'
            });
        }
        if (this.props.urlQuery.itemRow) {
            let uId = this.props.urlQuery.itemRow;
            this.setState({
                windowVisible: true,
            });
            fetch(this.productDetailsUrl + uId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailData: json.Data }));
            fetch(this.docsTabUrl + uId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailDataDoc: json.Data }));
            fetch(this.containsTabUrl + uId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailDataCon: json.Data }));
            this.setState({
                detailType: 'product'
            });
        }
        if (this.props.urlQuery.C_item_row) {
            let cuId = this.props.urlQuery.C_item_row;
            this.setState({
                windowVisible: true,
            });
            fetch(this.productDetailsUrl + cuId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailData: json.Data }));

            this.setState({
                detailType: 'product'
            });
        }
    }
    pageIt() {
        //console.log("page evnet fired");
    }

    render() {

        //SET columnsToShow as global
        //add function callback after data recieved setState to change the value of columns to

        let columnsToShow;
        var columnsToShowProduct = this.state.columnsA.map((column, index) => {
            return <Column field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;
        })
        var columnsToShowSierra = this.state.columnsC.map((column, index) => {
            return <Column {...this.columnProps(column.field)} field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;
        })
        var columnsToShowEngine = this.state.columnsB.map((columnb, index) => {
            return <Column field={columnb.field} title={columnb.title} key={index} width={columnb.width} cell={columnb.cell} />;
        })
        columnsToShow = columnsToShowProduct
        if (this.props.search === true) {
            if (this.props.advancedSearchType !== "brand") {
                if (this.props.advancedSearchType === "interchange") {
                    columnsToShow = columnsToShowProduct;
                }
                else {
                    columnsToShow = columnsToShowSierra;
                }
                
            }
            else { columnsToShow = columnsToShowEngine; }
        }


        return (

            <div className="searchGrid">
                {/* <HomeButton></HomeButton> */}
                <div className={this.state.active ? 'activeToggle' : 'hiddenToggle'}>
                    <Button
                        onClick={() => {
                            this.setState({ dataState: { take: 10, skip: 0 } });
                        }}>
                        Clear grid
                    </Button>
                </div>

                <div className={this.props.activeSearch === true ? 'visigrid' : 'hider'}>
                    {/* TODO //add a condition here to say search = true */}

                    {/* 
                      when the grid is already visible and 
                      one of the search buttons is clicked 
                      the columns cant change until this.props.search===true 
                      */}

                    {this.props.advancedSearchType !== "brand" ? (
                        <Grid
                            style={{ height: '600px' }}
                            ref={div => this.gridWidth = div}
                            pageable={true}
                            resizable={true}
                        
                            {...this.state.dataState}
                            {...this.state.products}
                            onChange={this.props.action}
                            onDataStateChange={this.dataStateChange}
                            onRowClick={this.handleGridRowClick1}
                            filterable={true}
                            skip={parseInt(this.props.urlQuery.skip)}
                            onPageChange={this.pageIt}
                            sortable={true}>
                            {columnsToShow}
                        </Grid>
                    ) : (
                            <Grid
                                style={{ height: '600px' }}
                                ref={div => this.gridWidth = div}
                                pageable={true}
                                resizable={true}
                                //skip={this.props.urlQuery.skip ? this.props.urlQuery.skip : this.state.dataState.skip}
                                take={this.state.dataState.take}
                                total={this.state.products.data.length}
                                {...this.state.dataState}
                                {...this.state.products}
                                onChange={this.props.action}
                                onDataStateChange={this.dataStateChange}
                                onRowClick={this.handleGridRowClick}
                                filterable={true}

                                sortable={true}>
                                {columnsToShow}
                            </Grid>
                        )}

                    {this.state.windowVisible && this.state.detailType === 'engine' &&

                        <Window title="Engine Details" onClose={this.closeWindow}>
                            <div className="flexrow engineModel">
                                {/* <button onClick={this.closeWindow} className="k-button" >close</button> */}
                                <h3>Model#:</h3>
                                <div>{this.state.gridClickedRow.modelNumber}</div>
                            </div>
                            <div className='detailsCon'>
                                {this.state.engineDetailData.map(detail =>
                                    <div>
                                        <h1>{detail.brandName}</h1>
                                        <div className='details'>
                                            <div className="flexrow startStop">
                                                <div>yearStart: {detail.yearStart}</div>
                                                <div>yearStop: {detail.yearStop}</div>
                                            </div>

                                            <div className="flexrow">
                                                <div>Horsepower: {detail.horsePower}</div>
                                                <div>Stroke: {detail.stroke}</div>
                                                <div>Cylinders: {detail.cylinders}</div>
                                            </div>

                                            <div className="flexrow">
                                                <div>Liters: {detail.liters}</div>
                                                <div>CID: {detail.cubicInchDisplacement}</div>
                                                <div>CC: {detail.engineCC}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flexrow">
                                <div>
                                    <h2>parts for this engine</h2>
                                    <Grid
                                        style={{ height: '700px' }}
                                        data={this.state.enginePartsData}
                                        total={this.state.enginePartsData.length}
                                        expandField="_expanded"
                                        onDataRecieved={this.dataRecieved}
                                        onDataStateChange={this.patsDataStateChange}
                                        {...this.state.dataState2}
                                        onRowClick={this.handleGridRowClick2}
                                        onExpandChange={this.expandChange}
                                        resizable={true}
                                        reorderable={true}>
                                        <Column field="cat1_name" title="category" />
                                        <Column field="sale_item" title="Sierra Part #" />
                                        <Column field="desclong" title="Description" />
                                    </Grid>
                                </div>
                            </div>
                        </Window>
                    }

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
                                                <SRLWrapper><img src={"https://sonar-embed.seastarsolutions.com/productImages/product/" + details.imagePath} alt='' /></SRLWrapper>
                                            </div>
                                        </div>
                                        <TabStrip selected={this.state.selected} onSelect={this.handleSelect}>
                                            <TabStripTab disabled={details.productDetails.length > 0 ? false : true} contentClassName='detailsTab' title="Details">
                                                <h2>Features</h2>
                                                <div>
                                                    {details.productDetails.map(productDetail =>
                                                        <div>{productDetail.value}</div>
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
                                                            <div>{interchangeDetail.searchNumber}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TabStripTab>
                                        </TabStrip>
                                    </div>

                                )}

                            </div>
                            <h3>contains</h3>
                            {this.state.productDetailDataCon.map(details3 =>
                                <div>
                                    <hr />
                                    <div>{details3.descriptionLong}</div>
                                    <div>{details3.saleItem}</div>
                                    <div>{details3.quantity}</div>
                                    <SRLWrapper><img className="conImg" alt='' src={"https://sonar-embed.seastarsolutions.com/productImages/product/" + details3.imagePath} /></SRLWrapper>
                                </div>
                            )}
                            <hr />
                            {/* 1086 */}
                            <h3>Documents</h3>
                            {this.state.productDetailDataDoc.map(details2 =>
                                <div>
                                    <h3>{details2.description}</h3>
                                    <div>{details2.docRow}</div>
                                    <div>{details2.docName}</div>
                                    <div>{details2.docType}</div>
                                    <div>{details2.lastUpdated}</div>
                                </div>
                            )}
                        </Window>
                    }
                </div>
                <ProductLoader
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                    activeSearch={this.props.urlQuery || this.props.urlQuery.oeNumber ? true : this.props.activeSearch}
                    query={this.props.urlQuery.query ? this.props.urlQuery.query : this.props.query}
                    search={this.props.urlQuery.oeNumber ? true : this.props.search}
                    action={this.props.action}
                    searchingForCats={this.props.searchCats}
                    cat={this.props.cat}
                    releaseSearch={this.props.urlQuery.oeNumber ? true : this.props.releaseSearch}
                    advancedSearchType={
                        (() => {
                            if (this.props.urlQuery.oeNumber)
                                return "Interchange"
                            if (this.props.urlQuery.parentCategoryName)
                                return "sierra"
                            if (this.props.urlQuery.brand)
                                return "brand"
                            if (this.props.urlQuery.query)
                                return ""
                            else return this.props.advancedSearchType
                        })()
                    }
                    oenumber={this.props.oenumber ? this.props.oenumber : this.props.urlQuery.oeNumber}
                    myLocation={this.props.myLocation}
                    storeStack={this.state.storeStack}
                    parentCategoryName={this.props.urlQuery.parentCategoryName ? this.props.urlQuery.parentCategoryName : this.props.parentCategoryName}
                    parentCategoryId={this.props.urlQuery.parentCategoryId ? this.props.urlQuery.parentCategoryId : this.props.parentCategoryId}
                    childCategoryName={this.props.urlQuery.childCategoryName ? this.props.urlQuery.childCategoryName : this.props.childCategoryName}
                    childCategoryId={this.props.urlQuery.childCategoryId ? this.props.urlQuery.childCategoryId : this.props.childCategoryId}
                    productNumber={this.props.urlQuery.productNumber ? this.props.urlQuery.productNumber : this.props.productNumber}

                    brand={this.props.urlQuery.brand ? this.props.urlQuery.brand : this.props.brand}
                    modelNo={this.props.urlQuery.modelNumber ? this.props.urlQuery.modelNumber : this.props.modelNo}
                    year={this.props.urlQuery.year ? this.props.urlQuery.year : this.props.year}
                    hp={this.props.urlQuery.hp ? this.props.urlQuery.hp : this.props.hp}
                    serialNo={this.props.urlQuery.serialNo ? this.props.urlQuery.serialNo : this.props.serialNo}
                    queryType={this.props.urlQuery.queryType ? this.props.urlQuery.queryType : this.props.queryType}
                />
            </div >
        );
    }
}

export default LoaderGrid;