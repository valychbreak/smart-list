import { shallow } from "enzyme";
import TodoItem from "../todo-item-list/types";
import ExportItemList from "./export-item-list";

type OverridingProps = {
    todoItems: TodoItem[];
};

function createTodoItem(id: number, generalName: string) {
    return TodoItem.createTodoItem(id, generalName);
}

describe("ExportItemList", () => {
    const exportItemList = ({ ...overridingProps }: OverridingProps) => (
        <ExportItemList {...overridingProps} />
    );

    it("should display all todo items", () => {
        const todoItems = [
            createTodoItem(1, "Milk"),
            createTodoItem(2, "Bread"),
        ];

        const wrapper = shallow(exportItemList({ todoItems }));

        expect(wrapper).toMatchSnapshot();
    });
});
