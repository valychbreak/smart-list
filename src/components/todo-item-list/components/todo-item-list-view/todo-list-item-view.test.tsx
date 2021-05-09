import { shallow } from "enzyme";
import React from "react";
import td from "testdouble";
import Product from "../../../../entity/Product";
import TodoItem from "../../types";
import TodoListItemView, { StorePriceView } from "./todo-list-item-view";

type OverridingProps = {
    todoItem: TodoItem;
    showPurchaseAction?: boolean;
};

function createPurchasedTodoItem(
    generalName: string,
    productPrice: number,
    purchasedPrice: number | null
) {
    return new TodoItem(1, generalName, 1, true, productPrice, purchasedPrice);
}

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

    it("should display product price", () => {
        const todoItem = TodoItem.createTodoItem(1, "Milk", 3.99);

        const wrapper = shallow(
            todoListItemView({
                todoItem,
            })
        );

        expect(
            wrapper.containsMatchingElement(
                <StorePriceView price={3.99} quantity={1} />
            )
        ).toBe(true);
    });

    it("should display purchased price for purchased todo item when it's set", () => {
        const todoItem = createPurchasedTodoItem("Milk", 3.99, 5.33);

        const wrapper = shallow(
            todoListItemView({
                todoItem,
            })
        );

        expect(
            wrapper.containsMatchingElement(
                <StorePriceView price={5.33} quantity={1} />
            )
        ).toBe(true);
    });

    it("should display product price for purchased todo item when purchased price is not set", () => {
        const todoItem = createPurchasedTodoItem("Milk", 3.99, null);

        const wrapper = shallow(
            todoListItemView({
                todoItem,
            })
        );

        expect(
            wrapper.containsMatchingElement(
                <StorePriceView price={3.99} quantity={1} />
            )
        ).toBe(true);
    });
});
