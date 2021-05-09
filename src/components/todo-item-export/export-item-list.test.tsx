import { shallow } from "enzyme";
import TodoItem from "../todo-item-list/types";
import ExportItemList from "./export-item-list";

type OverridingProps = {
    todoItems: TodoItem[];
};

function createTodoItem(generalName: string) {
    return TodoItem.createTodoItem(Date.now(), generalName);
}

describe("ExportItemList", () => {
    const exportItemList = ({ ...overridingProps }: OverridingProps) => (
        <ExportItemList {...overridingProps} />
    );

    it("should display all todo items", () => {
        const todoItems = [createTodoItem("Milk"), createTodoItem("Bread")];

        const wrapper = shallow(exportItemList({ todoItems }));

        expect(wrapper).toMatchSnapshot();
    });
});
