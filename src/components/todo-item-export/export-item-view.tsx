import { Typography } from "@material-ui/core";
import TodoItem from "../todo-item-list/types";

type ExportItemViewProps = {
    todoItem: TodoItem;
};

const ExportItemView = (props: ExportItemViewProps) => {
    const { todoItem } = props;
    const { targetProduct } = todoItem;

    const productName = targetProduct?.productFullName || todoItem.generalName;
    const itemName = targetProduct ? productName : todoItem.generalName;

    const categoryName = targetProduct?.category?.name || "-";

    return (<>
        <Typography>{itemName}</Typography>
        <Typography>{categoryName}</Typography>
    </>);
};

export default ExportItemView;
