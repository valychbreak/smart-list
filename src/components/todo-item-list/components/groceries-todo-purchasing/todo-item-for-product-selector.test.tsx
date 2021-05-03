import { act } from "@testing-library/react";
import td from "testdouble";
import { Select, Typography } from "@material-ui/core";
import { mount, shallow } from "enzyme";
import TodoItem from "../../types";
import SelectTodoItemForProduct from "./todo-item-for-product-selector";
import { BarcodeScanResult } from "../../../barcode-scanner/types";

type OverridingProps = {
    todoItems: TodoItem[];
    barcodeScanResult?: BarcodeScanResult;
    onTodoItemSubmit?(todoItem: TodoItem): void;
};

function mockTodoItem(id: number, generalName: string) {
    const todoItem = td.object<TodoItem>();
    todoItem.id = id;
    todoItem.generalName = generalName;
    return todoItem;
}

function scanResult(barcode: string): BarcodeScanResult {
    return { code: barcode, format: "ean8" };
}

describe("SelectTodoItemForProduct", () => {
    const selectTodoItemForProduct = ({
        todoItems,
        ...overridingProps
    }: OverridingProps) => (
        <SelectTodoItemForProduct
            todoItems={todoItems}
            onTodoItemSubmit={() => {}}
            barcodeScanResult={scanResult("12345678")}
            {...overridingProps}
        />
    );

    it("should have explanation text", () => {
        const wrapper = shallow(selectTodoItemForProduct({ todoItems: [] }));

        expect(wrapper.find(Typography).text()).toBe(
            "Select item from the list that you want to link scanned product to:"
        );
    });

    it("should have submit button", () => {
        const wrapper = shallow(selectTodoItemForProduct({ todoItems: [] }));

        expect(wrapper.find("[type='submit']").exists()).toBe(true);
    });

    it("should have button to create a new product", () => {
        const wrapper = shallow(selectTodoItemForProduct({ todoItems: [] }));

        expect(
            wrapper.find("[data-test-id='create-new-product-btn']").text()
        ).toBe("Add new product");
    });

    it("should display todo item", () => {
        const todoItem = mockTodoItem(1, "Milk");

        const wrapper = shallow(
            selectTodoItemForProduct({ todoItems: [todoItem] })
        );

        const milkOption = wrapper.find("option[value=1]");
        expect(milkOption.exists()).toBe(true);
        expect(milkOption.text()).toBe("Milk");
    });

    // ignored: couldn't figure out how to trigger todo item id change from
    // select (form is not submitted after clicking button)
    xit("should submit todo item", () => {
        type SubmitFunctionType = (todoItem: TodoItem) => void;
        const onTodoItemSubmit = td.func<SubmitFunctionType>();

        const todoItem = mockTodoItem(1, "Milk");

        const wrapper = mount(
            selectTodoItemForProduct({
                todoItems: [todoItem],
                onTodoItemSubmit,
            })
        );

        act(() => {
            wrapper.find(Select).simulate("change", { target: { value: 1 } });
        });

        act(() => {
            wrapper
                .find("[data-test-id='product-todo-item-submit-btn']")
                .last()
                .simulate("click");
        });

        td.verify(onTodoItemSubmit(todoItem));
    });
});
