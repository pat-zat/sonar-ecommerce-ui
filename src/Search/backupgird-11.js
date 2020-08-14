import React from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { ProductLoader } from './ProductLoader.js';
import { process } from '@progress/kendo-data-query';
import Button from '@material-ui/core/Button';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout'
import $ from 'jquery';
import { GridColumnMenuSort, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { Window } from '@progress/kendo-react-dialogs';

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
        return (<td><img className="thumbnail" src={value} /></td>);
    }
}

class LoaderGrid extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };
    enginePartsUrl = 'http://10.92.48.29:9002/api/productsearch/details/';
    PartsUrl = 'http://10.92.48.29:9002/api/categorysearch/details/';
    engineDetailsUrl = 'http://10.92.48.29:9002/api/EngineDetails/Details/';
    productDetailsUrl = 'http://10.92.48.29:9002/api/SierraPartSearch/Details/';
    gridWidth = 600;
    payload = false;
    constructor(props) {
        super(props);
        this.state = {
            products: { data: [], total: 0 },
            dataState: this.props.resetState,
            engineDetailData: [],
            productDetailData: [],
            detailType: 'product',
            details: [],
            sort: '',
            filter: '',
            active: false,
            left: false,
            columnsA: [
                { field: 'productNumber', title: "Product #", width: 120 },
                { field: "interchangeNumber", title: "interchange", width: 120 },
                { field: "categoryParent", title: "Parent category", width: 150 },
                { field: "categoryChild", title: "Child category", width: 150 },
                { field: "description", title: "description", width: 300 },
                { field: "descriptionLong", title: "description Long", width: 300 },
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
            columns: [
                { field: "productNumber", title: "Product #", width: 120 },
                { field: "interchangeNumber", title: "interchange", width: 120 },
                { field: "categoryParent", title: "Parent category", width: 150 },
                { field: "categoryChild", title: "Child category", width: 150 },
                { field: "description", title: "description Long", width: 300 },
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
            columnsD: [
                { field: 'productNumber', title: "Product #", width: 120 },
                { field: "categoryParent", title: "Parent category", width: 150 },
                { field: "categoryChild", title: "Child category", width: 150 },
                { field: "descriptionShort", title: "description", width: 300 },
                { field: "descriptionLong", title: "description Long", width: 300 },
                { field: "image", title: "imagePath", cell: CustomCell, width: 300 },
            ],
            productSearch: "product",
            windowVisible: false,
            gridClickedRow: {},
            enginePartsData: [],
            selected: 0,
            dataState2: { skip: 0, take: 60, group: [{ field: 'cat1_name' }] },
        };
    }

    handleSelect = (e) => {
        this.setState({ selected: e.selected })
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

    SearchTypeC = () => {
        this.setState({ productSearch: 'all' });
    }

    SearchTypeD = () => {
        this.setState({ productSearch: 'filter' });
    }

    dataStateChange = (e) => {
        this.setState({
            ...this.state,
            dataState: e.data
        });
    }

    dataRecieved = (products, field) => {
        this.props.action();
        this.setState({
            ...this.state,
            products: products,
            active: true
        });


    }

    closeWindow = (e) => {
        this.props.action();
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
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });

        fetch(this.engineDetailsUrl + e.dataItem.engineId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ engineDetailData: json.Data }));

        fetch(this.PartsUrl + e.dataItem.engineId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ enginePartsData: process(json.Data, this.state.dataState2) }));

        this.setState({
            detailType: 'engine'

        });
    }

    handleGridRowClick1 = (e) => {
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });

        fetch(this.productDetailsUrl + e.dataItem.itemRow, this.init)
            .then(response => response.json())
            .then(json => this.setState({ productDetailData: json.Data }));

        this.setState({
            detailType: 'product'
        });
    }

    handleGridRowClick2 = (e) => {
        console.log(e.target.className);
        window.scrollTo(0, 0)
        if ((e.target.className !== 'k-grouping-row') && (e.target.className !== 'k-master-row')) {
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
        }
        else {
            e.stopPropagation();
        }
    }
    reset = () => { this.setState({ dataState: { take: 10, skip: 0 } }); }

    // ALL OF THIS PROPOGATION STUFF WAS HANDLED WITH CSS -> REMOVE BELOW TEST GROUPING ROW CLICK THROUGH
    stopPropagation = (e) => {
        e.stopPropagation();
    }
    componentDidMount() {
        window.jQuery = $
        $('.k-grouping-row td').on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('what you clickin on boi');
        });

        
    }


    columnHasValue = () => {
        let hasValue = false;   
        this.state.products.data.forEach(item => {
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
        // let columnsToShow;
        // var columnsToShowProduct = this.state.columnsA.map((column, index) => {
        //     return <Column {...this.columnProps(column.field)} field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;

        // })
        // var columnsToShowFilter = this.state.columnsD.map((column, index) => {
        //     return <Column {...this.columnProps(column.field)} field={column.field} title={column.title} key={index} width={column.width} cell={column.cell} />;

        // })
        // var columnsToShowEngine = this.state.columnsB.map((columnb, index) => {
        //     return <Column field={columnb.field} title={columnb.title} key={index} width={columnb.width} cell={columnb.cell} />;
        // })
        // var columnsToShowAll = this.state.columnsC.map((columnb, index) => {
        //     return <Column field={columnb.field} title={columnb.title} key={index} width={columnb.width} cell={columnb.cell} />;
        // })

        // if (this.state.productSearch === "product") {
        //     columnsToShow = columnsToShowProduct;
        // }
        // else if (this.state.productSearch === "engine") {
        //     columnsToShow = columnsToShowEngine;
        // }
        // else if (this.state.productSearch === "filter") {
        //     columnsToShow = columnsToShowFilter;
        // }
        // else { columnsToShow = columnsToShowAll; }

        return (

            <div className="searchGrid">

                <div className={this.state.active ? 'activeToggle' : 'hiddenToggle'}>
                    <Button onClick={this.SearchTypeA}>I'm looking for Parts</Button>
                    <Button onClick={this.SearchTypeB}>I'm looking for Engines</Button>
                    <Button onClick={this.SearchTypeC}>Show Me Everything</Button>
                    <button
                        onClick={() => {
                            this.setState({ dataState: { take: 10, skip: 0 } });
                        }}
                    >
                        Clear grid
                    </button>
                </div>

                <div className={this.props.activeSearch === true ? 'visigrid' : 'hider'}>

                    {this.state.productSearch === "product" ? (
                        <Grid
                            style={{ height: '600px' }}
                            ref={div => this.gridWidth = div}
                            pageable={true}
                            resizable={true}
                            //  total={this.state.products.data.length}
                            {...this.state.dataState}
                            {...this.state.products}
                            onChange={this.props.action}
                            onDataStateChange={this.dataStateChange}
                            onRowClick={this.handleGridRowClick1}
                            filterable={true}
                            sortable={true}
                        >
                            {columnsToShow}
                        </Grid>
                    ) : (
                            <Grid
                                style={{ height: '600px' }}
                                ref={div => this.gridWidth = div}
                                pageable={true}
                                resizable={true}
                                total={this.state.products.data.length}
                                {...this.state.dataState}
                                {...this.state.products}
                                onChange={this.props.action}
                                onDataStateChange={this.dataStateChange}
                                onRowClick={this.handleGridRowClick}
                                filterable={true}
                                sortable={true}
                            >
                                {columnsToShow}
                            </Grid>
                        )}

                    {this.state.windowVisible && this.state.detailType === 'engine' &&
                        <Window
                            title="Engine Details"
                            onClose={this.closeWindow}
                        >
                            <div className="flexrow engineModel">
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
                                        reorderable={true}
                                    // filterable={true}
                                    // sortable={true}

                                    >
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

                                        </TabStrip>
                                    </div>

                                )}
                            </div>


                        </Window>
                    }
                </div>
                <ProductLoader
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                    activeSearch={this.props.activeSearch}
                    query={this.props.query}
                    search={this.props.search}
                    action={this.props.action}
                    searchingForCats={this.props.searchCats}
                    cat={this.props.cat}

                    advancedSearchType={this.props.advancedSearchType}
                    oenumber={this.props.oenumber}
                    parentCategoryName={this.props.parentCategoryName}
                    parentCategoryId={this.props.parentCategoryId}
                    childCategoryName={this.props.childCategoryName}
                    childCategoryId={this.props.childCategoryId}
                    productNumber={this.props.productNumber}
                    brand={this.props.brand}
                    modelNo={this.props.modelNo}
                    year={this.props.year}
                    hp={this.props.hp}
                    queryType={this.props.queryType}
                />


            </div>



        );
    }
}

export default LoaderGrid;