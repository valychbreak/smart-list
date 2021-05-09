import { shallow } from "enzyme";
import td from "testdouble";
import Category from "../../entity/category";
import Product from "../../entity/Product";
import ExportItem from "./export-item";
import ExportItemView from "./export-item-view";

type OverridingProps = {
    exportItem: ExportItem;
};

function createExportItem(generalName: string) {
    return new ExportItem(1, generalName, 1, true, null, null, null, null);
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
        category || null,
        product
    );
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

            expect(wrapper.contains("Groceries")).toBe(true);
        });

        it("should display hiphen instead of category name when it's not set", () => {
            const exportItem = createTodoItemWithProduct(
                "Milk",
                "Special Milk"
            );

            const wrapper = shallow(exportItemView({ exportItem }));

            expect(wrapper.contains("-")).toBe(true);
        });
    });
});
