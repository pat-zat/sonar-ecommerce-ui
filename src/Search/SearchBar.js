import React from 'react';
import axios from 'axios';
import LoaderGrid from './LoaderGrid';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { RadioGroup } from '@progress/kendo-react-inputs';
import SonarFilter from '../Filter/SonarFilter';
import { Outboard, Inboard, Drive, Electrical, Gauges, Tools, Steering, Oil, Performance, Cables, Hose, Manuals, Fuel } from "../Sonar/CatIcons";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import history from '../history.js';

const queryTypes = [
    { label: 'Contains', value: 'Contains' },
    { label: 'Ends With', value: 'Ends With' },
    { label: 'Starts With', value: 'Starts With' },
];

function getParams(location) {
    const searchParams = new URLSearchParams(location.search);
    return {
        query: searchParams.get("query") || "",
        oeNumber: searchParams.get("oeNumber") || "",
        parentCategoryId: searchParams.get("parentCategoryId") || "",
        parentCategoryName: searchParams.get("parentCategoryName") || "",
        childCategoryId: searchParams.get("childCategoryId") || "",
        childCategoryName: searchParams.get("childCategoryName") || "",
        productNumber: searchParams.get("productNumber") || "",
        queryType: searchParams.get("queryType") || "",
        brand: searchParams.get("brand") || "",
        modelNumber: searchParams.get("modelNumber") || "",
        year: searchParams.get("year") || "",
        hp: searchParams.get("hp") || "",
        serialNumber: searchParams.get("serialNumber") || "",
        urlEngineId: searchParams.get("urlEngineId") || "",
        itemRow: searchParams.get("itemRow") || "",
        C_item_row: searchParams.get("C_item_row") || "",
        skip: searchParams.get("skip") || 0
    };
}

function setParams({ query }) {
    const searchParams = new URLSearchParams();
    searchParams.set("query", query || "");
    return searchParams.toString();
}

class SearchBar extends React.Component {
    catUrl = 'http://10.92.48.29:9002/api/AdvancedSearch/Details/?id=getcategories';
    subCatUrl = 'http://10.92.48.29:9002/api/AdvancedSearch/Details/?id=getsubcategories&parentCategoryId=';
    engineBrandUrl = 'http://10.92.48.29:9002/api/AdvancedSearch/Details/?id=getbrands';
    filterBarUrl = 'http://10.92.48.29:9002/api/IconFilters/Details/Gauges';
    testUrl = 'http://10.92.48.29:9002/Home/GetProducts';
    init = { method: 'GET', accept: 'application/json', headers: {} };

    constructor(props) {
        super(props);
        this.loaderGrid = React.createRef();
        this.handlerA = this.handlerA.bind(this);
        this.state = {
            query: '',
            cat: '',
            advancedSearchToggle: true,
            advancedSearch: true,
            advancedSearchType: 'brand',
            oenumber: '',
            parentCategoryId: '',
            parentCategoryName: { parentCategory: "all", parentCategoryId: 0 },
            parentCats: { parentCategory: "all", parentCategoryId: 0 },
            childCategoryId: '',
            childCategoryName: { childCategory: "", childCategoryId: "" },
            productNumber: '',
            brand: {brandName: '', brandId: ''},
            modelNo: '',
            year: '',
            hp: '',
            serialNo: '',
            queryType: '',
            catList: [],
            subCatList: [],
            brandList: [],
            search: false,
            searchCats: false,
            activeSearch: false,
            releaseSearch: false,
            filter: '',
            left: false,
            dataState: { take: 10, skip: 0 },
            filterSet: [],
            checked: queryTypes[0].value,      
            disabled: false,

        };
    }

    radioClick = () => {
        this.setState({ disabled: false });
    }
    radioChange = (e) => {
        this.setState({ checked: e.value });
    }

    componentDidMount = async () => {
        console.log("SearchBar Mounted");
        
        const responseA = await axios.get(this.engineBrandUrl, {headers: {}});
        console.log(responseA);
        this.setState({ 
            brandList: responseA.data.Data,
            brand: {brandName: responseA.data.Data["0"].brandName, brandId: ''},    
        });

        fetch(this.catUrl, this.init)
            .then(response => response.json())
            .then(json => this.setState({ catList: json.Data }));
        fetch(this.filterBarUrl, this.init)
            .then(response => response.json())
            .then(json => this.setState({ filterSet: json.Data }));

        let myParams = getParams(this.props.location);

        if (this.props.location.search !== "") {
            this.setState({
                activeSearch: true,
                search: true,
                releaseSearch: true,
            });
            if (myParams.parentCategoryName !== "") {
                this.setState({
                    advancedSearchType: "sierra",
                    releaseSearch: true,
                    search: true
                });
            }
            else if (myParams.oeNumber !== "") {
                this.setState({
                    advancedSearchType: "Interchange",
                    releaseSearch: true,
                    search: true
                });
            }
            else this.setState({
                advancedSearchType: "brand",
                releaseSearch: true,
                search: true
            });
        }
    }

