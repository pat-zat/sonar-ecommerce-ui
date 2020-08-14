
import React from 'react';
import { GridColumn, Grid, GridToolbar } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import products from './products.json';

export class GridWithState extends React.Component {
    constructor(props) {
        super(props);
        const data = JSON.parse(JSON.stringify(this.props.data));
        //const dataState = props.pageable ? { skip: 0, take: this.props.pageSize, group: [  { field: 'parentCategory' } ] } : { skip: 0 };
        const dataState = '';
        this.state = {
            dataState: { skip: 0, take: 10, group: [  { field: 'parentCategory' } ] },
            result: process(data, dataState),
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
            result: process(this.state.allData, e.data)
        });
    };

    render() {
        return (
            <Grid
                editField="_command"
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
                    field="_command"
                    title=" "
                    width="180px"                   
                />
            </Grid>
        );
    }

}

