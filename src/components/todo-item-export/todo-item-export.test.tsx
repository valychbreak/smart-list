import { shallow } from "enzyme";
import TodoItemExport from "./todo-item-export";

describe("TodoItemExport", () => {
    const todoItemExport = () => <TodoItemExport />;

    it("should render", () => {
        const wrapper = shallow(todoItemExport());
        expect(wrapper).toMatchSnapshot();
    });
});
