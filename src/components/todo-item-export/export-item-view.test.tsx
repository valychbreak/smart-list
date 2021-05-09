import { shallow } from "enzyme";
import TodoItem from "../todo-item-list/types";
import ExportItemView from "./export-item-view";

type OverridingProps = {
    todoItem: TodoItem;
};

function createTodoItem(generalName: string) {
    return TodoItem.createTodoItem(Date.now(), generalName);
}

describe("ExportItemList", () => {
    const exportItemView = ({ ...overridingProps }: OverridingProps) => (
        <ExportItemView {...overridingProps} />
    );

    it("should display all todo items", () => {
        const todoItem = createTodoItem("Milk");

        const wrapper = shallow(exportItemView({ todoItem }));

        expect(wrapper.contains("Milk")).toBe(true);
    });
});
