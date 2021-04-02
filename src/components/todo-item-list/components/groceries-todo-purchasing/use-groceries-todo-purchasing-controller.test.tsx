import { renderHook, RenderHookResult, WrapperComponent } from '@testing-library/react-hooks';
import React from 'react';
import TodoItemListContext, { TodoItemListContextType } from '../../../../pages/groceries-todo/context/TodoItemListContext';
import TodoItem from '../../types';
import useGroceriesTodoPurchasingController from './use-groceries-todo-purchasing-controller';
import { anyOfClass, instance, mock, reset, verify, when } from 'ts-mockito'
import Product from '../../../../entity/Product';
import { BarcodeScanResult } from '../../../barcode-scanner/types';
import { act } from 'react-dom/test-utils';
import ProductApi from '../../../../api/ProductApi';
import { mocked } from 'ts-jest/utils'
import { waitFor } from '@testing-library/react';


jest.mock('../../../../api/ProductApi');
const ProductApiMocked = mocked(ProductApi, true);


const todoItemListMockedContext = mock<TodoItemListContextType>();

describe('useGroceriesTodoPurchasingController', () => {

    beforeEach(() => {
        ProductApiMocked.findByBarcode.mockReset();
        reset(todoItemListMockedContext);
    });

    describe('toggleTodoItemPurchaseStatus', () => {
        test('should set open price entry dialog to true when product was manually marked as purchased', async () => {
            // given
            const todoItem = createTodoItem('1234567', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.toggleTodoItemPurchaseStatus(todoItem, true);
            })

            // then
            verify(todoItemListMockedContext.toggleItemPurchased(todoItem, true)).once();
            expect(result.current.openPriceSubmission).toBeTruthy();
            expect(result.current.selectedItem).toBe(todoItem);
        });

        test('should call todo item context when product was manually marked as not purchased', async () => {
            // given
            const todoItem = createTodoItem('1234567', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.toggleTodoItemPurchaseStatus(todoItem, false);
            })

            // then
            verify(todoItemListMockedContext.toggleItemPurchased(todoItem, false)).once();
        });
    });

    describe('addPurchasedProduct', () => {
        test('should add product to todo items and open price submission dialog', async () => {
            // given
            const product = createProduct("Milk");
            const { result } = renderGroceriesTodoPurchasingController([]);

            // when
            act(() => {
                result.current.addPurchasedProduct(product);
            })

            // then
            verify(todoItemListMockedContext.addItem(anyOfClass(TodoItem))).once();
            expect(result.current.openPriceSubmission).toBeTruthy();
            expect(result.current.selectedItem?.targetProduct).toBe(product);
        });
    });

    describe('onBarcodeScan', () => {
        test('should mark matching item by barcode as purchased', () => {
            // given
            const todoItem = createTodoItem('12345678', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.onBarcodeScanAdapter(createScanResult('12345678', 'ean8'));
            })

            // then
            expect(result.current.openPriceSubmission).toBe(true);
            expect(result.current.selectedItem).toBe(todoItem);
            verify(todoItemListMockedContext.toggleItemPurchased(todoItem, true)).once();
        });

        test('should set open new product dialog to true when product does not exist in the list and db', async () => {
            // given
            ProductApiMocked.findByBarcode.mockResolvedValue(null);
            
            const { result } = renderGroceriesTodoPurchasingController([]);
            const scannedResult = createScanResult('12345678', 'ean8');

            // when
            act(() => {
                result.current.onBarcodeScanAdapter(scannedResult);
            })

            // then
            await act(() => waitFor(() => {
                expect(result.current.openAddNewProductForm).toBeTruthy();
                expect(result.current.scannedProductResult).toBe(scannedResult);
            }))
        });

        test('should set open add item confirmation dialog to true when product does not exist in the list but was found in DB', async () => {
            // given
            const product = createAnyProduct();
            ProductApiMocked.findByBarcode.mockResolvedValue(product);
            
            const { result } = renderGroceriesTodoPurchasingController([]);
            const scannedResult = createScanResult('12345678', 'ean8');

            // when
            act(() => {
                result.current.onBarcodeScanAdapter(scannedResult);
            })

            // then
            await act(() => waitFor(() => {
                expect(result.current.openAddProductConfirmation).toBeTruthy();
                expect(result.current.productToAdd).toBe(product);
            }))
        });

        test('should not match null barcode', () => {
            // given
            const todoItem = createTodoItem('87654321', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            result.current.onBarcodeScanAdapter(createScanResult(null, 'ean8'));

            // then
            verify(todoItemListMockedContext.todoItems).never();
        });

        test.each`
            todoItemBarcode | scannedBarcode | productInDb | description
            ${"12345678"}   | ${"12345678"}  | ${true}     | ${"When barcodes match"}
            ${"12345678"}   | ${"87654321"}  | ${true}     | ${"When barcodes don't match and product is in DB"}
            ${"12345678"}   | ${"87654321"}  | ${true}     | ${"When barcodes don't match and product is not in DB"}
        `('should disable scanner $description', async ({todoItemBarcode, scannedBarcode, productInDb, description}) => {
            // given
            ProductApiMocked.findByBarcode.mockResolvedValue(productInDb? createAnyProduct() : null);

            const todoItem = createTodoItem(todoItemBarcode, 'ean8');
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.enableScanner();
                result.current.onBarcodeScanAdapter(createScanResult(scannedBarcode, 'ean8'));
            })

            // then
            await act(() => waitFor(() => {
                expect(result.current.openScanner).toBeFalsy();
            }));
            
        });

        test('should not disable scanner when barcode is null', () => {
            // given
            const { result } = renderGroceriesTodoPurchasingController([]);

            // when
            act(() => {
                result.current.enableScanner();
                result.current.onBarcodeScanAdapter(createScanResult(null, 'ean8'));
            })

            // then
            expect(result.current.openScanner).toBeTruthy();
            
        });
    })
});


const todoItemListContextProvider: WrapperComponent<{ todoItems: TodoItem[] }> = ({ ...props }) => {

    when(todoItemListMockedContext.todoItems).thenReturn(props.todoItems);

    return (
        <TodoItemListContext.Provider value={instance(todoItemListMockedContext)}>
            {props.children}
        </TodoItemListContext.Provider>
    )
}

function createAnyProduct() {
    return createProduct("some good name");
}

function createProduct(generalName: string) {
    const mockedProduct = mock(Product);
    when(mockedProduct.productGeneralName).thenReturn(generalName);
    when(mockedProduct.productFullName).thenReturn(generalName + " full name");
    return instance(mockedProduct);
}

function createScanResult(barcode: string | null, barcodeType: string): BarcodeScanResult {
    return { code: barcode, format: barcodeType };
}

function renderGroceriesTodoPurchasingController(todoItems: TodoItem[]) {
    return renderHook(() => useGroceriesTodoPurchasingController(), {
        wrapper: todoItemListContextProvider,
        initialProps: {
            todoItems: todoItems
        }
    });
}

function createTodoItem(barcode: string, barcodeType: string): TodoItem {
    const todoItem = new TodoItem(1, 'item');
    const mockedProduct = mock(Product);
    when(mockedProduct.productBarcode).thenReturn(barcode);
    when(mockedProduct.productBarcodeType).thenReturn(barcodeType);

    todoItem.targetProduct = instance(mockedProduct);
    return todoItem;
}

