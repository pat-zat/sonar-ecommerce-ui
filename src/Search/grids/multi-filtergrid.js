import React from 'react';
import { SRLWrapper } from 'simple-react-lightbox';
import axios from 'axios';
import SimpleReactLightbox from 'simple-react-lightbox';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { FilterLoader } from './FilterLoader.js';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout'
import $, { map } from 'jquery';
import { Window } from '@progress/kendo-react-dialogs';
import history from '../../history.js';
import { Route, Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import SonarFilter from '../../Filter/SonarFilter';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { process } from '@progress/kendo-data-query';

function setParams(location, skip) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("skip", skip || "0");
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

        if (this.props.dataItem[this.props.field]) {
            return (
                <td><img onClick={this.toggleDialog} className="thumbnail" src={value} alt='' />
                    {this.state.visible && <Dialog title={this.props.dataItem[this.props.field]} onClose={this.toggleDialog}>
                        <img onClick={this.toggleDialog} className="max" src={value} alt='' />
                        {/* 
                        <DialogActionsBar>
                            <button className="k-button" onClick={this.toggleDialog}>Prev</button>
                            <button className="k-button" onClick={this.toggleDialog}>Next</button>
                        </DialogActionsBar>
                        */}
                    </Dialog>}
                </td>
            );
        }
        else {
            return (
                <td><p>no image available</p></td>
            );
        }
    }
}


//IconFilters(Hamburger) - http://10.92.48.29:9002/api/IconFilters/Details/?query=Gauges&custId=000000 
//ItemsWithFilters - http://10.92.48.29:9002/api/FilterSet/Details/?query=Hose&custId=000000

