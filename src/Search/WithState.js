
import React from 'react';
import { GridColumn, Grid, GridToolbar } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
//import products from './products.json';
import { ProductLoaderB } from './product-loader.js';

export class GridWithState extends React.Component {

    constructor(props) {
        super(props);
        const data = this.props.data;
        const dataState = props.pageable ? { skip: 0, take: this.props.pageSize } : { skip: 0 };
        this.state = {
            dataState: dataState,
            products: process(data, dataState),
            allData: data
        };
    }

    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.forceUpdate();
    };

    onDataStateChange = (e) => {
        this.setState({
            dataState: e.data,
            products: process(this.state.allData, e.data)
        });
    };

    dataRecieved = (products) => {
        this.setState({
            ...this.state,
            products: products
        });
        // this.resetHandler();
    }

    render() {
        return (
            <div>
                <Grid
                    expandField="_expanded"
                    {...this.props}
                    {...this.state.dataState}
                    {...this.state.result}
                    onExpandChange={this.expandChange}
                    onDataStateChange={this.onDataStateChange}
                >
                    {this.props.children}
                    <GridColumn
                        groupable={false}
                        sortable={false}
                        filterable={false}
                        resizable={false}
                        pageSize={10}
                        pageable={true}
                        title=" "
                        width="180px"
                    />
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

