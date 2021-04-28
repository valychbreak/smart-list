import { renderHook } from "@testing-library/react-hooks";
import { instance, mock, when } from "ts-mockito";
import Product from "../../../../entity/Product";
import * as Context from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";
import useTodoItemsTotalPriceController from "./use-todo-items-total-price-controller";

const todoItemListMockedContext = mock<Context.TodoItemListContextType>();

function createTodoItem(barcode: string, barcodeType: string): TodoItem {
    const todoItem = new TodoItem(1, "item");
    const mockedProduct = mock(Product);
    when(mockedProduct.productBarcode).thenReturn(barcode);
    when(mockedProduct.productBarcodeType).thenReturn(barcodeType);

    todoItem.targetProduct = instance(mockedProduct);
    return todoItem;
}

function renderTotalPriceController(todoItems: TodoItem[]) {
    when(todoItemListMockedContext.todoItems)
        .thenReturn(todoItems);

    jest.spyOn(Context, "useTodoItemListContext")
        .mockImplementation(() => instance(todoItemListMockedContext));
    return renderHook(() => useTodoItemsTotalPriceController());
}

describe("useTodoItemsTotalPriceController", () => {
    describe("totalPriceByCounterparty", () => {
        test("should calculate total price for items from Todo Items context", async () => {
            // given

            const todoItem = createTodoItem("1234567", "ean8");
            todoItem.priceData.setCounterpartyPrice("Biedronka", { price: 10.99 });

            const todoItem2 = createTodoItem("8765432", "ean8");
            todoItem2.priceData.setCounterpartyPrice("Biedronka", { price: 2.02 });

            const todoItemNoPrice = createTodoItem("88776655", "ean8");

            const { result } = renderTotalPriceController([todoItem, todoItem2, todoItemNoPrice]);

            // when
            const actualTotal = result.current.totalPriceByCounterparty("Biedronka");

            // then
            expect(actualTotal).toBe(13.01);
        });
    });
});
