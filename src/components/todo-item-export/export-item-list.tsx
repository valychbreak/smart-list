import TodoItem from "../todo-item-list/types";
import ExportItemListItem from "./export-item-list-item";

type ExportItemListProps = {
    todoItems: TodoItem[];
};

const ExportItemList = (props: ExportItemListProps) => {
    const { todoItems } = props;

    return (<>
        {todoItems.map((todoItem) => (
            <ExportItemListItem
                key={todoItem.id}
                todoItem={todoItem} />
        ))}
    </>);
};

export default ExportItemList;
