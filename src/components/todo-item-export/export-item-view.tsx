import { Typography } from "@material-ui/core";
import TodoItem from "../todo-item-list/types";

type ExportItemViewProps = {
    todoItem: TodoItem;
};

const ExportItemView = (props: ExportItemViewProps) => {
    const { todoItem } = props;

    return (
        <Typography>{todoItem.generalName}</Typography>
    );
};

export default ExportItemView;
