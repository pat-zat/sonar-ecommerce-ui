import React from 'react';
import LoaderGrid from './LoaderGrid';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import SonarFilter from '../Filter/SonarFilter';
import { Outboard, Inboard, Drive, Electrical, Gauges, Tools, Steering, Oil, Performance, Cables, Hose, Manuals, Fuel } from "../Sonar/CatIcons";
import { DropDownList } from '@progress/kendo-react-dropdowns';


// const defaultItemCategory = { parentCategory: 'all' };

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
            advancedSearch: false,
            advancedSearchType: '',
            oenumber: '',
            parentCategoryId: '',
            parentCategoryName: '',
            parentCats: { parentCategoryName: "all", parentCategoryId: 0 },
            childCategoryId: '',
            childCategoryName: '',
            productNumber: '',
            queryType: '',
            brand: '',
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
            filter: '',
            left: false,
            dataState: { take: 10, skip: 0 },
            filterSet: [],
            
        };
    }
    componentDidMount = () => {
        fetch(this.engineBrandUrl, this.init)
            .then(response => response.json())
            .then(json => this.setState({ brandList: json.Data }));
        fetch(this.catUrl, this.init)
            .then(response => response.json())
            .then(json => this.setState({ catList: json.Data }));
        fetch(this.filterBarUrl, this.init)
            .then(response => response.json())
            .then(json => this.setState({ filterSet: json.Data }));
            var b = {parentCategoryId: "", parentCategory: "all", productLineId: "", productLine: ""};
            this.state.catList.push(b);
    }
    categoryChange = (e) => {
        const category = e.target.value;
        fetch(this.subCatUrl + category.parentCategoryId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ subCatList: json.Data }));
        this.setState({ parentCategoryName: e.target.value });
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
    searchStateChange = (e) => {
        e.preventDefault();
        this.setState({
            search: true,
            activeSearch: true,
            dataState: { take: 10, skip: 0 }
        });
        this.resetHandler();
    }
    advSearchStateChange = (e) => {
        e.preventDefault();
        this.setState({
            search: true,
            activeSearch: true,
        });
    }
    handlerA() {
        this.setState({ search: true });
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
            advancedSearchType: undefined
        });
    }
    handleInterchange = () => {
        this.setState({
            advancedSearch: true,
            advancedSearchType: 'Interchange'
        });
    }
    handleSierra = () => {
        this.setState({
            advancedSearch: true,
            advancedSearchType: 'sierra'
        });
    }
    handleBrand = () => {
        this.setState({
            advancedSearch: true,
            advancedSearchType: 'brand'
        });
    }
    handleBrandChange = (e) => { this.setState({ brand: e.target.value }); }

   

    render() {
       
        return (

            <div className="simpleSearch" >
                <div className={this.state.activeSearch ? 'activeSearch' : 'searchCon'}>
                    <div className="flex">

                        <form className="searchBar" onSubmit={this.searchStateChange}>
                            <input style={{ maxWidth: '600px' }} className={this.state.advancedSearch === false ? 'activeSearch' : 'hiderb'} placeholder="SEARCH" type="text" name="query" value={this.state.query} onChange={this.handleChange} />
                            <button onClick={this.resetHandler} ref="searchBtn" type={'submit'} className={this.state.advancedSearch === false ? 'k-button searchBtn' : 'hiderb'}><span>Search</span></button>

                        </form>

                        <form className="searchBar" onSubmit={this.advSearchStateChange}>
                            <div className={this.state.advancedSearch === true ? 'advanced' : 'hiderb'}>
                                <div className={this.state.advancedSearchType === 'Interchange' ? 'advanced' : 'hiderb'}>
                                    <input type="hidden" name="id" value='interchange' />
                                    <input placeholder="OENumber" type="text" name="oenumber" value={this.state.oenumber} onChange={this.handleChange} />
                                </div>
                                <div className={this.state.advancedSearchType === 'sierra' ? 'advanced' : 'hiderb'}>
                                    <input type="hidden" name="id" value='sierrapart' />
                                    <div>
                                        <div>Category:</div>
                                        {/* add default value and ID of 'all' and '0' to both of these dropdown */}
                                        <DropDownList
                                            data={this.state.catList}
                                            //defaultItem={this.state.catList[0]}
                                            // defaultItem="all"
                                            textField="parentCategory"
                                            dataItemKey="parentCategoryId"
                                            value={this.state.parentCats.parentCategoryName}
                                            onChange={this.categoryChange}
                                            
                                        />
                                    </div>
                                    <div>
                                        <div>Subcategory:</div>
                                        <DropDownList
                                            data={this.state.subCatList}
                                            defaultValue="all"
                                            textField="childCategory"
                                            dataItemKey="childCategoryId"
                                            value={this.state.childCategoryName}
                                            onChange={this.subCategoryChange}
                                        />
                                    </div>
                                    <input placeholder="Sierra Part #" type="text" name="productNumber" value={this.state.productNumber} onChange={this.handleChange} />
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
                                    <input style={{ width: '220px' }} placeholder="Serial Number" type="text" name="queryType" value={this.state.serialNo} onChange={this.handleChange} />
                                </div>
                                <button ref="advancedToggle" type={'submit'} className="k-button advSearchBtn"><span>Advanced Search</span></button>
                            </div>
                        </form>

                    </div>
                    <div className={this.state.advancedSearchToggle === true ? 'adv-btn-row' : 'hiderb'}>
                        <button ref="advSearchBtn" onClick={this.handleSearchType} className="k-button"><span>Simple Search</span></button>
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
                    queryType='contains'

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