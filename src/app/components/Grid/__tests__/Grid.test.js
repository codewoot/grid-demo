import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Grid from '../Grid';
import {render, fireEvent, screen, within} from '@testing-library/react';

const columnDefs = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Device', field: 'device' },
];
const rowData = [
    { name: 'smss.exe', device: 'Mario' },
    { name: 'netsh.exe', device: 'Luigi' },
];
const renderGrid = (props) => render(<Grid {...props} />);

describe('<Grid />', () => {
    describe('Grid rendering', () => {
        it('renders the grid when initialized', () => {
            renderGrid({ columnDefs: [] });
            const gridElement = screen.getByTestId('grid');
            expect(gridElement).toBeInTheDocument();
        });

        it('renders the correct column headers', () => {
            renderGrid({ columnDefs });
            const gridHeaderColumns = screen.getByTestId('grid-header-columns');
            const columnHeaders = gridHeaderColumns.getElementsByTagName('th');
            expect(columnHeaders.length).toEqual(3);
            expect(columnHeaders[1].textContent).toEqual('Name');
            expect(columnHeaders[2].textContent).toEqual('Device');
        });

        it('renders the correct row cell content', () => {
            renderGrid({ columnDefs, rowData });
            const gridBody = screen.getByTestId('grid-body');
            const gridRows = within(gridBody).getAllByRole('row');
            expect(gridRows.length).toEqual(2);

            const gridCellsFirstRow = gridRows[0].querySelectorAll('td');
            expect(gridCellsFirstRow.length).toEqual(3); //first column contains the checkboxes
            expect(gridCellsFirstRow[1].textContent).toEqual('smss.exe');
            expect(gridCellsFirstRow[2].textContent).toEqual('Mario');

            const gridCellsSecondRow = gridRows[1].querySelectorAll('td');
            expect(gridCellsSecondRow.length).toEqual(3); //first column contains the checkboxes
            expect(gridCellsSecondRow[1].textContent).toEqual('netsh.exe');
            expect(gridCellsSecondRow[2].textContent).toEqual('Luigi');
        });

        it('renders selected rows correctly', () => {
            const selectedRows = [0];
            renderGrid({ columnDefs: [], rowData, selectedRows });
            const selectedGridRows = screen.getAllByRole('row', { selected: true });
            expect(selectedGridRows.length).toBe(1);
        });


        it('renders custom header cells', () => {
            const columnDefsWithCustomHeaderCells = [
                { headerName: 'Name', field: 'name', renderHeaderCell: () => 'Custom header name' },
                { headerName: 'Device', field: 'device', renderHeaderCell: (column) => column.headerName.toUpperCase() },
            ];

            renderGrid({ columnDefs: columnDefsWithCustomHeaderCells, rowData });
            const gridHeaderColumns = screen.getByTestId('grid-header-columns');
            const columnHeaders = gridHeaderColumns.getElementsByTagName('th');
            expect(columnHeaders[1].textContent).toEqual('Custom header name');
            expect(columnHeaders[2].textContent).toEqual('DEVICE');
        });

        it('renders custom row cells', () => {
            const columnDefsWithCustomRowCells = [
                { headerName: 'Name', field: 'name', renderRowCell: () => 'Custom cell name' },
                { headerName: 'Device', field: 'device', renderRowCell: (row) => row.device.toUpperCase() }
            ];
            renderGrid({ columnDefs: columnDefsWithCustomRowCells, rowData });
            const gridBody = screen.getByTestId('grid-body');
            const gridRows = within(gridBody).getAllByRole('row');
            const gridCells = gridRows[0].querySelectorAll('td');
            expect(gridCells.length).toBe(3); //first column contains the checkboxes
            expect(gridCells[1]).toHaveTextContent('Custom cell name');
            expect(gridCells[2]).toHaveTextContent('MARIO');
        });

        it('renders custom actions', () => {
            const customActions = [
                { render: () => <button data-testid="custom-action-1">Custom Action 1</button> },
                { render: () => <button data-testid="custom-action-2">Custom Action 2</button> },
            ];
            renderGrid({ columnDefs, customActions });
            expect(screen.getByTestId('custom-action-1')).toBeInTheDocument();
            expect(screen.getByTestId('custom-action-2')).toBeInTheDocument();
        });

        describe('Header "select all" checkbox', () => {
            it('renders "select all" checkbox as unchecked when no rows are selected', () => {
                const selectedRows = [];
                renderGrid({columnDefs, rowData, selectedRows});
                const headerCheckbox = screen.getByTestId('select-all-checkbox-input');
                expect(headerCheckbox.indeterminate).toBe(false);
                expect(headerCheckbox.checked).toBe(false);
            });

            it('renders "select all" checkbox as indeterminate when only some rows are selected', () => {
                const selectedRows = [0];
                renderGrid({columnDefs, rowData, selectedRows});
                const headerCheckbox = screen.getByTestId('select-all-checkbox-input');
                expect(headerCheckbox.indeterminate).toBe(true);
                expect(headerCheckbox.checked).toBe(false);
            });

            it('renders "select all" checkbox as checked when all rows are selected', () => {
                const selectedRows = [0,1];
                renderGrid({columnDefs, rowData, selectedRows});
                const headerCheckbox = screen.getByTestId('select-all-checkbox-input');
                expect(headerCheckbox.indeterminate).toBe(false);
                expect(headerCheckbox.checked).toBe(true);
            });

            it('renders "select all" checkbox as unchecked when "selectedRows" parameter only contains invalid rows ', () => {
                const invalidSelectedRows = [100, 100, 100];
                renderGrid({columnDefs, rowData, selectedRows: invalidSelectedRows});
                const headerCheckbox = screen.getByTestId('select-all-checkbox-input');
                expect(headerCheckbox.indeterminate).toBe(false);
                expect(headerCheckbox.checked).toBe(false);
            });

            it('renders "select all" checkbox correctly when "selectedRows" parameter contains duplicate rows', () => {
                const duplicateSelectedRows = [0, 0, 0]; // only 1 row is selected
                renderGrid({columnDefs, rowData, selectedRows: duplicateSelectedRows});
                const headerCheckbox = screen.getByTestId('select-all-checkbox-input');
                expect(headerCheckbox.indeterminate).toBe(true);
                expect(headerCheckbox.checked).toBe(false);
            });
        })

        describe('Number of selected items text', () => {
            it('renders "None Selected" when no rows are selected', () => {
                const selectedRows = [];
                renderGrid({columnDefs, rowData, selectedRows});
                const selectedCounter = screen.getByTestId('selected-counter');
                expect(selectedCounter).toHaveTextContent('None Selected');
            });

            it('renders "Selected {number}" when rows are selected', () => {
                const selectedRows = [0, 1];
                renderGrid({columnDefs, rowData, selectedRows});
                const selectedCounter = screen.getByTestId('selected-counter');
                expect(selectedCounter).toHaveTextContent('Selected 2');
            });

            it('renders "Selected {number}" correctly when selected rows parameter includes invalid row indexes', () => {
                const selectedRows = [0, 1, 2, 3];
                renderGrid({columnDefs, rowData, selectedRows});
                const selectedCounter = screen.getByTestId('selected-counter');
                expect(selectedCounter).toHaveTextContent('Selected 2');
            });

            it('renders "Selected {number}" correctly when selected rows parameter include duplicate row indexes', () => {
                const selectedRows = [0, 0, 0];
                renderGrid({columnDefs, rowData, selectedRows});
                const selectedCounter = screen.getByTestId('selected-counter');
                expect(selectedCounter).toHaveTextContent('Selected 1');
            });
        })
    });

    describe('Row checkbox selection', () => {
        const TestGridComponent = () => {
            const [selectedRows, setSelectedRows] = useState([]);
            return (
                <Grid
                    columnDefs={columnDefs}
                    rowData={rowData}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                />
            );
        };

        beforeEach(() => {
            render(<TestGridComponent />);
        });

        it('selects and deselects a row using mouse click on the checkbox', () => {
            const firstRowCheckbox = screen.getByRole('checkbox', { name: /Select row 1/ });
            fireEvent.click(firstRowCheckbox);
            expect(firstRowCheckbox).toBeChecked();
            fireEvent.click(firstRowCheckbox);
            expect(firstRowCheckbox).not.toBeChecked();
        });

        it('selects and deselects a row using "Enter" keypress on the checkbox', () => {
            const firstRowCheckbox = screen.getByRole('checkbox', { name: /Select row 1/ });
            fireEvent.keyDown(firstRowCheckbox, { key: 'Enter', code: 13 });
            expect(firstRowCheckbox).toBeChecked();
            fireEvent.keyDown(firstRowCheckbox, { key: 'Enter', code: 13 });
            expect(firstRowCheckbox).not.toBeChecked();
        });

        it('selects and deselects a row using "Space" keypress on the checkbox', () => {
            const firstRowCheckbox = screen.getByRole('checkbox', { name: /Select row 1/ });
            fireEvent.keyDown(firstRowCheckbox, { key: ' ', code: 'Space' });
            expect(firstRowCheckbox).toBeChecked();
            fireEvent.keyDown(firstRowCheckbox, { key: ' ', code: 'Space' });
            expect(firstRowCheckbox).not.toBeChecked();
        });
    });

    describe('Row selection', () => {
        const TestGridComponent = () => {
            const [selectedRows, setSelectedRows] = useState([]);
            return (
                <Grid
                    columnDefs={columnDefs}
                    rowData={rowData}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                />
            );
        };

        beforeEach(() => {
            render(<TestGridComponent />);
        });

        it('selects and deselects a row using mouse click on the row', () => {
            const gridBody = screen.getByTestId('grid-body');
            const rows = within(gridBody).getAllByRole('row');
            const firstRow = rows[0];
            fireEvent.click(firstRow);
            expect(firstRow).toHaveClass('grid-row-selected');
            fireEvent.click(firstRow);
            expect(firstRow).not.toHaveClass('grid-row-selected');
        });

        it('selects and deselects a row using "Space" keypress on the row', () => {
            const gridBody = screen.getByTestId('grid-body');
            const rows = within(gridBody).getAllByRole('row');
            const firstRow = rows[0];
            fireEvent.keyDown(firstRow, { key: ' ', code: 'Space' });
            expect(firstRow).toHaveClass('grid-row-selected');
            fireEvent.keyDown(firstRow, { key: ' ', code: 'Space' });
            expect(firstRow).not.toHaveClass('grid-row-selected');
        });

        it('selects and deselects a row using "Enter" keypress on the row', () => {
            const gridBody = screen.getByTestId('grid-body');
            const rows = within(gridBody).getAllByRole('row');
            const firstRow = rows[0];
            fireEvent.keyDown(firstRow, { key: 'Enter', code: 13 });
            expect(firstRow).toHaveClass('grid-row-selected');
            fireEvent.keyDown(firstRow, { key: 'Enter', code: 13 });
            expect(firstRow).not.toHaveClass('grid-row-selected');
        });
    });

    describe('Header "select all" checkbox selection' , () => {
        const TestGridComponent = () => {
            const [selectedRows, setSelectedRows] = useState([]);
            return (
                <Grid
                    columnDefs={columnDefs}
                    rowData={rowData}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                />
            );
        };

        beforeEach(() => {
            render(<TestGridComponent />);
        });

        it('selects all items when "select all" checkbox is clicked', () => {
            const selectAllCheckbox = screen.getByTestId('select-all-checkbox-input');
            fireEvent.click(selectAllCheckbox);
            const checkboxes = screen.getAllByRole('checkbox');
            expect(checkboxes.length).toBe(rowData.length + 1); // 1 header checkbox + row checkboxes
            checkboxes.forEach((checkbox, index) => {
                if (index === 0) return;
                expect(checkbox).toBeChecked();
            });
        });

        it('unselects all items when "select all" checkbox is clicked twice', () => {
            const selectAllCheckbox = screen.getByTestId('select-all-checkbox-input');
            fireEvent.click(selectAllCheckbox); // Check all
            fireEvent.click(selectAllCheckbox); // Uncheck all
            const checkboxes = screen.getAllByRole('checkbox');
            expect(checkboxes.length).toBe(rowData.length + 1); // 1 header checkbox + row checkboxes
            checkboxes.forEach((checkbox, index) => {
                if (index === 0) return;
                expect(checkbox).not.toBeChecked();
            });
        });

        it('selects all items when "Enter" key is pressed on the "select all" checkbox', () => {
            const selectAllCheckbox = screen.getByTestId('select-all-checkbox-input');
            fireEvent.keyDown(selectAllCheckbox, { key: 'Enter', code: 13 });
            const checkboxes = screen.getAllByRole('checkbox');
            checkboxes.forEach((checkbox, index) => { // shkip the header "select all" checkbox
                if (index === 0) return;
                expect(checkbox).toBeChecked();
            });
        });

        it('selects all items when "Space" key is pressed on the "select all" checkbox', () => {
            const selectAllCheckbox = screen.getByTestId('select-all-checkbox-input');
            fireEvent.keyDown(selectAllCheckbox, { key: ' ', code: 32 });
            const checkboxes = screen.getAllByRole('checkbox');
            checkboxes.forEach((checkbox, index) => {
                if (index === 0) return; //Skip the header "select all" checkbox.
                expect(checkbox).toBeChecked();
            });
        });
    });
});
