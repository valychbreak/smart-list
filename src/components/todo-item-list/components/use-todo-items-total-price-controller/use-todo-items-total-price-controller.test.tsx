import { act, renderHook, WrapperComponent } from "@testing-library/react-hooks";
import { instance, mock, when } from "ts-mockito";
import Product from "../../../../entity/Product";
import TodoItemListContext, { TodoItemListContextType } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";
import useTodoItemsTotalPriceController from "./use-todo-items-total-price-controller";

const todoItemListMockedContext = mock<TodoItemListContextType>();

function createTodoItem(barcode: string, barcodeType: string): TodoItem {
    const todoItem = new TodoItem(1, "item");
    const mockedProduct = mock(Product);
    when(mockedProduct.productBarcode).thenReturn(barcode);
    when(mockedProduct.productBarcodeType).thenReturn(barcodeType);

    todoItem.targetProduct = instance(mockedProduct);
    return todoItem;
}

const todoItemListContextProvider: WrapperComponent<{ todoItems: TodoItem[] }> = ({ ...props }) => {
    when(todoItemListMockedContext.todoItems).thenReturn(props.todoItems);

    return (
        <TodoItemListContext.Provider value={instance(todoItemListMockedContext)}>
            {props.children}
        </TodoItemListContext.Provider>
    );
};

function renderTotalPriceController(todoItems: TodoItem[]) {
    return renderHook(() => useTodoItemsTotalPriceController(), {
        wrapper: todoItemListContextProvider,
        initialProps: {
            todoItems,
        },
    });
}

describe("useTodoItemsTotalPriceController", () => {
    describe("totalPriceByCounterparty", () => {
        test("should set open price entry dialog to true when product was manually marked as purchased", async () => {
            // given
            const todoItem = createTodoItem("1234567", "ean8");
            todoItem.priceData.setCounterpartyPrice("Biedronka", { price: 10.99 });

            const todoItem2 = createTodoItem("1234567", "ean8");
            const { result } = renderTotalPriceController([todoItem, todoItem2]);

            // when
            act(() => {

            });

            const actualTotal = result.current.totalPriceByCounterparty("Biedronka");

            // then
            expect(actualTotal).toBe(10.99);
        });
    });
});
