import { Button } from "@material-ui/core";
import { mount, shallow } from "enzyme";
import React from "react";
import QuantityField from "../../../quantity-field";
import TodoItemAddForm from "./todo-item-add-form";
import TodoItemNameSelect from "./todo-item-name-select";

describe("TodoItemAddForm", () => {
    const todoItemAddForm = (): JSX.Element => <TodoItemAddForm />;

    it("has add button", () => {
        const wrapper = shallow(todoItemAddForm());

        expect(
            wrapper.containsMatchingElement(<Button type="submit">Add</Button>)
        ).toBe(true);
    });

    it("has quantity field", () => {
        const wrapper = mount(todoItemAddForm());

        expect(wrapper.find(QuantityField).exists()).toBe(true);
    });

    it("has todo item name select field", () => {
        const wrapper = mount(todoItemAddForm());

        expect(wrapper.find(TodoItemNameSelect).exists()).toBe(true);
    });
});
