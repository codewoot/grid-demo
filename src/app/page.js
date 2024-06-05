"use client"
import React from "react";
import {useState} from "react";
import Grid from "@/components/Grid/Grid";
import renderFunctions from "@/app/utils/renderFunctions";
import sampleRowData from "@/app/utils/sampleRowData";

const {
  renderStatusHeaderCell,
  renderStatusRowCell,
  renderDownloadSelectedButton
} = renderFunctions;

const columnDefs = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Device', field: 'device' },
  { headerName: 'Path', field: 'path' },
  {
    headerName: 'Status',
    field: 'status',
    renderRowCell: renderStatusRowCell,
    renderHeaderCell:  renderStatusHeaderCell
  },
];

const customActions = [
  { render: renderDownloadSelectedButton }
];

const GridDemo = () => {
  const [rowData] = useState(sampleRowData);
  const [selectedRows, setSelectedRows] = useState([]);

  return (
      <main className="grid-demo">
        <h1>Grid Demo</h1>
        <Grid
            columnDefs={columnDefs}
            rowData={rowData}
            customActions={customActions}
            selectedRows={selectedRows}
            onSelectionChange={(newSelection) => setSelectedRows(newSelection)}
        />
      </main>
  );
};

export default GridDemo;
