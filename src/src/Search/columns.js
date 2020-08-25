
const columns = [
    {
        title: 'Product Id',
        field: 'ProductID',
        show: true,
        filter: 'text'
    },
    {
        title: 'Product Name',
        field: 'ProductName',
        show: true,
        filter: 'text'
    },
    {
        title: 'Quantity Per Unit',
        field: 'QuantityPerUnit',
        show: true,
        filter: 'numeric'
    },
    {
        title: 'Unit Price',
        field: 'UnitPrice',
        show: true,
        filter: 'numeric'
    },
    {
        title: 'Units In Stock',
        field: 'UnitsInStock',
        show: true,
        filter: 'numeric'
    },
    {
        title: 'Discontinued',
        field: 'Discontinued',
        show: true,
        filter: 'boolean'
    }
];

export default columns;

