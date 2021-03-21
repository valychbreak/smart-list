import React, { ElementRef, useRef, useState } from "react";
import Product from "../../../entity/Product";
import AsyncSelect, { Async } from "react-select/async";
import { OptionsType } from "react-select";
import ProductApi from "../../../api/ProductApi";
import TodoItemListContext, { TodoItemListContextType } from "../context/TodoItemListContext";
import TodoItem from "./TodoItem";

type ProductSelectItem = {
    label: string,
    product: Product;
}

interface ProductSelectProps {
    onProductSelect(selectedProduct: Product | null): void;
}

const ProductSelect = React.forwardRef<any, ProductSelectProps>((props: ProductSelectProps, ref: React.ForwardedRef<any>) => {

    const onItemTagValueChange = (value: string): Promise<OptionsType<ProductSelectItem>> => {
        return new Promise((resolve, reject) => {
            ProductApi.findMatchingBy(value)
                .then(products => {
                    let foundProducts: ProductSelectItem[] = products.map(product => { 
                        return {label: product.productFullName as string, product: product}
                    });

                    resolve (foundProducts);
                })
        });
    }

    const onProductSelect = (selectedProduct: ProductSelectItem | null) => {
        props.onProductSelect(selectedProduct == null ? null : selectedProduct.product);
    }
    return (
        <AsyncSelect loadOptions={onItemTagValueChange} 
                     onChange={onProductSelect} 
                     ref={ref}/>
    )
})

export const AddTodoItemForm = () => {

    const [selectedProduct, setSelectedProduct] = useState<Product | null>();
    const [newItemQuantity, setNewItemQuantity] = useState('1');

    const productSelectRef = useRef<any>();

    const handleQuantityFieldChange = (e: any) => {
        setNewItemQuantity(e.target.value)
    }

    const handleSubmit = (e: any, context: TodoItemListContextType) => {
        e.preventDefault();
        
        if (selectedProduct) {
            const newItem = new TodoItem(Date.now(), selectedProduct.productGeneralName);
            newItem.quantity = parseInt(newItemQuantity);
            newItem.targetProduct = selectedProduct;
            context.addItem(newItem);

            if (productSelectRef) {
                // workaround to reset value on adding item (element was found by debug)
                productSelectRef.current.select.select.clearValue();
            }
        }
    }

    const onTagItemChange = (selectedItem: Product | null) => {
        setSelectedProduct(selectedItem);
    }

    return (
        <TodoItemListContext.Consumer>
            {context => (
                <form onSubmit={(e) => handleSubmit(e, context)} className="MyForm">
                    <div>
                        <ProductSelect onProductSelect={onTagItemChange} ref={productSelectRef} />
                        <div className="quantity">
                            <input
                                id="quantity"
                                onChange={handleQuantityFieldChange}
                                value={newItemQuantity}
                            />
                        </div>
                        <div className="btn">
                            <button>
                                Add #{context.todoItems.length + 1}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </TodoItemListContext.Consumer>
    )
}
