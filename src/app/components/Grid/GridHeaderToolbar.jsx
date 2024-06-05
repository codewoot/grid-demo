import React, {useEffect, useMemo, useRef} from "react";
import PropTypes from "prop-types";

const GridHeaderToolbar = ({
   columnDefs,
   customActions,
   onSelectionChange,
   rowData,
   selectedRows
}) => {
    const selectAllCheckboxRef = useRef();

    const validSelectedRows = useMemo(() => {
        const selectedRowsSet = new Set(selectedRows);
        const uniqueSelectedRows = [...selectedRowsSet];
        return uniqueSelectedRows.filter((rowIndex) => rowIndex >= 0 && rowIndex < rowData.length);
    }, [selectedRows, rowData.length]);

    const areAllRowsSelected = validSelectedRows.length === rowData.length;

    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            selectAllCheckboxRef.current.indeterminate = !areAllRowsSelected && validSelectedRows.length > 0;
            selectAllCheckboxRef.current.checked = areAllRowsSelected;
        }
    }, [areAllRowsSelected, validSelectedRows]);

    const handleHeaderCheckboxChange = () => {
        const selectableIndexes = rowData.map((_, index) => index);
        const isSelected = validSelectedRows.length === selectableIndexes.length;
        onSelectionChange(isSelected ? [] : selectableIndexes);
    };

    const handleHeaderCheckboxKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectAllCheckboxRef.current.click();
        }
    };

    const selectedCounterText =
        (validSelectedRows.length === 0 ?
            'None Selected' :
            `Selected ${validSelectedRows.length}`
        );

    const renderSelectAllCheckbox = () => (
        <div className="select-all-checkbox">
            <input
                aria-label="Select All"
                aria-describedby="selected-counter"
                data-testid="select-all-checkbox-input"
                onChange={handleHeaderCheckboxChange}
                onKeyDown={handleHeaderCheckboxKeyDown}
                ref={selectAllCheckboxRef}
                role="checkbox"
                type="checkbox"
            />
            <span className="visually-hidden-wcag">Select All</span>
        </div>
    );

    return (
        <tr role="toolbar" className="grid-header-toolbar" data-testid="grid-header-toolbar">
            <th>
                {renderSelectAllCheckbox()}
            </th>
            <th colSpan={columnDefs.length}>
                <div className="grid-header-toolbar-custom-actions-container">
                    <span id="selected-counter" data-testid="selected-counter">{selectedCounterText}</span>

                    {customActions.map((action, index) => (
                        <div key={index} role="button">
                            {action.render({ rowData, selectedRows })}
                        </div>
                    ))}
                </div>
            </th>
        </tr>
    );
};

GridHeaderToolbar.propTypes = {
    columnDefs: PropTypes.arrayOf(
        PropTypes.shape({
            headerName: PropTypes.string.isRequired,
            field: PropTypes.string,
            renderHeaderCell: PropTypes.func,
            renderRowCell: PropTypes.func,
        })
    ),
    customActions: PropTypes.arrayOf(
        PropTypes.shape({
            render: PropTypes.func.isRequired
        })
    ),
    onSelectionChange: PropTypes.func,
    rowData: PropTypes.array,
    selectedRows: PropTypes.arrayOf(PropTypes.number.isRequired)
};

export default GridHeaderToolbar;

