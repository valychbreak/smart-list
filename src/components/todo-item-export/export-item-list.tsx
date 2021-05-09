import TodoItem from "../todo-item-list/types";
import ExportItemView from "./export-item-view";

type ExportItemListProps = {
    todoItems: TodoItem[];
};

const ExportItemList = (props: ExportItemListProps) => {
    const { todoItems } = props;

    return (<>
        {todoItems.map((todoItem) => (
            <ExportItemView
                key={todoItem.id}
                todoItem={todoItem} />
        ))}
    </>);
};

export default ExportItemList;
