import { act, renderHook } from "@testing-library/react-hooks";
import td from "testdouble";
import openFoodFactsService from "../../../../api/open-food-facts-api/open-food-facts.service";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";
import * as TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import TodoItem from "../../types";
import useTodoItemAddController from "./todo-item-add-controller";

const mockProduct = (generalName: string): Product => {
    const product = td.object<Product>();
    product.productGeneralName = generalName;
    return product;
};

const scanResult = (barcode: string, barcodeType: string): BarcodeScanResult => (
    { code: barcode, format: barcodeType }
);

const barcodeScanResult = scanResult("12345678", "ean8");

describe("useTodoItemAddController", () => {
    const controller = () => useTodoItemAddController();
    const renderController = () => (
        renderHook(() => controller())
    );

    let todoItemListContext: TodoItemListContext.TodoItemListContextType;

    beforeEach(() => {
        todoItemListContext = td.object<TodoItemListContext.TodoItemListContextType>();

        jest.spyOn(
            TodoItemListContext,
            "useTodoItemListContext"
        ).mockImplementation(() => todoItemListContext);

        jest.spyOn(openFoodFactsService, "fetchProduct").mockReturnValue(
            Promise.resolve(null)
        );
    });

    it("should add todo item to context", async () => {
        const { result } = renderController();

        const todoItem = td.object<TodoItem>();
        act(() => {
            result.current.addTodoItem(todoItem);
        });

        td.verify(todoItemListContext.addItem(todoItem));
    });

    describe("onBarcodeDetected", () => {
        beforeEach(() => {
            jest.spyOn(openFoodFactsService, "fetchProduct").mockReturnValue(
                Promise.resolve(null)
            );
        });

        it("should call ProductAPI", async () => {
            jest.spyOn(ProductApi, "findByBarcode").mockReturnValue(
                Promise.resolve(null)
            );

            const { result } = renderController();

            await act(async () => {
                result.current.onBarcodeDetected(barcodeScanResult);
            });

            expect(ProductApi.findByBarcode).toBeCalled();
        });

        it("should add todo item to context", async () => {
            const product = mockProduct("Milk");

            jest.spyOn(ProductApi, "findByBarcode").mockReturnValue(
                Promise.resolve(product)
            );

            const { result } = renderController();

            await act(async () => {
                result.current.onBarcodeDetected(barcodeScanResult);
            });

            const { productConfirmationDialog } = result.current;
            expect(productConfirmationDialog.isOpened).toBe(true);
            expect(productConfirmationDialog.payload?.product).toBe(product);
        });

        it("should open new product dialog when product not found", async () => {
            jest.spyOn(ProductApi, "findByBarcode").mockReturnValue(
                Promise.resolve(null)
            );

            const { result } = renderController();

            await act(async () => {
                result.current.onBarcodeDetected(barcodeScanResult);
            });

            expect(result.current.newProductDialog.isOpened).toBe(true);
        });

        it("should open new product dialog and load data from OpenFoodFacts when product not found", async () => {
            jest.spyOn(ProductApi, "findByBarcode").mockReturnValue(
                Promise.resolve(null)
            );

            jest.spyOn(openFoodFactsService, "fetchProduct").mockReturnValue(
                Promise.resolve({
                    name: "Milk",
                    barcode: barcodeScanResult.code,
                    company: "Milky way",
                    imageUrl: "https://image-url.com"
                })
            );

            const { result } = renderController();

            await act(async () => {
                result.current.onBarcodeDetected(barcodeScanResult);
            });

            const { newProductDialog } = result.current;

            expect(newProductDialog.isOpened).toBe(true);
            expect(newProductDialog.payload?.defaultProductFields).toStrictEqual({
                productBarcode: barcodeScanResult.code,
                productBarcodeType: barcodeScanResult.format,
                productCompanyName: "Milky way",
                productCountry: "",
                productFullName: "Milk",
                productGeneralName: "Milk",
                image: "https://image-url.com"
            });
        });
    });
});
