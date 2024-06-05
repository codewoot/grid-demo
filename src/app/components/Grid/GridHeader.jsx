import React from "react";
import PropTypes from "prop-types";
import GridHeaderToolbar from "./GridHeaderToolbar";

const GridHeader = ({
    columnDefs = [],
    customActions = [],
    onSelectionChange = () => {},
    rowData = [],
    selectedRows= []
}) => {
    const renderGridHeaderColumns = () => (
        <tr role="rowheader" data-testid="grid-header-columns">
            <th role="columnheader" scope="col">
                <span className="visually-hidden-wcag">Checkbox</span>
            </th>

            {columnDefs.map((column, index) => (
                <th key={index} role="columnheader" scope="col">
                    {column.renderHeaderCell ? column.renderHeaderCell(column) : column.headerName}
                </th>
            ))}
        </tr>
    );

    return (
        <thead>
            <GridHeaderToolbar
                columnDefs={columnDefs}
                customActions={customActions}
                onSelectionChange={onSelectionChange}
                rowData={rowData}
                selectedRows={selectedRows}
            />
            { renderGridHeaderColumns() }
        </thead>
    );
};


GridHeader.propTypes = {
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

export default GridHeader;
