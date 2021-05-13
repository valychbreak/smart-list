import { Button, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ExportItem from "./export-item";

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
