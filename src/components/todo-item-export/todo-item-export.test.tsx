import { shallow } from "enzyme";
import Category from "../../entity/category";
import { Store } from "../todo-item-list/types";
import ExportItem from "./export-item";
import TodoItemExport, { ExportItemsGrouped, getExportResult } from "./todo-item-export";

const groceriesCategory = { id: 0, name: "Groceries" };
const snacksCategory = { id: 1, name: "Snacks" };

const auchanStore = { id: 0, name: "Auchan" } as Store;
const zabkaStore = { id: 1, name: "Zabka" } as Store;

function createExportItem(
    generalName: string,
    purchasedPrice?: number,
    category?: Category,
    purchasedStore?: Store
) {
    return new ExportItem(
        1,
        generalName,
        1,
        true,
        null,
        purchasedPrice || null,
        purchasedStore || null,
        category || null,
        null
    );
}

describe("TodoItemExport", () => {
    const todoItemExport = () => <TodoItemExport />;

    it("should render", () => {
        const wrapper = shallow(todoItemExport());
        expect(wrapper).toMatchSnapshot();
    });

    describe("functions", () => {
        const exportItemsGrouped = (
            exportItems: ExportItem[],
            category?: Category,
            store?: Store
        ): ExportItemsGrouped => ({
            categoryName: category?.name || "undefined",
            storeName: store?.name || "undefined",
            exportItems,
        });

        it("should group by category", () => {
            const milk = createExportItem("Milk", 3.44, groceriesCategory);
            const bread = createExportItem("Bread", 2.55, groceriesCategory);
            const pringles = createExportItem("Pringles", 3.55, snacksCategory);
            const exportItems = [milk, bread, pringles];

            const result = getExportResult(exportItems);

            expect(result).toEqual([
                exportItemsGrouped([milk, bread], groceriesCategory),
                exportItemsGrouped([pringles], snacksCategory)
            ]);
        });

        it("should group by store", () => {
            const milk = createExportItem("Milk", 3.44, undefined, auchanStore);
            const bread = createExportItem("Bread", 2.55, undefined, auchanStore);
            const pringles = createExportItem("Pringles", 3.55, undefined, zabkaStore);
            const exportItems = [milk, bread, pringles];

            const result = getExportResult(exportItems);

            expect(result).toEqual([
                exportItemsGrouped([milk, bread], undefined, auchanStore),
                exportItemsGrouped([pringles], undefined, zabkaStore)
            ]);
        });

        it("should group by category and store", () => {
            const milk = createExportItem("Milk", 3.44, groceriesCategory, auchanStore);
            const bread = createExportItem("Bread", 2.55, groceriesCategory, auchanStore);
            const lays = createExportItem("Lays", 2.55, snacksCategory, auchanStore);
            const pringles = createExportItem("Pringles", 3.55, snacksCategory, zabkaStore);
            const exportItems = [milk, bread, pringles, lays];

            const result = getExportResult(exportItems);

            expect(result).toHaveLength(3);

            expect(result).toContainEqual(
                exportItemsGrouped([milk, bread], groceriesCategory, auchanStore)
            );

            expect(result).toContainEqual(
                exportItemsGrouped([lays], snacksCategory, auchanStore)
            );

            expect(result).toContainEqual(
                exportItemsGrouped([pringles], snacksCategory, zabkaStore)
            );
        });
    });
});
