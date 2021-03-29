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

jest.mock('../../../../api/ProductApi', () => {
    return { findByBarcode: jest.fn().mockResolvedValue(null) }
});

const ProductApiMocked = mocked(ProductApi, true);

const mockedContext = mock<TodoItemListContextType>();

describe('useGroceriesTodoPurchasingController', () => {

    beforeEach(() => {
        reset(mockedContext);
    });

    describe('onBarcodeScan', () => {
        test('should mark matching item by barcode as purchased', () => {
            // given
            const todoItem = createTodoItem('12345678', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController(todoItem);

            // when
            act(() => {
                result.current.onBarcodeScanAdapter(createScanResult('12345678', 'ean8'));
            })
            
            // then
            expect(result.current.openPriceSubmission).toBe(true);
            verify(mockedContext.toggleItemPurchased(todoItem, true)).once();
        });
        
        test('should not mark item as purchased when barcode is different', () => {
            // given
            const todoItem = createTodoItem('87654321', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController(todoItem);

            // when
            result.current.onBarcodeScanAdapter(createScanResult('12345678', 'ean8'));

            // then
            verify(mockedContext.toggleItemPurchased(todoItem, false)).never();
        });
        
        test('should not match null barcode', () => {
            // given
            const todoItem = createTodoItem('87654321', 'ean8');
            const { result } = renderGroceriesTodoPurchasingController(todoItem);

            // when
            result.current.onBarcodeScanAdapter(createScanResult(null, 'ean8'));

            // then
            verify(mockedContext.todoItems).never();
        });
    })
});


const todoItemListContextProvider: WrapperComponent<{todoItems: TodoItem[]}> = ({...props}) => {
    
    when(mockedContext.todoItems).thenReturn(props.todoItems);

    return (
        <TodoItemListContext.Provider value={instance(mockedContext)}>
            {props.children}
        </TodoItemListContext.Provider>
    )
}

function createScanResult(barcode: string | null, barcodeType: string): BarcodeScanResult {
    return { code: barcode, format: barcodeType };
}

function renderGroceriesTodoPurchasingController(todoItem: TodoItem) {
    return renderHook(() => useGroceriesTodoPurchasingController(), {
        wrapper: todoItemListContextProvider,
        initialProps: {
            todoItems: [todoItem]
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

