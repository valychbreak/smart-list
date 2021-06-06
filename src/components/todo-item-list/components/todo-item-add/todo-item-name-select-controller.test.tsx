import { act, renderHook } from "@testing-library/react-hooks";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";
import { TodoItemNameItem } from "./todo-item-name-select";
import useTodoItemNameSelectController from "./todo-item-name-select-controller";

function createTodoItemNameItem(label: string, product?: Product): TodoItemNameItem {
    return { label, todoItemName: label, product };
}

function createProduct(generalName: string, fullName: string): Product {
    const product = new Product(generalName, "1234567", "ean8");
    product.productFullName = fullName;
    return product;
}

describe("useTodoItemNameSelectController", () => {
    const controller = () => useTodoItemNameSelectController();

    beforeEach(() => {
        jest.spyOn(ProductApi, "findMatchingBy")
            .mockImplementation(() => Promise.resolve([]));
    });

    it("should set open", async () => {
        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setOpen(true);
        });

        expect(result.current.open).toBe(true);
    });

    it("should set input value", async () => {
        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Milk");
        });

        expect(result.current.inputValue).toBe("Milk");
    });

    it("should have loading as false by default", () => {
        const { result } = renderHook(controller);

        expect(result.current.loading).toBe(false);
    });

    it("should set loading to false after loading options", async () => {
        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Milk");
        });

        expect(result.current.loading).toBe(false);
    });

    it("should set loading to false when there's an error in API call", async () => {
        jest.spyOn(ProductApi, "findMatchingBy")
            .mockImplementation(() => Promise.reject(new Error()));

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Milk");
        });

        expect(result.current.loading).toBe(false);
    });

    it("should load options when input value changes", async () => {
        const milkProduct = createProduct("Milk", "Milk 2.0 super natural");
        const milkyProduct = createProduct("Milky", "Milky also natural");
        jest.spyOn(ProductApi, "findMatchingBy")
            .mockImplementation(() => Promise.resolve([
                milkProduct,
                milkyProduct
            ]));

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Mil");
        });

        expect(result.current.options).toEqual([
            createTodoItemNameItem("Milk 2.0 super natural", milkProduct),
            createTodoItemNameItem("Milky also natural", milkyProduct),
        ]);
    });

    it("should reset input value and options", async () => {
        jest.spyOn(ProductApi, "findMatchingBy")
            .mockImplementation(() => Promise.resolve([
                createProduct("Milk", "Milk 2.0")
            ]));

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Mil");
            result.current.setOpen(true);
            result.current.clear();
        });

        expect(result.current.inputValue).toEqual("");
        expect(result.current.open).toEqual(false);
        expect(result.current.options).toEqual([]);
    });

    it("should clear select field when input is cleared", async () => {
        jest.spyOn(ProductApi, "findMatchingBy")
            .mockImplementation(() => Promise.resolve([
                createProduct("Milk", "Milk 2.0")
            ]));

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Mil");
        });

        await act(async () => {
            result.current.setInputValue("");
        });

        expect(result.current.inputValue).toEqual("");
        expect(result.current.open).toEqual(false);
        expect(result.current.loading).toEqual(false);
        expect(result.current.options).toEqual([]);
    });
});
