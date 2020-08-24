import React from 'react';
import { SRLWrapper } from 'simple-react-lightbox'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { EngineLoader } from './EngineLoader.js';
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
    //console.log("function Set Params works");
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

class EngineGrid extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };

    enginePartsUrl = 'http://10.92.48.29:9002/api/productsearch/details/';
    PartsUrl = 'http://10.92.48.29:9002/api/ProductSearch/Details/?custId=000000&id=';
    engineDetailsUrl = 'http://10.92.48.29:9002/api/EngineDetails/Details/';

    //PartsUrl = 'http://10.92.48.29:9002/api/categorysearch/details/';
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
            columns: [
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
            productSearch: "product",
            windowVisible: false,
            gridClickedRow: {},
            enginePartsData: [],
            dataState2: { skip: 0, take: 60, group: [{ field: 'cat1_name' }] },
            results: [],
            storeStack: [],
        };
    }

    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.forceUpdate();
    };

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
        history.push("/brand/api/AdvancedSearch/Details/" + '?id=' + 'brandmodel'
            + '&brand=' + this.props.brand
            + '&modelNumber=' + this.props.modelNumber
            + '&year=' + this.props.year
            + '&hp=' + this.props.hp
            + '&serialNumber=' + this.props.serialNo
            + '&queryType=' + this.props.checked
            + '&skip=' + page);

    };

    dataRecieved = (products) => {

        console.log("data received");
        //this should be setting true to false
        this.props.releaseAction();

        localStorage.setItem(this.props.location.search, JSON.stringify(this.state.products.data));
        const storedData = JSON.parse(localStorage.getItem('searchGridData'));
        let stack = [];
        for (var i = 0; i < localStorage.length; i++) {
            stack = localStorage.key(i);
         //   console.log(stack);
        }

        this.setState({
            ...this.state,
            products: products,
            active: true,
            results: products.data,
            storeStack: stack
        });

    }

    // closeWindow = (products) => {
    //     this.setState({
    //         windowVisible: false
    //     });
    // }

    handleGridRowClick = (e) => {
        let eId = e.dataItem.engineId;
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
        history.push("/brand/api/SimpleSearch/GetProducts/?urlEngineId=" + e.dataItem.engineId);
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
        history.push("/brand/api/SimpleSearch/GetProducts/?C_item_row=" + e.dataItem.C_item_row);
    }

    reset = () => { this.setState({ dataState: { take: 10, skip: 0 } }); }

    componentDidMount = () => {

        window.addEventListener("popstate", this.closeWindow);

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

    render() {


        var columnsToShow = this.state.columns.map((column, index) => {
            return <Column field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;
        })


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

                <div >

                    <div className={this.props.urlQuery.brand !== "" ? 'visigrid' : 'hider'}>
                        <Grid
                            style={{ height: '600px' }}
                            ref={div => this.gridWidth = div}
                            pageable={true}
                            resizable={true}
                            take={this.state.dataState.take}
                            total={this.state.products.data.length}
                            {...this.state.dataState}
                            {...this.state.products}
                            onChange={this.props.action}
                            onDataStateChange={this.dataStateChange}
                            onRowClick={this.handleGridRowClick}
                            filterable={true}
                            //skip={parseInt(this.props.urlQuery.skip)}

                            sortable={true}>
                            {columnsToShow}
                        </Grid>
                    </div>
                    {this.state.windowVisible &&

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
                        <Window
                            title="Product Details"
                            onClose={this.closeWindow}
                        >

                            <div className="flexrow engineModel">
                                <h3>Model#:</h3>
                                <div>{this.state.gridClickedRow.C_item_row}</div>
                            </div>

                            <div className='detailsCon'>

                                {this.state.productDetailData.map(details =>

                                    <div>
                                        <h1>{details.description}</h1>
                                        <div className='details'>
                                            <div className="flexrow startStop">
                                                <div>Category: {details.categoryParent}</div>
                                                <div>Subcategory: {details.categoryChild}</div>
                                            </div>

                                            <div className="flexrow">
                                                <div>Description: {details.descriptionLong}</div>
                                                <div>interchange: {details.interchangeNumber}</div>

                                            </div>

                                            <div className="flexrow">
                                                <div>image: {details.imagePath}</div>

                                            </div>
                                        </div>
                                        <TabStrip className={details.productDetails.length > 0 ? 'deets-tab' : 'no-click-opacity'} selected={this.state.selected} onSelect={this.handleSelect}>
                                            <TabStripTab contentClassName='detailsTab' title="Details">
                                                <h2>Features</h2>
                                                <div>
                                                    {details.productDetails.map(productDetail =>
                                                        <div>
                                                            {/* {productDetail.attrtibute} */}
                                                            {productDetail.value}</div>
                                                    )}
                                                </div>
                                            </TabStripTab>
                                            <TabStripTab title="Specs">
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
                                            <TabStripTab contentClassName='detailsTab' title="Interchange">
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
                                    <div>{details3.descriptionLong}</div>
                                </div>
                            )}
                            <hr />
                            <h3>Documents</h3>
                            {this.state.productDetailDataDoc.map(details2 =>
                                <div>
                                    <div>{details2.docName}</div>
                                </div>
                            )}
                        </Window>
                    }
                </div>

                <EngineLoader
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                    //activeSearch={this.props.urlQuery || this.props.urlQuery.oeNumber ? true : this.props.activeSearch}
                    query={this.props.urlQuery.query ? this.props.urlQuery.query : this.props.query}
                    action={this.props.action}
                    engineSearch={this.props.urlQuery.brand ? true : this.props.engineSearch}
                    cat={this.props.cat}
                    search={this.props.urlQuery.brand ? true : this.props.search}
                    myLocation={this.props.myLocation}
                    storeStack={this.state.storeStack}
                    advancedSearchType={this.props.advancedSearchType}

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

export default EngineGrid;