    categoryChange = (e) => {
        const category = e.target.value;
        console.log("cat" + category.parentCategoryId);
        fetch(this.subCatUrl + category.parentCategoryId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ subCatList: json.Data }));
        this.setState({
            parentCategoryName: e.target.value,
            childCategoryName: "all",
            childCategory: "all"
        });
    }

    subCategoryChange = (e) => {
        this.setState({ childCategoryName: e.target.value });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            search: false,
        });
    };

    advSearchStateChange = (e) => {
        e.preventDefault();
   
        this.setState({
            search: true,
            activeSearch: true,
            releaseSearch: true,
            dataState: { take: 10, skip: 0 }
        });
        this.resetHandler();

        if (this.state.advancedSearchType === 'Interchange') {
            history.push("/api/AdvancedSearch/Details/?id=interchange&oeNumber=" + this.state.oenumber);
            //window.location.reload();
        }
        else if (this.state.advancedSearchType === 'sierra') {
            history.push("/api/AdvancedSearch/Details/" + '?id=' + 'sierrapart'
                + '&parentCategoryId=' + this.state.parentCategoryName.parentCategoryId
                + '&parentCategoryName=' + this.state.parentCategoryName.parentCategory
                + '&childCategoryId=' + this.state.childCategoryName.childCategoryId
                + '&childCategoryName=' + this.state.childCategoryName.childCategory
                + '&productNumber=' + this.state.productNumber
                + '&queryType=' + this.state.checked);
            //window.location.reload();
        }
        else if (this.state.advancedSearchType === 'brand') {
            history.push("/api/AdvancedSearch/Details/" + '?id=' + 'brandmodel'
                + '&brand=' + this.state.brand.brandName
                + '&modelNumber=' + this.state.modelNo
                + '&year=' + this.state.year
                + '&hp=' + this.state.hp
                + '&serialNumber=' + this.state.serialNo
                + '&queryType=' + this.state.checked
                + '&skip=0');
            //window.location.reload();
        }
    }

    handlerA() {
        this.setState({ search: true });
        console.log("callback");
    }

    resetHandler = () => {
        this.loaderGrid.current.reset();
    }

    toggleDrawer = () => {
        if (this.state.left === false) {
            this.setState({ left: true });
        }
        if (this.state.left === true) {
            this.setState({ left: false });
        }
    }

    catSearch = (event) => {
        console.log(event.target.innerText);
        this.setState({
            cat: event.target.innerText,
            search: true,
            searchCats: true,
            activeSearch: true
        });
        if (this.state.left === false) {
            this.setState({ left: true });
        }
        if (this.state.left === true) {
            this.setState({ left: false });
        }
    }
    handleSearchType = () => {
        this.setState({
            advancedSearch: false,
            search: false,
            releaseSearch: false,
            advancedSearchType: undefined,
            products: { data: [], total: 0 }
        });
    }
    handleBrand = () => {
        //let defaultBrand = this.state.brandList[0];
        this.setState({
            advancedSearch: true,
            search: false,
            releaseSearch: false,
            advancedSearchType: 'brand',
            //brand: defaultBrand.brandName,
            checked: queryTypes[0].value,
        });

    }
    handleBrandChange = (e) => { this.setState({ brand: e.target.value }); }
    handleInterchange = () => {
        this.setState({
            advancedSearch: true,
            search: false,
            releaseSearch: false,
            advancedSearchType: 'Interchange'
        });
    }

    handleSierra = () => {
        this.setState({
            advancedSearch: true,
            search: false,
            releaseSearch: false,
            advancedSearchType: 'sierra',
            checked: queryTypes[0].value,
        });
    }
    



    render() {

        return (

            <div className="simpleSearch" >
                <div className={this.state.activeSearch ? 'activeSearch' : 'searchCon'}>
                    <div className="flex">
                        <form className="searchBar" onSubmit={this.advSearchStateChange}>
                            <div className='advanced'>

                                <div className={this.state.advancedSearchType === 'Interchange' ? 'advanced' : 'hiderb'}>
                                    <input type="hidden" name="id" value='interchange' />
                                    <input placeholder="OENumber" type="text" name="oenumber" value={this.state.oenumber} onChange={this.handleChange} />
                                </div>

                                <div className={this.state.advancedSearchType === 'sierra' ? 'advanced' : 'hiderb'}>
                                    <input type="hidden" name="id" value='sierrapart' />
                                    <div>
                                        <div>Category:</div>

                                        <DropDownList
                                            data={this.state.catList}
                                            defaultItem={this.state.parentCats}
                                            textField="parentCategory"
                                            dataItemKey="parentCategoryId"
                                            value={this.state.parentCategoryName}

                                            onChange={this.categoryChange}
                                        />
                                    </div>
                                    <div className={this.state.parentCategoryName.parentCategory === "all" ? 'no-click-opacity' : 'subcats'}>
                                        <div>Subcategory:</div>
                                        <DropDownList
                                            data={this.state.subCatList}
                                            label={this.state.parentCategoryName.parentCategory === "all" ? "all" : ""}
                                            defaultItem=""
                                            textField="childCategory"
                                            dataItemKey="childCategoryId"
                                            value={this.state.childCategoryName}
                                            onChange={this.subCategoryChange}
                                        />
                                    </div>
                                    <div className="flexcol">
                                        <div><RadioGroup data={queryTypes} disabled={this.state.disabled} value={this.state.checked} onChange={this.radioChange}/></div>
                                        
                                        <input placeholder="Sierra Part #" type="text" name="productNumber" value={this.state.productNumber} onChange={this.handleChange} />
                                    </div>

                                </div>
                                <div className={this.state.advancedSearchType === 'brand' ? 'advanced' : 'hiderb'}>
                                    <input type="hidden" name="id" value='brandmodel' />
                                    {/* add default */}
                                    <DropDownList
                                        data={this.state.brandList}
                                        textField="brandName"
                                        dataItemKey="brandId"
                                        value={this.state.brand}
                                        onChange={this.handleBrandChange}
                                        defaultItem={this.state.brandList[0]}
                                    />

                                    <input style={{ width: '120px' }} placeholder="model" type="text" name="modelNo" value={this.state.modelNo} onChange={this.handleChange} />
                                    <input style={{ width: '120px' }} placeholder="year" type="text" name="year" value={this.state.year} onChange={this.handleChange} />
                                    <input style={{ width: '180px' }} placeholder="horsepower" type="text" name="hp" value={this.state.hp} onChange={this.handleChange} />

                                    <div className="flexcol">
                                        <div><RadioGroup data={queryTypes} disabled={this.state.disabled} value={this.state.checked} onChange={this.radioChange}/></div>
                                        
                                        <input style={{ width: '220px' }} placeholder="Serial Number" type="text" name="serialNo" value={this.state.serialNo} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <button ref="advancedToggle" type={'submit'} className="k-button advSearchBtn"><span>Advanced Search</span></button>
                            </div>
                        </form>

                    </div>
                    <div className='adv-btn-row'>
                        <button ref="advSearchBtn" onClick={this.handleInterchange} className="k-button"><span>Interchange</span></button>
                        <button ref="advSearchBtn" onClick={this.handleSierra} className="k-button"><span>Sierra Part #</span></button>
                        <button ref="advSearchBtn" onClick={this.handleBrand} className="k-button"><span>Brand - model</span></button>
                    </div>
                </div>

                <LoaderGrid
                    ref={this.loaderGrid}
                    resetState={this.state.dataState}
                    searchCats={this.state.searchCats}
                    cat={this.state.cat}
                    action={this.handlerA}

                    search={this.state.search}
                    query={this.state.query}
                    activeSearch={this.state.activeSearch}
                    releaseSearch={this.state.releaseSearch}
                    location={this.props.location}
                    urlQuery={getParams(this.props.location)}
                    myLocation={this.props.location}
                    advancedSearchType={this.state.advancedSearchType}

                    oenumber={this.state.oenumber}

                    parentCategoryName={this.state.parentCategoryName.parentCategory}
                    parentCategoryId={this.state.parentCategoryName.parentCategoryId}
                    childCategoryName={this.state.childCategoryName.childCategory}
                    childCategoryId={this.state.childCategoryName.childCategoryId}
                    productNumber={this.state.productNumber}

                    brand={this.state.brand.brandName}
                    modelNo={this.state.modelNo}
                    year={this.state.year}
                    hp={this.state.hp}
                    serialNo={this.state.serialNo}
                    //queryType='contains'
                    queryType={this.state.checked}
                />

                <div className="srch-btn-con">
                    <div className="searchFlex">
                        <Outboard catVal="Outboard" OnIcon={this.catSearch} />
                        <Inboard catVal="Inboard" OnIcon={this.catSearch} />
                        <Drive catVal="Drive" OnIcon={this.catSearch} />
                        <Electrical catVal="Electrical" OnIcon={this.catSearch} />
                        <Gauges catVal="Gauges" OnIcon={this.catSearch} />
                        <Tools catVal="Tools" OnIcon={this.catSearch} />
                        <Steering catVal="Steering" OnIcon={this.catSearch} />
                        <Oil catVal="Oil" OnIcon={this.catSearch} />
                        <Performance catVal="Performance" OnIcon={this.catSearch} />
                        <Cables catVal="Cables" OnIcon={this.catSearch} />
                        <Hose catVal="Hose" OnIcon={this.catSearch} />
                        <Manuals catVal="Manuals" OnIcon={this.catSearch} />
                        <Fuel catVal="Fuel" OnIcon={this.catSearch} />
                    </div>
                </div>

                <Drawer open={this.state.left} onClose={this.toggleDrawer}>
                    <SonarFilter filters={this.state.filterSet} />
                </Drawer>
               <Button onClick={this.toggleDrawer}>Gauge Filter</Button> 

            </div>
        );
    }
}

export default SearchBar;