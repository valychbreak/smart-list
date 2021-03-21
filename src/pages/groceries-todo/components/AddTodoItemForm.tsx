import React, { useRef, useState } from "react";
import Product from "../../../entity/Product";
import AsyncCreatableSelect from "react-select/async-creatable";
import { ActionMeta, OptionsType } from "react-select";
import ProductApi from "../../../api/ProductApi";
import TodoItemListContext, { TodoItemListContextType } from "../context/TodoItemListContext";
import TodoItem from "./TodoItem";
import { RouteComponentProps, withRouter } from "react-router-dom";

type ProductSelectItem = {
    label: string,
    product: Product;
}

interface ProductSelectProps {
    onProductSelect(selectedProduct: Product | null): void;
    onProductCreateOptionSelect(inputValue: string): void;
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

    const onProductSelect = (selectedProduct: ProductSelectItem | OptionsType<ProductSelectItem> | null, action: ActionMeta<ProductSelectItem>) => {
        if (selectedProduct) {
            // workaround: couldn't find a way how to resolve union types in this case
            props.onProductSelect((selectedProduct as ProductSelectItem).product);
        } else {
            props.onProductSelect(null);
        }
    }

    const onProductOptionCreate = (inputValue: string) => {
        props.onProductCreateOptionSelect(inputValue);
    }

    return (
        <AsyncCreatableSelect loadOptions={onItemTagValueChange}
                              onChange={onProductSelect}
                              onCreateOption={onProductOptionCreate}
                              isMulti={false}
                              ref={ref}/>
    )
})

const AddTodoItemForm = (props: RouteComponentProps) => {

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
                // console.log(productSelectRef);
                productSelectRef.current.select.select.select.clearValue();
            }
        }
    }

    const onProductSelect = (selectedItem: Product | null) => {
        setSelectedProduct(selectedItem);
    }

    const onProductCreateOptionSelect = (inputValue: string) => {
        if (window.confirm(`No product matching '${inputValue}' was added. \nDo you want to go to product adding page?`)) {
            props.history.push('new-product');
        }
    }

    return (
        <TodoItemListContext.Consumer>
            {context => (
                <form onSubmit={(e) => handleSubmit(e, context)} className="MyForm">
                    <div>
                        <ProductSelect onProductSelect={onProductSelect}
                                       onProductCreateOptionSelect={onProductCreateOptionSelect} 
                                       ref={productSelectRef} />

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

export default withRouter(AddTodoItemForm);
