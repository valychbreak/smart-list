import { Button, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Alert } from "@material-ui/lab";
import ExportItem from "./export-item";

function showWarning(exportItem: ExportItem) {
    return !exportItem.category || !exportItem.purchasedPrice;
}

function getWarningMessage(exportItem: ExportItem) {
    if (!exportItem.category && !exportItem.purchasedPrice) {
        return "Category and price are required for export";
    }

    if (!exportItem.category) {
        return "Category is required for export";
    }

    if (!exportItem.purchasedPrice) {
        return "Price is required for export";
    }

    return "";
}

type ExportItemViewProps = {
    exportItem: ExportItem;
    onEdit: (exportItem: ExportItem) => void;
};

const ExportItemView = (props: ExportItemViewProps) => {
    const { exportItem, onEdit } = props;
    const { targetProduct } = exportItem;

    const productName = targetProduct?.productFullName || exportItem.generalName;
    const itemName = targetProduct ? productName : exportItem.generalName;

    const categoryName = exportItem.category?.name || "-";
    const storeName = exportItem.purchasedStore?.name || "-";

    return (<>
        {showWarning(exportItem) && (<>
            <Alert severity="warning">{getWarningMessage(exportItem)}</Alert>
        </>)}
        <Typography>{itemName}</Typography>
        <Typography data-test-id="export-item-category">{categoryName}</Typography>
        <Typography>{exportItem.purchasedPrice}</Typography>
        <Typography data-test-id="export-item-store-name">{storeName}</Typography>
        <Button
            data-test-id="export-item-edit-btn"
            startIcon={<EditIcon />}
            onClick={() => onEdit(exportItem)}
        >
            Edit
        </Button>
    </>);
};

export default ExportItemView;
