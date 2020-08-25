import React from 'react';
import { Window } from '@progress/kendo-react-dialogs';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';

class DetailsPage extends React.Component {
    init = { method: 'GET', accept: 'application/json', headers: {} };
    enginePartsUrl = 'http://10.92.48.29:9002/api/productsearch/details/';
    PartsUrl = 'http://10.92.48.29:9002/api/categorysearch/details/';
    engineDetailsUrl = 'http://10.92.48.29:9002/api/EngineDetails/Details/';
    productDetailsUrl = 'http://10.92.48.29:9002/api/SierraPartSearch/Details/';
    
    constructor(props) {
        super(props);
       
        
        this.state = {
            windowVisible: false,
            gridClickedRow: {},
            group: '',
            engineDetailData: [],
            productDetailData: [],
            enginePartsData: [],
            details: [],
            detailType: '',
            dataState: { take: 10, skip: 0 },
        };
    }

    handleGridRowClick = (e) => {
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
      
            fetch(this.engineDetailsUrl + e.dataItem.engineId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ engineDetailData: json.Data }));
      
            fetch(this.enginePartsUrl + e.dataItem.engineId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ details: json.Data }));

            fetch(this.PartsUrl + e.dataItem.engineId, this.init)
            .then(response => response.json())
            .then(json => this.setState({ enginePartsData: json.Data }));

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

      closeWindow = (e) => {
        this.setState({
            windowVisible: false
        });
      }

    render () {
    return (
        <div>
          
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
                                            style={{ height: '400px' }}
                                            data={process(this.state.enginePartsData, this.state.dataState)}
                                            total={this.state.enginePartsData.length}
                                            skip={this.state.skip}
                                            take={this.state.take}
                                            onDataStateChange={this.dataStateChange}
                                            {...this.state.dataState}
                                            onRowClick={this.handleGridRowClick2}
                                            groupable={true}
                                            resizable={true}
                                            reorderable={true}     
                                            sortable={true}
                                            // pageable={{ pageSizes: true }}
                                            onExpandChange={this.expandChange}
                                            expandField="expanded"
                                            
                                        >
                                            <Column field="C_item_row" title="Sierra Part #" />
                                            <Column field="sale_item" title="Sierra Part #" />
                                            <Column field="desclong" title="Description" />
                                            <Column field="cat1_name" title="category" />
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
                                </div>

                            )}
                        </div>
                        </Window>
                    }
        </div>
        
    );
}

}

export default DetailsPage;