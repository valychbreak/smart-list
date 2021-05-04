/* eslint-disable @typescript-eslint/no-use-before-define */
import { renderHook, WrapperComponent, act } from "@testing-library/react-hooks";
import {
    instance, mock, when,
} from "ts-mockito";
import { mocked } from "ts-jest/utils";
import td from "testdouble";
import { waitFor } from "@testing-library/react";
import TodoItemListContext, { TodoItemListContextType } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";
import useGroceriesTodoPurchasingController from "./use-groceries-todo-purchasing-controller";
import Product from "../../../../entity/Product";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import ProductApi from "../../../../api/ProductApi";

jest.mock("../../../../api/ProductApi");
const ProductApiMocked = mocked(ProductApi, true);

describe("useGroceriesTodoPurchasingController", () => {
    const todoItemListMockedContext = td.object<TodoItemListContextType>();

    const todoItemListContextProvider: WrapperComponent<{ todoItems: TodoItem[] }> = (
        { ...props }
    ) => {
        todoItemListMockedContext.todoItems = props.todoItems;

        return (
            <TodoItemListContext.Provider value={todoItemListMockedContext}>
                {props.children}
            </TodoItemListContext.Provider>
        );
    };

    function renderGroceriesTodoPurchasingController(todoItems: TodoItem[]) {
        return renderHook(() => useGroceriesTodoPurchasingController(), {
            wrapper: todoItemListContextProvider,
            initialProps: {
                todoItems,
            },
        });
    }

    beforeEach(() => {
        ProductApiMocked.findByBarcode.mockReset();
        ProductApiMocked.findByBarcode.mockResolvedValue(null);
        td.reset();
    });

    describe("toggleTodoItemPurchaseStatus", () => {
        test("should set open price entry dialog to true when product was manually marked as purchased", async () => {
            // given
            const todoItem = createTodoItem("1234567", "ean8");
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.toggleTodoItemPurchaseStatus(todoItem, true);
            });

            // then
            td.verify(todoItemListMockedContext.toggleItemPurchased(todoItem, true));
            expect(result.current.openPriceSubmission).toBeTruthy();
            expect(result.current.selectedItem).toBe(todoItem);
        });

        test("should call todo item context when product was manually marked as not purchased", async () => {
            // given
            const todoItem = createTodoItem("1234567", "ean8");
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.toggleTodoItemPurchaseStatus(todoItem, false);
            });

            // then
            td.verify(todoItemListMockedContext.toggleItemPurchased(todoItem, false));
        });
    });

    describe("addPurchasedProduct", () => {
        test("should add product to todo items and open price submission dialog", async () => {
            // given
            const product = createProduct("Milk");
            const { result } = renderGroceriesTodoPurchasingController([]);

            // when
            act(() => {
                result.current.addPurchasedProduct(product);
            });

            // then
            td.verify(
                todoItemListMockedContext.addItem(td.matchers.contains({ targetProduct: product }))
            );
            expect(result.current.openPriceSubmission).toBeTruthy();
            expect(result.current.selectedItem?.targetProduct).toBe(product);
        });
    });

    describe("toggleTodoItemPurchaseStatusWithScannedResult", () => {
        test("should mark todo item as purchased and link to scanned product", async () => {
            // given
            const { result } = renderGroceriesTodoPurchasingController([]);
            const scanResult = createScanResult("12345678");
            const todoItem = createTodoItem("1234567", "ean8");

            ProductApiMocked.saveProduct
                .mockImplementation((product: Product) => Promise.resolve(product));

            // when
            await act(async () => {
                result.current.onBarcodeScan(scanResult);
            });

            await act(async () => {
                result.current.toggleTodoItemPurchaseStatusWithScannedResult(todoItem);
            });

            const todoItemMatcher = td.matchers.argThat((actualTodoItem: TodoItem) => {
                const product = actualTodoItem.targetProduct;
                return actualTodoItem.id === todoItem.id
                    && product
                    && product.productGeneralName === todoItem.generalName
                    && product.productBarcode === scanResult.code
                    && product.productBarcodeType === scanResult.format;
            });

            // then
            td.verify(
                todoItemListMockedContext.updateItem(todoItemMatcher)
            );
            expect(result.current.openAddNewProductForm).toBe(false);
        });
    });

    describe("onBarcodeScan", () => {
        test("should mark matching item by barcode as purchased", () => {
            // given
            const todoItem = createTodoItem("12345678", "ean8");
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.onBarcodeScan(createScanResult("12345678", "ean8"));
            });

            // then
            expect(result.current.openPriceSubmission).toBe(true);
            expect(result.current.selectedItem).toBe(todoItem);
            td.verify(todoItemListMockedContext.toggleItemPurchased(todoItem, true));
        });

        test("should set open new product dialog to true when product does not exist in the list and db", async () => {
            // given
            ProductApiMocked.findByBarcode.mockResolvedValue(null);

            const { result } = renderGroceriesTodoPurchasingController([]);
            const scannedResult = createScanResult("12345678", "ean8");

            // when
            act(() => {
                result.current.onBarcodeScan(scannedResult);
            });

            // then
            await act(() => waitFor(() => {
                expect(result.current.openAddNewProductForm).toBeTruthy();
                expect(result.current.scannedProductResult).toBe(scannedResult);
            }));
        });

        test("should set open add item confirmation dialog to true when product does not exist in the list but was found in DB", async () => {
            // given
            const product = createAnyProduct();
            ProductApiMocked.findByBarcode.mockResolvedValue(product);

            const { result } = renderGroceriesTodoPurchasingController([]);
            const scannedResult = createScanResult("12345678", "ean8");

            // when
            act(() => {
                result.current.onBarcodeScan(scannedResult);
            });

            // then
            await act(() => waitFor(() => {
                expect(result.current.openAddProductConfirmation).toBeTruthy();
                expect(result.current.productToAdd).toBe(product);
            }));
        });

        test.each`
            todoItemBarcode | scannedBarcode | productInDb | description
            ${"12345678"}   | ${"12345678"}  | ${true}     | ${"When barcodes match"}
            ${"12345678"}   | ${"87654321"}  | ${true}     | ${"When barcodes don't match and product is in DB"}
            ${"12345678"}   | ${"87654321"}  | ${true}     | ${"When barcodes don't match and product is not in DB"}
        `("should disable scanner $description", async ({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            todoItemBarcode, scannedBarcode, productInDb, description,
        }) => {
            // given
            ProductApiMocked.findByBarcode
                .mockResolvedValue(productInDb ? createAnyProduct() : null);

            const todoItem = createTodoItem(todoItemBarcode, "ean8");
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.enableScanner();
                result.current.onBarcodeScan(createScanResult(scannedBarcode, "ean8"));
            });

            // then
            await act(() => waitFor(() => {
                expect(result.current.openScanner).toBeFalsy();
            }));
        });
    });
});

function createAnyProduct() {
    return createProduct("some good name");
}

function createProduct(generalName: string) {
    const mockedProduct = mock(Product);
    when(mockedProduct.productGeneralName).thenReturn(generalName);
    when(mockedProduct.productFullName).thenReturn(`${generalName} full name`);
    return instance(mockedProduct);
}

function createScanResult(barcode: string, barcodeType: string = "ean8"): BarcodeScanResult {
    return { code: barcode, format: barcodeType };
}

function createTodoItem(barcode: string, barcodeType: string): TodoItem {
    const todoItem = TodoItem.createTodoItem(1, "item");
    const mockedProduct = mock(Product);
    when(mockedProduct.productBarcode).thenReturn(barcode);
    when(mockedProduct.productBarcodeType).thenReturn(barcodeType);

    todoItem.targetProduct = instance(mockedProduct);
    return todoItem;
}
