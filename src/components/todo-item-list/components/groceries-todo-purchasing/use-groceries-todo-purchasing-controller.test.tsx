import { renderHook, RenderHookResult, WrapperComponent } from '@testing-library/react-hooks';
import React from 'react';
import TodoItemListContext, { TodoItemListContextType } from '../../../../pages/groceries-todo/context/TodoItemListContext';
import TodoItem from '../../types';
import useGroceriesTodoPurchasingController from './use-groceries-todo-purchasing-controller';
import { instance, mock, reset, verify, when } from 'ts-mockito'
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

    describe('onitemPurchaseToggle', () => {
        test('should set open price entry dialog to true when product was manually marked as purchased', async () => {
            // given
            const todoItem = createTodoItem('1234567', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            act(() => {
                result.current.onItemPurchaseToggle(todoItem, true);
            })

            // then
            expect(result.current.openPriceSubmission).toBeTruthy();
            expect(result.current.selectedItem).toBe(todoItem);
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

        test('should not match null barcode', () => {
            // given
            const todoItem = createTodoItem('87654321', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController([todoItem]);

            // when
            result.current.onBarcodeScanAdapter(createScanResult(null, 'ean8'));

            // then
            verify(todoItemListMockedContext.todoItems).never();
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
