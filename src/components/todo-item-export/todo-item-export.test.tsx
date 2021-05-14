import { shallow } from "enzyme";
import Category from "../../entity/category";
import { Store } from "../todo-item-list/types";
import ExportItem from "./export-item";
import TodoItemExport, { getExportResult } from "./todo-item-export";

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
        it("should group by category", () => {
            const milk = createExportItem("Milk", 3.44, groceriesCategory);
            const bread = createExportItem("Bread", 2.55, groceriesCategory);
            const pringles = createExportItem("Pringles", 3.55, snacksCategory);
            const exportItems = [milk, bread, pringles];

            const result = getExportResult(exportItems);

            expect(result).toEqual([{
                category: groceriesCategory.name,
                storeName: "undefined",
                exportItemsByStore: [milk, bread],
            }, {
                category: snacksCategory.name,
                storeName: "undefined",
                exportItemsByStore: [pringles],
            }]);
        });

        it("should group by store", () => {
            const milk = createExportItem("Milk", 3.44, undefined, auchanStore);
            const bread = createExportItem("Bread", 2.55, undefined, auchanStore);
            const pringles = createExportItem("Pringles", 3.55, undefined, zabkaStore);
            const exportItems = [milk, bread, pringles];

            const result = getExportResult(exportItems);

            expect(result).toEqual([{
                category: "undefined",
                storeName: auchanStore.name,
                exportItemsByStore: [milk, bread],
            }, {
                category: "undefined",
                storeName: zabkaStore.name,
                exportItemsByStore: [pringles],
            }]);
        });

        it("should group by category and store", () => {
            const milk = createExportItem("Milk", 3.44, groceriesCategory, auchanStore);
            const bread = createExportItem("Bread", 2.55, groceriesCategory, auchanStore);
            const lays = createExportItem("Lays", 2.55, snacksCategory, auchanStore);
            const pringles = createExportItem("Pringles", 3.55, snacksCategory, zabkaStore);
            const exportItems = [milk, bread, pringles, lays];

            const result = getExportResult(exportItems);

            expect(result).toHaveLength(3);

            expect(result).toContainEqual({
                category: groceriesCategory.name,
                storeName: auchanStore.name,
                exportItemsByStore: [milk, bread],
            });

            expect(result).toContainEqual({
                category: snacksCategory.name,
                storeName: auchanStore.name,
                exportItemsByStore: [lays],
            });

            expect(result).toContainEqual({
                category: snacksCategory.name,
                storeName: zabkaStore.name,
                exportItemsByStore: [pringles],
            });
        });
    });
});
