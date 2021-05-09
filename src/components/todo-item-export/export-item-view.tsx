import { Typography } from "@material-ui/core";
import ExportItem from "./export-item";

type ExportItemViewProps = {
    exportItem: ExportItem;
};

const ExportItemView = (props: ExportItemViewProps) => {
    const { exportItem } = props;
    const { targetProduct } = exportItem;

    const productName = targetProduct?.productFullName || exportItem.generalName;
    const itemName = targetProduct ? productName : exportItem.generalName;

    const categoryName = exportItem.category?.name || "-";

    return (<>
        <Typography>{itemName}</Typography>
        <Typography>{categoryName}</Typography>
        <Typography>{exportItem.purchasedPrice}</Typography>
    </>);
};

export default ExportItemView;
