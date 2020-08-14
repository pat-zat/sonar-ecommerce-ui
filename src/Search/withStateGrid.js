
import React from 'react';
//import { GridWithState as Grid } from './WithState.js';
import { Grid } from '@progress/kendo-react-grid';
import { GridColumn } from '@progress/kendo-react-grid';
import { ProductLoaderB } from './product-loader.js';
import parts from './parts.json';
import { process } from '@progress/kendo-data-query';

export class WithStateGrid extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            products: { data: [] },
            dataState: { take: 10, skip: 0 }
        };
    }

    resetHandler() {
        this.setState({ dataState: { take: 10, skip: 0 } });
        console.log('reset');
    }


    dataStateChange = (e) => {
        this.setState({
            ...this.state,
            dataState: e.data
        });
    }

   
    dataRecieved = (products) => {
        this.setState({
            ...this.state,
            products: products
        });
        // this.resetHandler();
    }

    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.forceUpdate();
    };

    render() {
        return (
            <div>
             
                <Grid
                    {...this.state.dataState}
                    {...this.state.products}
                    total={this.state.products.data.length}
                    expandField="_expanded"
                    onDataStateChange={this.dataStateChange}
                    onExpandChange={this.expandChange}
                    style={{ height: '540px' }}
                    sortable={true}
                    pageSize={10}
                    pageable={true}                 
                    filterable={true}
                    reorderable={true}
                    resizable={true}
                >
                    <GridColumn field="productNumber" title="Sierra Part #" />
                    <GridColumn field="categoryParent" title="Category" />
                    <GridColumn field="categoryChild" title="Subcategory" />
                    <GridColumn field="description" title="description" />
                 
                </Grid>

                <ProductLoaderB
                    dataState={this.state.dataState}
                    onDataRecieved={this.dataRecieved}
                    activeSearch={this.props.activeSearch}
                    query={this.props.query}
                    search={this.props.search}
                    reset={this.resetHandler}
                />
            </div>
        );
    }
}

export default WithStateGrid;
