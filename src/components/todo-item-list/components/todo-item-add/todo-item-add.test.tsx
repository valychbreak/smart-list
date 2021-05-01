import { shallow } from "enzyme";
import React from "react";
import AddTodoItemComponent from "./todo-item-add";
import TodoItemAddForm from "./todo-item-add-form";

describe("AddTodoItemComponent", () => {
    const addTodoItemComponent = (): JSX.Element => <AddTodoItemComponent />;

    it("should display form by default", () => {
        const wrapper = shallow(addTodoItemComponent());

        expect(wrapper.containsMatchingElement(<TodoItemAddForm />)).toBe(true);
    });
});
