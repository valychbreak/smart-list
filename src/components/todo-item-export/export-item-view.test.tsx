import { shallow } from "enzyme";
import td from "testdouble";
import Category from "../../entity/category";
import Product from "../../entity/Product";
import TodoItem from "../todo-item-list/types";
import ExportItemView from "./export-item-view";

type OverridingProps = {
    todoItem: TodoItem;
};

function createTodoItem(generalName: string) {
    return TodoItem.createTodoItem(Date.now(), generalName);
}

function createTodoItemWithProduct(
    generalName: string,
    fullName?: string,
    category?: Category
) {
    const product = td.object<Product>();
    product.category = category || null;
    product.productFullName = fullName || null;

    const todoItem = TodoItem.createTodoItem(Date.now(), generalName);
    return todoItem.setTargetProduct(product);
}

describe("ExportItemView", () => {
    const exportItemView = ({ ...overridingProps }: OverridingProps) => (
        <ExportItemView {...overridingProps} />
    );

    const groceriesCategory = {
        id: 1,
        name: "Groceries",
    };

    describe("render", () => {
        it("should display todo item general name without a product", () => {
            const todoItem = createTodoItem("Milk");

            const wrapper = shallow(exportItemView({ todoItem }));

            expect(wrapper.contains("Milk")).toBe(true);
        });

        it("should display product full name when item is linked to product", () => {
            const todoItem = createTodoItemWithProduct(
                "Milk",
                "Milk from Special Company"
            );

            const wrapper = shallow(exportItemView({ todoItem }));

            expect(wrapper.contains("Milk from Special Company")).toBe(true);
        });

        it("should display general name when product doesn't have full name", () => {
            const todoItem = createTodoItemWithProduct("Milk");

            const wrapper = shallow(exportItemView({ todoItem }));

            expect(wrapper.contains("Milk")).toBe(true);
        });

        it("should display category name", () => {
            const todoItem = createTodoItemWithProduct(
                "Milk",
                "Special Milk",
                groceriesCategory
            );

            const wrapper = shallow(exportItemView({ todoItem }));

            expect(wrapper.contains("Groceries")).toBe(true);
        });

        it("should display hiphen instead of category name when it's not set", () => {
            const todoItem = createTodoItemWithProduct(
                "Milk",
                "Special Milk"
            );

            const wrapper = shallow(exportItemView({ todoItem }));

            expect(wrapper.contains("-")).toBe(true);
        });
    });
});
