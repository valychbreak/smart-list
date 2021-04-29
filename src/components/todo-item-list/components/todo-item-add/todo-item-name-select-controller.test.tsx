import { act, renderHook } from "@testing-library/react-hooks";
import ProductApi from "../../../../api/ProductApi";
import { TodoItemNameItem } from "./todo-item-name-select";
import useTodoItemNameSelectController from "./todo-item-name-select-controller";

function createTodoItemNameItem(name: string): TodoItemNameItem {
    return { label: name, todoItemName: name };
}

describe("useTodoItemNameSelectController", () => {
    const controller = () => useTodoItemNameSelectController();

    beforeEach(() => {});

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
            { label: "Add Mil", todoItemName: "Mil" },
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
