import React from "react";
import Button from "@/components/Button/Button";
import StatusIcon from "@/components/StatusIcon/StatusIcon";
import DownloadIcon from "@/components/DownloadIcon/DownloadIcon";

const STATUS_ICON_WIDTH = 20; // setting this value auto-aligns status header name and status row cell texts

const getDownloadableRows = ({selectedRows, rowData}) => {
    const selectedRowObjects = selectedRows.map((rowIndex) => rowData[rowIndex]);
    return selectedRowObjects.filter((row) => row?.status.toLowerCase() === "available");
};

const handleDownloadClick = (gridParams) => {
    const downloadableRows = getDownloadableRows(gridParams);
    const downloadList = downloadableRows
        .map((item, index) =>
            `#${index + 1} \nDevice:${item.device} \nPath:${item.path} `)
        .join("\n\n");
    alert(`Downloading items:\n${downloadList}`);
};

/**
 * Renders a download button for items with 'available' status.
 * Button is enabled only if there are 'available' items selected.
 *
 * @param {Object} gridParams - Parameters for the grid.
 * @param {Array} gridParams.selectedRows - Array of selected row indices.
 * @param {Array} gridParams.rowData - Array of row data.
 * @returns {JSX.Element} - Download button JSX element.
 */
const renderDownloadSelectedButton = (gridParams) => {
    return (
        <Button
            name={`Download Selected`}
            onClick={() => handleDownloadClick(gridParams)}
            disabled={getDownloadableRows(gridParams).length === 0}
            icon={<DownloadIcon aria-label="Download Icon" role="img"/>}
        />
    );
};

/**
 * Renders the status row cell with a status icon and a text.
 *
 * @param {Object} data - Data object containing the status.
 * @param {string} data.status - Status to be displayed.
 * @returns {JSX.Element} - Status cell JSX element.
 */
const renderStatusRowCell = ({ status }) => {
    const isAvailable = status?.toLowerCase() === 'available';

    return (
        <div>
            {isAvailable && (
                <div style={{display: 'inline-block', width: STATUS_ICON_WIDTH}}>
                    <StatusIcon status={status}/>
                </div>
            )}

            <span style={{
                textTransform: 'capitalize',
                paddingLeft: isAvailable ? 0 : STATUS_ICON_WIDTH + 1 // 1px extra left padding for pixel perfect vertical alignment
            }}>
                {status}
            </span>
        </div>
    )
};

const renderStatusHeaderCell = () => (
    // 1px extra left padding for pixel perfect vertical alignment
    <div style={{paddingLeft: STATUS_ICON_WIDTH + 1}}>
        Status
    </div>
);

const renderFunctions = {
    renderStatusRowCell,
    renderDownloadSelectedButton,
    renderStatusHeaderCell
};

export default renderFunctions;

