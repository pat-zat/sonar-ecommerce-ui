import React from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { SRLWrapper } from 'simple-react-lightbox'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { InterchangeLoader } from './InterchangeLoader.js';
import { process } from '@progress/kendo-data-query';
import Button from '@material-ui/core/Button';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout'
import $ from 'jquery';
import { Window } from '@progress/kendo-react-dialogs';
import history from '../../history.js';
import { Route, Link } from 'react-router-dom';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';


function setParams(location, skip) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("skip", skip || "0");
    //console.log("function Set Params works");
    return searchParams.toString();
}

class CustomCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.toggleDialog = this.toggleDialog.bind(this);
    }

    toggleDialog() {
        this.setState({
            visible: !this.state.visible
        });
    }
    
    render() {
       let value = "https://sonar-embed.seastarsolutions.com/productImages/product/" + this.props.dataItem[this.props.field];
        return (
            <div>
           <td><img onClick={this.toggleDialog} className="thumbnail" src={value} alt='' /></td>
            {this.state.visible && <Dialog title={this.props.dataItem[this.props.field]} onClose={this.toggleDialog}>
            <img onClick={this.toggleDialog} className="max" src={value} alt='' />
                {/* <DialogActionsBar>
                    <button className="k-button" onClick={this.toggleDialog}>Prev</button>
                    <button className="k-button" onClick={this.toggleDialog}>Next</button>
                </DialogActionsBar> */}
            </Dialog>}
        </div>
        );
    }
}

class InterchangeGrid extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };
    PartsUrl = 'http://10.92.48.29:9002/api/categorysearch/details/';
    productDetailsUrl = 'http://10.92.48.29:9002/api/SierraPartSearch/Details/';
    tabsUrl = 'http://10.92.48.29:9002/api/SierraPartPartialSearch/Details/?itemRow=';
    gridWidth = 600;
    payload = false;

    constructor(props) {
        super(props);

        this.state = {
            products: { data: [], total: 0 },
            dataState: this.props.resetState,
            productDetailData: [],
            productDetailDataTab: [],

            detailType: 'product',
            details: [],
            sort: '',
            filter: '',
            active: false,
            left: false,
            columns: [
                { field: 'productNumber', title: "Product #" },
                { field: "interchangeNumber", title: "interchange" },
                { field: "categoryParent", title: "Parent category" },
                { field: "categoryChild", title: "Child category" },
                { field: "descriptionLong", title: "description Long", width: 300 },
                { field: "imagePath", title: "imagePath", cell: CustomCell },
            ],
            productSearch: "product",
            windowVisible: false,
            gridClickedRow: {},
            dataState2: { skip: 0, take: 60, group: [{ field: 'cat1_name' }] },
            results: [],
            storeStack: [],
        };
    }

    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.forceUpdate();
    };
    handleSelect = (e) => {
        this.setState({ selected: e.selected })
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
        let page = Math.round(this.state.dataState.skip)
        const url = setParams({ skip: page });
        history.push('/interchange/api/AdvancedSearch/Details/?id=interchange'
            + '&oeNumber=' + this.props.oenumber
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
            //console.log(stack);
        }

        this.setState({
            ...this.state,
            products: products,
            active: true,
            results: products.data,
            storeStack: stack
        });

    }

    closeWindow = () => {
        this.setState({
            windowVisible: false
        });
    }

    handleGridRowClick1 = (e) => {
        window.scrollTo(0, 0)
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
        fetch(this.productDetailsUrl + e.dataItem.productId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailData: json.Data }));
            fetch(this.tabsUrl + e.dataItem.productId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailDataTab: json.Data }));

        this.setState({
            detailType: 'product'
        });
        history.push("/interchange/details/api/SimpleSearch/GetProducts/?itemRow=" + e.dataItem.productId);
    }

    reset = () => { this.setState({ dataState: { take: 10, skip: 0 } }); }

    componentDidMount = () => {
        window.addEventListener("popstate", this.props.urlAction());
        //window.addEventListener("popstate", this.closeWindow);

        if (this.props.urlQuery.skip !== 0) {
            console.log("paged");
            this.setState({
                dataState: { skip: parseInt(this.props.urlQuery.skip), take: 10 }
            });
        }
        console.log("Grid Mounted");

        this.props.urlQuery.query = "";

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
                <div className={this.props.activeSearch? 'activeToggle' : 'hiddenToggle'}>
                    <Button className="k-button"
                        onClick={() => {
                            this.setState({ dataState: { take: 10, skip: 0 } });
                        }}>
                        Clear grid
                    </Button>
                </div>

                <div >

                    <div className={this.props.urlQuery.oeNumber !== "" ? 'visigrid' : 'hider'}>
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
                            onRowClick={this.handleGridRowClick1}
                            filterable={true}
                            sortable={true}>
                            {columnsToShow}
                        </Grid>
                    </div>
                    <Route path="/interchange/details">


                        {this.state.windowVisible && this.state.detailType === 'product' &&
                        <SimpleReactLightbox>
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
                            </SimpleReactLightbox>
                        }
                    </Route>
                </div>
                <InterchangeLoader
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                    advancedSearchType={this.props.advancedSearchType}
                    query={this.props.urlQuery.query ? this.props.urlQuery.query : this.props.query}
                    action={this.props.action}
                    interSearch={this.props.urlQuery.oeNumber ? true : false}
                    cat={this.props.cat}
                    search={this.props.urlQuery.oeNumber ? true : this.props.search}
                    myLocation={this.props.myLocation}
                    storeStack={this.state.storeStack}
                    oenumber={this.props.oenumber ? this.props.oenumber : this.props.urlQuery.oeNumber}
                />
            </div >
        );
    }
}

export default InterchangeGrid;