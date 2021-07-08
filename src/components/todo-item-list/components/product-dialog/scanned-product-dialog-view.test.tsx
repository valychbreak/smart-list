import { mount } from "enzyme";
import Product from "../../../../entity/Product";
import ScannedProductDialogView from "./scanned-product-dialog-view";

const milkProduct = new Product("Milk", "12345678", "ean8");
milkProduct.productFullName = "Milk 2.0 Natural";
milkProduct.productCompanyName = "Milky way company";
milkProduct.productCountry = "Ukraine";

describe("ScannedProductDialogView", () => {
    const scannedProductDialogView = (product: Product) => (
        <ScannedProductDialogView product={product} />
    );
    describe("render", () => {
        it("should display full product name", () => {
            const wrapper = mount(scannedProductDialogView(milkProduct));

            expect(wrapper.contains("Milk 2.0 Natural")).toBe(true);
        });

        it("should display general product name when full name is not set", () => {
            const product = new Product("Bread", "12345678", "ean8");
            const wrapper = mount(scannedProductDialogView(product));

            expect(wrapper.contains("Bread")).toBe(true);
        });

        it("should display barcode", () => {
            const wrapper = mount(scannedProductDialogView(milkProduct));

            expect(wrapper.contains("12345678 (ean8)")).toBe(true);
        });

        it("should display company name", () => {
            const wrapper = mount(scannedProductDialogView(milkProduct));

            expect(wrapper.contains("Milky way company")).toBe(true);
        });

        it("should display country name", () => {
            const wrapper = mount(scannedProductDialogView(milkProduct));

            expect(wrapper.contains("Ukraine")).toBe(true);
        });
    });
});
