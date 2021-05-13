import { shallow } from "enzyme";
import td from "testdouble";
import Category from "../../entity/category";
import Product from "../../entity/Product";
import { Store } from "../todo-item-list/types";
import ExportItem from "./export-item";
import ExportItemView from "./export-item-view";

type OverridingProps = {
    exportItem: ExportItem;
    onEdit?: (exportItem: ExportItem) => void;
};

function createExportItem(generalName: string, purchasedPrice?: number, purchasedStore?: Store) {
    return new ExportItem(
        1,
        generalName,
        1,
        true,
        null,
        purchasedPrice || null,
        purchasedStore || null,
        null,
        null
    );
}

function createTodoItemWithProduct(
    generalName: string,
    fullName?: string,
    category?: Category
) {
    const product = td.object<Product>();
    product.productFullName = fullName || null;

    return new ExportItem(
        1,
        generalName,
        1,
        true,
        null,
        null,
        null,
        category || null,
        product
    );
}

describe("ExportItemView", () => {
    const exportItemView = ({ ...overridingProps }: OverridingProps) => (
        <ExportItemView onEdit={() => {}} {...overridingProps} />
    );

    const groceriesCategory = {
        id: 1,
        name: "Groceries",
    };

    describe("render", () => {
        it("should display todo item general name without a product", () => {
            const exportItem = createExportItem("Milk");

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(wrapper.contains("Milk")).toBe(true);
        });

        it("should display product full name when item is linked to product", () => {
            const exportItem = createTodoItemWithProduct(
                "Milk",
                "Milk from Special Company"
            );

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(wrapper.contains("Milk from Special Company")).toBe(true);
        });

        it("should display general name when product doesn't have full name", () => {
            const exportItem = createTodoItemWithProduct("Milk");

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(wrapper.contains("Milk")).toBe(true);
        });

        it("should display category name", () => {
            const exportItem = createTodoItemWithProduct(
                "Milk",
                "Special Milk",
                groceriesCategory
            );

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(
                wrapper
                    .find("[data-test-id='export-item-category']")
                    .contains("Groceries")
            ).toBe(true);
        });

        it("should display hiphen instead of category name when it's not set", () => {
            const exportItem = createTodoItemWithProduct(
                "Milk",
                "Special Milk"
            );

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(
                wrapper
                    .find("[data-test-id='export-item-category']")
                    .contains("-")
            ).toBe(true);
        });

        it("should display purchased price", () => {
            const exportItem = createExportItem("Milk", 3.99);

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(wrapper.contains(3.99)).toBe(true);
        });

        it("should display store where item was purchased", () => {
            const exportItem = createExportItem("Milk", 3.0, {
                id: 1,
                name: "Biedronka",
            });

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(
                wrapper
                    .find("[data-test-id='export-item-store-name']")
                    .contains("Biedronka")
            ).toBe(true);
        });

        it("should display hiphen instead of store name when store is not set", () => {
            const exportItem = createExportItem("Milk");

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(
                wrapper
                    .find("[data-test-id='export-item-store-name']")
                    .contains("-")
            ).toBe(true);
        });
    });

    describe("behaviour", () => {
        type OnEditType = (exportItem: ExportItem) => void;
        const onEdit = td.func<OnEditType>();
        const exportItem = createExportItem("Milk");

        const wrapper = shallow(exportItemView({ exportItem, onEdit }));
        wrapper.find("[data-test-id='export-item-edit-btn']").simulate("click");

        td.verify(onEdit(exportItem));
    });
});
