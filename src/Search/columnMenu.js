import React from 'react';
import { GridColumnMenuSort, GridColumnMenuFilter} from '@progress/kendo-react-grid';

export class ColumnMenu extends React.Component {
    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter) ||
                GridColumnMenuSort.active(field, dataState.sort);
    }
    render() {
        return (
            <div>
                <GridColumnMenuSort {...this.props} />
                <GridColumnMenuFilter {...this.props} />
            </div>
        );
    }
}
