import { act } from "@testing-library/react";
import { shallow } from "enzyme";
import td from "testdouble";
import React from "react";
import Scanner from "../../../../Scanner";
import AddTodoItemComponent, { addProductToTodoItems } from "./todo-item-add";
import TodoItemAddForm from "./todo-item-add-form";
import Product from "../../../../entity/Product";
import ProductApi from "../../../../api/ProductApi";
import TodoItem from "../../types";

describe("AddTodoItemComponent", () => {
    const addTodoItemComponent = (): JSX.Element => <AddTodoItemComponent />;

    describe("render", () => {
        it("should display form by default", () => {
            const wrapper = shallow(addTodoItemComponent());

            expect(wrapper.find(TodoItemAddForm).exists())
                .toBe(true);
        });

        it("should open scanner on button click", () => {
            const wrapper = shallow(addTodoItemComponent());

            act(() => {
                wrapper.find("[data-test-id='open-scanner-btn']").simulate("click");
            });

            expect(wrapper.find(Scanner).exists()).toBe(true);
        });
    });

    describe("addProductToTodoItems", () => {
        it("should add product to todo items", async () => {
            // given
            const product = td.object<Product>();
            jest.spyOn(ProductApi, "saveProduct").mockResolvedValue(
                product
            );

            type AddItem = (todoItem: TodoItem) => void;
            const addItemMock = td.func<AddItem>();

            // when
            await addProductToTodoItems(product, addItemMock);

            // then
            td.verify(addItemMock(td.matchers.anything()));
        });
    });
});
