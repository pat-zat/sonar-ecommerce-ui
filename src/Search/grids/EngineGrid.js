import React from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox';
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
    return searchParams.toString();
}

class CustomCell extends React.Component {
    //conditional render jsx
    //if this.props.dataItem[this.props.field] === ""
    render() {
        const value = "https://sonar-embed.seastarsolutions.com/productImages/product/" + this.props.dataItem[this.props.field];
        return (<td><SimpleReactLightbox><SRLWrapper><img className="thumbnail" src={value} alt='' /></SRLWrapper></SimpleReactLightbox></td>);
    }
}

class EngineGrid extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };

    enginePartsUrl = 'http://10.92.48.29:9002/api/productsearch/details/';
    PartsUrl = 'http://10.92.48.29:9002/api/ProductSearch/Details/?custId=000000&id=';
    engineDetailsUrl = 'http://10.92.48.29:9002/api/EngineDetails/Details/';

    productDetailsUrl = 'http://10.92.48.29:9002/api/SierraPartSearch/Details/';
    tabsUrl = 'http://10.92.48.29:9002/api/SierraPartPartialSearch/Details/?itemRow=';

    gridWidth = 600;
    payload = false;

    constructor(props) {
        super(props);

        this.state = {
            products: { data: [], total: 0 },
            dataState: this.props.resetState,
            engineDetailData: [],
            productDetailData: [],
            productDetailDataTab: [],
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
        };
    }

    handleSelect = (e) => {
        this.setState({ selected: e.selected })
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
        let page = Math.round(this.state.dataState.skip)
        const url = setParams({ skip: page });
        //console.log(page)
        history.push("/brand/api/AdvancedSearch/Details/" + '?id=' + 'brandmodel'
            + '&brand=' + this.props.brand
            + '&modelNumber=' + this.props.modelNo
            + '&year=' + this.props.year
            + '&hp=' + this.props.hp
            + '&serialNumber=' + this.props.serialNo
            + '&queryType=' + this.props.checked
            + '&skip=' + page);
    };

    dataRecieved = (products) => {
        this.props.releaseAction();
        
        this.setState({
            ...this.state,
            products: products,
            active: true,
            results: products.data,
        });

    }

    closeWindow = (products) => {
        this.setState({
            windowVisible: false
        });
    }

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

        this.setState({
            detailType: 'engine'
        });
        history.push("/brand/details/api/SimpleSearch/GetProducts/?urlEngineId=" + e.dataItem.engineId);
    }

    handleGridRowClick2 = (e) => {
        window.scrollTo(0, 0);
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
        fetch(this.productDetailsUrl + e.dataItem.C_item_row, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailData: json.Data }));
        fetch(this.tabsUrl + e.dataItem.C_item_row, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailDataTab: json.Data }));

        this.setState({
            detailType: 'product'
        });
        history.push("/brand/details/parts/api/SimpleSearch/GetProducts/?C_item_row=" + e.dataItem.C_item_row);
    }

    reset = () => { this.setState({ dataState: { take: 10, skip: 0 } }); }

    componentDidMount = () => {

        window.addEventListener("popstate", this.props.urlAction());

        if (this.props.urlQuery.skip !== "0") {
            console.log("paged " + this.props.urlQuery.skip);
            this.setState({
                dataState: { skip: parseInt(this.props.urlQuery.skip), take: 10 }
            });
        }
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
            fetch(this.tabsUrl + cuId, this.init)
                .then(response => response.json())
                .then(json => this.setState({ productDetailDataTab: json.Data }));

            this.setState({
                detailType: 'product'
            });
        }

    }

    componentDidUpdate(prevProps, prevState) {    
        if (this.props.urlQuery.skip !== prevProps.urlQuery.skip) {
            console.log("prevProps " + prevProps.urlQuery.skip);
            this.setState({ dataState: { take: 10, skip:  parseInt(this.props.urlQuery.skip) } });         
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
                    <Button className="k-button"
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
                            //skip={this.props.urlQuery.skip ? parseInt(this.props.urlQuery.skip) : parseInt(this.state.dataState.skip)}
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
                    </div>
                    <Route path="/brand/details">
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
                                        <h2>Parts For This Engine</h2>
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
                    </Route>
                    <Route path="/brand/details/parts">
                        {this.state.windowVisible && this.state.detailType === 'product' &&
                        <SimpleReactLightbox>
                            <Window title="Product Details" onClose={this.closeWindow}>
                                <div className="flexrow engineModel">
                                    <h3>Model#:</h3>
                                    <div>{this.state.gridClickedRow.C_item_row}</div>
                                </div>

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
                            </SimpleReactLightbox>
                        }
                    </Route>
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