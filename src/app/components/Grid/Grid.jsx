import React from 'react';
import PropTypes from 'prop-types';
import GridHeader from "./GridHeader";
import GridBody from "./GridBody";
import './Grid.css';

/**
 * The Grid component renders the data in a customizable grid format
 *
 * @param {Object} props - Properties passed to the component.
 * @param {Array<Object>} [props.columnDefs=[]] - Array of column definition objects.
 * @param {Array<Object>} [props.customActions=[]] - Array of custom actions that are rendered in the grid header.
 * @param {Function} [props.onSelectionChange=()=>{}] - Function triggered on selection change.
 * @param {Array<Object>} [props.rowData=[]] - Array of row data.
 * @param {Array<number>} [props.selectedRows=[]] - Array of selected row indices.
 * @returns {JSX.Element} - The grid element.
 * @example
 * <Grid
 *   columnDefs={[
 *     { headerName: 'Name', field: 'name' },
 *     { headerName: 'Device',
 *       field: 'device',
 *       renderHeaderCell: (column) => <strong>{column.headerName}</strong>
 *       renderRowCell: (row) => <strong>{row.device}</strong>
 *      }
 *   ]}
 *   customActions={[
 *     { render: () => <button>Download Available Items</button> },
 *     { render: () =>
 *         <button onClick=(({rowData}) => console.log(rowData))>
 *              Download Scheduled Items
 *         </button>
 *     }
 *   ]}
 *   onSelectionChange={(selectedRows) => console.log(selectedRows)}
 *   rowData={[
 *     { name: 'smss.exe', device: 'Mario' },
 *     { name: 'netsh.exe', device: 'Luigi' }
 *   ]}
 *   selectedRows={[0]}
 * />
 */

const Grid = ({
    columnDefs = [],
    customActions = [],
    onSelectionChange = () => {},
    rowData = [],
    selectedRows = []
}) => {
    return (
        <table className="grid" role="grid" aria-label="grid" data-testid="grid">
            <GridHeader
                columnDefs={columnDefs}
                customActions={customActions}
                onSelectionChange={onSelectionChange}
                rowData={rowData}
                selectedRows={selectedRows}
            />
            <GridBody
                columnDefs={columnDefs}
                onSelectionChange={onSelectionChange}
                rowData={rowData}
                selectedRows={selectedRows}
            />
        </table>
    );
};

Grid.propTypes = {
    columnDefs: PropTypes.arrayOf(
        PropTypes.shape({
            headerName: PropTypes.string.isRequired,
            field: PropTypes.string,
            renderRowCell: PropTypes.func,
            renderHeaderCell: PropTypes.func
        })
    ).isRequired,
    customActions: PropTypes.arrayOf(
        PropTypes.shape({
            render: PropTypes.func.isRequired
        })
    ),
    onSelectionChange: PropTypes.func,
    rowData: PropTypes.array,
    selectedRows: PropTypes.arrayOf(PropTypes.number.isRequired)
};


export default Grid;
