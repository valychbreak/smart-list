import { act, renderHook } from "@testing-library/react-hooks";
import td from "testdouble";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";
import * as TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";
import useTodoItemAddController from "./todo-item-add-controller";

const mockProduct = (generalName: string): Product => {
    const product = td.object<Product>();
    product.productGeneralName = generalName;
    return product;
};

const scanResult = (barcode: string, barcodeType: string) => ({
    codeResult: { code: barcode, format: barcodeType },
});

const barcodeScanResult = scanResult("12345678", "ean8");

describe("useTodoItemAddController", () => {
    const controller = () => useTodoItemAddController();
    let todoItemListContext: TodoItemListContext.TodoItemListContextType;

    beforeEach(() => {
        todoItemListContext = td.object<TodoItemListContext.TodoItemListContextType>();

        jest.spyOn(
            TodoItemListContext,
            "useTodoItemListContext"
        ).mockImplementation(() => todoItemListContext);
    });

    it("should enable scanner", () => {
        const { result } = renderHook(() => controller());

        act(() => result.current.enableScanner());

        expect(result.current.openScanner).toBe(true);
    });

    it("should disable scanner", () => {
        const { result } = renderHook(() => controller());

        act(() => {
            result.current.enableScanner();
            result.current.disableScanner();
        });

        expect(result.current.openScanner).toBe(false);
    });

    it("should disable scanner after barcode scan", async () => {
        jest.spyOn(ProductApi, "findByBarcode").mockReturnValue(
            Promise.resolve(null)
        );

        const { result } = renderHook(() => controller());

        act(() => {
            result.current.enableScanner();
        });

        await act(async () => {
            result.current.onBarcodeDetected(barcodeScanResult);
        });

        expect(ProductApi.findByBarcode).toBeCalled();
        expect(result.current.openScanner).toBe(false);
    });

    it("should add todo item to context", async () => {
        const { result } = renderHook(() => controller());

        const todoItem = td.object<TodoItem>();
        act(() => {
            result.current.addTodoItem(todoItem);
        });

        td.verify(todoItemListContext.addItem(todoItem));
        expect(result.current.openScanner).toBe(false);
    });

    it("should add todo item to context after scanning a barcode", async () => {
        const product = mockProduct("Milk");

        jest.spyOn(ProductApi, "findByBarcode").mockReturnValue(
            Promise.resolve(product)
        );

        const { result } = renderHook(() => controller());

        act(() => {
            result.current.enableScanner();
        });

        await act(async () => {
            result.current.onBarcodeDetected(barcodeScanResult);
        });

        td.verify(
            todoItemListContext.addItem(
                td.matchers.contains({ targetProduct: product })
            )
        );
        expect(result.current.openScanner).toBe(false);
    });
});
