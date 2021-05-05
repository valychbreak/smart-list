import { act } from "@testing-library/react";
import { shallow } from "enzyme";
import React from "react";
import Scanner from "../../../../Scanner";
import AddTodoItemComponent from "./todo-item-add";
import TodoItemAddForm from "./todo-item-add-form";

describe("AddTodoItemComponent", () => {
    const addTodoItemComponent = (): JSX.Element => <AddTodoItemComponent />;

    it("should display form by default", () => {
        const wrapper = shallow(addTodoItemComponent());

        expect(wrapper.containsMatchingElement(<TodoItemAddForm />)).toBe(true);
    });

    it("should open scanner on button click", () => {
        const wrapper = shallow(addTodoItemComponent());

        act(() => {
            wrapper.find("[data-test-id='open-scanner-btn']").simulate("click");
        });

        expect(wrapper.find(Scanner).exists()).toBe(true);
    });
});
