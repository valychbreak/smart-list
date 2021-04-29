import { shallow } from "enzyme";
import td from "testdouble";
import Product from "../../../../entity/Product";
import TodoItem from "../../types";
import TodoListItemView from "./todo-list-item-view";

type OverridingProps = {
    todoItem: TodoItem;
    showPurchaseAction?: boolean;
};

describe("TodoListItemView", () => {
    const todoListItemView = ({
        todoItem,
        ...overridingProps
    }: OverridingProps) => (
        <TodoListItemView
            item={todoItem}
            showPurchaseAction={false}
            onTodoItemPurchaseToggle={() => {}}
            {...overridingProps}
        />
    );

    it("should display highlighted name for linked items", () => {
        const todoItem = TodoItem.fromName("Milk", 1);
        todoItem.targetProduct = td.object<Product>();

        const wrapper = shallow(
            todoListItemView({
                todoItem,
            })
        );

        expect(wrapper.find("[data-test-id='todo-item-name']").text()).toEqual(
            "Milk*"
        );
    });

    it("should display name for linked items", () => {
        const todoItem = TodoItem.fromName("Milk", 1);

        const wrapper = shallow(
            todoListItemView({
                todoItem,
            })
        );

        expect(wrapper.find("[data-test-id='todo-item-name']").text()).toEqual(
            "Milk"
        );
    });

    it("should display purchase action", () => {
        const todoItem = TodoItem.fromName("Milk", 1);

        const wrapper = shallow(
            todoListItemView({
                todoItem,
                showPurchaseAction: true,
            })
        );

        expect(
            wrapper
                .find("[data-test-id='todo-item-purchase-checkbox']")
                .exists()
        ).toBe(true);
    });
});
