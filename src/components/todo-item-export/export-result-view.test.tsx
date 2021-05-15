import { TableBody } from "@material-ui/core";
import { shallow } from "enzyme";
import React from "react";
import ExportItem from "./export-item";
import ExportResultView from "./export-result-view";
import { ExportItemsGrouped } from "./todo-item-export";

function exportItemsGrouped(
    exportItems: ExportItem[],
    categoryName: string,
    storeName: string
): ExportItemsGrouped {
    return {
        categoryName,
        storeName,
        exportItems,
    };
}

function createExportItem(
    purchasedPrice: number
) {
    return new ExportItem(
        1,
        "Export Item",
        1,
        true,
        null,
        purchasedPrice || null,
        null,
        null,
        null
    );
}

type OverrideProps = {
    exportItemsGrouped?: ExportItemsGrouped[];
};

describe("ExportResultView", () => {
    const exportResultView = (props: OverrideProps = {}) => (
        <ExportResultView exportItemsGrouped={[]} {...props} />
    );

    describe("render", () => {
        it("should display category, store and price headers", () => {
            const wrapper = shallow(exportResultView());

            expect(wrapper.contains("Category")).toBe(true);
            expect(wrapper.contains("Store")).toBe(true);
            expect(wrapper.contains("Spent")).toBe(true);
        });

        it("should display category name, store name and price sum of all items", () => {
            const milk = createExportItem(2.49);
            const bread = createExportItem(2.51);

            const exportItemGroup = exportItemsGrouped([milk, bread], "Groceries", "Auchan");
            const wrapper = shallow(exportResultView({ exportItemsGrouped: [exportItemGroup] }));

            const tableBody = wrapper.find(TableBody);
            expect(tableBody.contains("Groceries")).toBe(true);
            expect(tableBody.contains("Auchan")).toBe(true);
            expect(tableBody.contains("5.00")).toBe(true);
        });
    });
});
