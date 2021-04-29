import { act, renderHook } from "@testing-library/react-hooks";
import ProductApi from "../../../../api/ProductApi";
import { TodoItemNameItem } from "./todo-item-name-select";
import useTodoItemNameSelectController from "./todo-item-name-select-controller";

function createTodoItemNameItem(name: string): TodoItemNameItem {
    return { label: name, todoItemName: name };
}

describe("useTodoItemNameSelectController", () => {
    const controller = () => useTodoItemNameSelectController();

    beforeEach(() => {
        jest.spyOn(ProductApi, "findGeneralNamesBy")
            .mockImplementation(() => Promise.resolve([]));
    });

    it("should set open", () => {
        const { result } = renderHook(controller);

        act(() => {
            result.current.setOpen(true);
        });

        expect(result.current.open).toBe(true);
    });

    it("should set input value", () => {
        const { result } = renderHook(controller);

        act(() => {
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
        jest.spyOn(ProductApi, "findGeneralNamesBy")
            .mockImplementation(() => Promise.reject(new Error()));

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Milk");
        });

        expect(result.current.loading).toBe(false);
    });

    it("should load options when input value changes", async () => {
        jest.spyOn(ProductApi, "findGeneralNamesBy")
            .mockImplementation(() => Promise.resolve(["Milk", "Milky"]));

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Mil");
        });

        expect(result.current.options).toEqual([
            createTodoItemNameItem("Milk"),
            createTodoItemNameItem("Milky"),
        ]);
    });

    it("should reset input value and options", async () => {
        jest.spyOn(ProductApi, "findGeneralNamesBy")
            .mockImplementation(() => Promise.resolve(["Milk"]));

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
});