class FilterGrid extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };
    filterBarUrl = 'http://10.92.48.29:9002/api/IconFilters/Details/?query=Instrumentation&custId=000000';
    productDetailsUrl = 'http://10.92.48.29:9002/api/SierraPartSearch/Details/';
    tabsUrl = 'http://10.92.48.29:9002/api/SierraPartPartialSearch/Details/?itemRow=';
    ItemsWithFiltersUrl = 'http://10.92.48.29:9002/api/FilterSet/Details/?query=';
    gridWidth = 600;

    constructor(props) {
        super(props);

        this.state = {
            showFilteredData: false,
            left: false,
            windowVisible: false,
            gridClickedRow: {},
            productSearch: "filter",
            detailType: 'product',
            active: false,
            products: { data: [], total: 0 },
            filteredProducts: { data: [], total: 0 },
            dataState: this.props.resetState,
            productDetailData: [],
            productDetailDataTab: [],
            columns: [
                { field: 'saleItem', title: "Product #" },
                { field: "categoryParent", title: "Parent category" },
                { field: "categoryChild", title: "Child category" },
                { field: "descriptionLong", title: "description Long", width: 300 },
                { field: "image", title: "imagePath", cell: CustomCell },
            ],
            filter: '',
            filterValue: '',
            filterSet: [],
            filtering: false,
            ItemsWithFilters: [],
            filteredSkus: [],
            filterCollapse: true,
            terms: []
        };
    }

    reset = () => { this.setState({ dataState: { take: 10, skip: 0 } }); }

    closeWindow = () => {
        this.setState({
            windowVisible: false
        });
    }

    toggleDrawer = () => {
        if (this.state.left === false) {
            this.setState({ left: true });
        }
        if (this.state.left === true) {
            this.setState({ left: false });
        }
    }

    handleSelect = (e) => {
        this.setState({ selected: e.selected })
    }

    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.forceUpdate();
    };

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


    updateURL = () => {
        let page = Math.round(this.state.dataState.skip)
        const url = setParams({ skip: page });
        history.push('/filter/api/AdvancedSearch/Details/?id=sierrapart'
            + '&category=' + this.props.cat
            + '&skip=' + page);
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

        this.setState({
            ...this.state,
            products: products,
            active: true,
            //  results: products.data
        });
    }


    componentDidMount = async () => {

        window.addEventListener("popstate", this.props.urlAction());

        fetch(this.filterBarUrl, this.init)
            .then(response => response.json())
            .then(json => this.setState({ filterSet: json.Data }));

        if (this.props.urlQuery.skip !== '0') {
            this.setState({
                dataState: { skip: this.props.urlQuery.skip, take: 10 }
            });
        }

        const filterResponse = await axios.get(this.ItemsWithFiltersUrl + this.props.cat + '&custId=000000', { headers: {} });
        this.setState({ ItemsWithFilters: filterResponse.data.Data });

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


    // I just need to trigger the filter every time a new filter is added to the array. I believe what I need to do is actually return a new array.


    onFilterSelect = term => {
        let termArray = [...term];
        this.setState({
            filtering: true,
            filterCollapse: true,
            showFilteredData: true,
            terms: termArray
        });
      
    }


  



    componentDidUpdate(prevProps, prevState) {
        if (this.props.urlQuery.skip !== prevProps.urlQuery.skip) {
            console.log("prevProps " + prevProps.urlQuery.skip);
            this.setState({ dataState: { take: 10, skip: parseInt(this.props.urlQuery.skip) } });
        }
        if (prevState.terms !== this.state.terms) {
            let filterSku;
            let skus = this.state.ItemsWithFilters.map((element) => {
                filterSku = {
                    ...element,
                    filterSetFilter: element.filterSetFilter.filter((filterSetFilter) => filterSetFilter.value.some( r => this.state.terms.includes(r)))
                };
                //console.log(filterSku);
                return filterSku;
            });
            let activeFilterSkuArrayFinal = skus.filter(sku => sku.filterSetFilter.length > 0).map(fSku => fSku.itemRow);
            this.setState({ filteredSkus: activeFilterSkuArrayFinal });
            //let proItemRows = this.state.products.data.map(data => data);
            var profiltered = this.state.products.data.filter(item => activeFilterSkuArrayFinal.includes(item.itemRow));
            this.setState({ filteredProducts: { data: profiltered, total: profiltered.length } });
            console.log("filterGrid updated");

        }
        
    }

    render() {
        var columnsToShow = this.state.columns.map((column, index) => {
            return <Column field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;
        })

        return (
            <div className="searchGrid">
                <div className={this.props.activeSearch ? 'activeToggle' : 'hiddenToggle'}>
                    <Button className="k-button" onClick={this.toggleDrawer}><span>{this.props.cat}</span>&nbsp;  Filter</Button>
                    <Button className="k-button" onClick={() => { this.setState({ dataState: { take: 10, skip: 0 } }); }}>Clear grid</Button>
                </div>
                <div>
                    <div className={this.props.urlQuery.category !== "" ? 'visigrid' : 'hider'}>

                        <Grid
                            style={{ height: '600px' }}
                            ref={div => this.gridWidth = div}
                            pageable={true}
                            resizable={true}
                            take={this.state.dataState.take}
                            {...this.state.products}
                            {...this.state.dataState}

                            data={this.state.showFilteredData ? process(this.state.filteredProducts.data, this.state.dataState) : process(this.state.products.data, this.state.dataState)}
                            onChange={this.props.action}
                            onDataStateChange={this.dataStateChange}
                            onRowClick={this.handleGridRowClick1}
                            filterable={true}
                            pagesize={10}
                            sortable={true}>
                            {columnsToShow}
                        </Grid>
                    </div>
                    <Route path="/sierra/details">
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
                <FilterLoader
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                    searchingForCats={this.props.searchCats}
                    action={this.props.action}
                    filterSearch={this.props.urlQuery.category ? true : this.props.filterSearch}
                    cat={this.props.cat}
                    filtering={this.state.filtering}
                    myLocation={this.props.myLocation}
                    advancedSearchType={this.props.advancedSearchType}
                />
                <Drawer open={this.state.left} onClose={this.toggleDrawer}>
                    <SonarFilter filterSet={this.state.filterSet} onFilter={this.onFilterSelect} cat={this.props.cat} />
                </Drawer>
            </div >
        );
    }
}

export default FilterGrid;