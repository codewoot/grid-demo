import React, { useCallback } from 'react';
import PropTypes from "prop-types";

const GridBody = ({
    columnDefs,
    onSelectionChange,
    rowData,
    selectedRows
}) => {
    const handleRowSelection = useCallback((rowIndex) => {
        const isRowSelected = selectedRows.includes(rowIndex);
        let newSelectedRows;
        if (isRowSelected) {
            newSelectedRows = selectedRows.filter((index) => index !== rowIndex);
        } else {
            newSelectedRows = [...selectedRows, rowIndex];
        }
        onSelectionChange(newSelectedRows);
    }, [selectedRows, onSelectionChange]);

    const handleRowKeyDown = (rowIndex, e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRowSelection(rowIndex);
        }
    };
    
    const handleCheckboxChange = (rowIndex, e) => {
        e.stopPropagation();
        handleRowSelection(rowIndex);
    };

    const isRowSelected = (rowIndex) => {
        return selectedRows.includes(rowIndex);
    };

    return (
        <tbody data-testid="grid-body">
            {rowData.map((row, rowIndex) => (
                <tr
                    aria-selected={isRowSelected(rowIndex)}
                    className={isRowSelected(rowIndex) ? 'grid-row-selected' : ''}
                    key={rowIndex}
                    onClick={() => handleRowSelection(rowIndex)}
                    onKeyDown={(e) => handleRowKeyDown(rowIndex, e)}
                    role="row"
                    tabIndex={0}
                >
                    <td role="gridcell">
                        <input
                            aria-label={`Select row ${rowIndex + 1}`}
                            checked={isRowSelected(rowIndex)}
                            onChange={(e) => handleCheckboxChange(rowIndex, e)}
                            tabIndex={0}
                            type="checkbox"
                        />
                    </td>

                    {columnDefs.map((column, columnIndex) => (
                        <td key={columnIndex} role="gridcell">
                            {column.renderRowCell ? column.renderRowCell(row) : row[column.field]}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

GridBody.propTypes = {
    columnDefs: PropTypes.arrayOf(
        PropTypes.shape({
            headerName: PropTypes.string.isRequired,
            field: PropTypes.string,
            renderRowCell: PropTypes.func,
        })
    ),
    onSelectionChange: PropTypes.func,
    rowData: PropTypes.array,
    selectedRows: PropTypes.arrayOf(PropTypes.number.isRequired)
};

export default GridBody;
