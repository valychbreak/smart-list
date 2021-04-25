import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Product from "../entity/Product";
import ProductPriceEntry from "../entity/ProductPriceEntry";
import { ProductSelect } from "../pages/groceries-todo/components/AddTodoItemForm";
import { Store } from "./todo-item-list/types";

interface ProductPriceFormFields {
    price: number;
    counterparty: string;
    selectedProduct: Product;
}

interface ProductPriceFormProps {
    targetProduct: Product | undefined;
    defaultStore?: Store | null;
    onEntrySubmit(productPriceEntry: ProductPriceEntry): void;
}

const ProductPriceForm = (props: ProductPriceFormProps) => {
    const { register, handleSubmit, control } = useForm<ProductPriceFormFields>();
    const [productSearchInput, setProductSearchInput] = useState("");

    const history = useHistory();
    const defaultStoreName = props.defaultStore?.name;

    const submitPriceEntry = (formData: ProductPriceFormFields) => {
        if (props.targetProduct) {
            const priceEntry = new ProductPriceEntry(
                formData.selectedProduct.productBarcode,
                formData.price,
                formData.counterparty,
                new Date(),
            );
            props.onEntrySubmit(priceEntry);
        }
    };

    const onProductCreateOptionSelect = (inputValue: string) => {
        // eslint-disable-next-line no-alert
        if (window.confirm(`No product matching '${inputValue}' was added. \nDo you want to go to product adding page?`)) {
            history.push("new-product");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(submitPriceEntry)}>
                <label>Price:</label>

                <Controller
                    name="selectedProduct"
                    control={control}
                    rules={{ required: true }}
                    render={({ onChange }) => (
                        <ProductSelect
                            inputValue={productSearchInput}
                            defaultProduct={props.targetProduct}
                            setInputValue={setProductSearchInput}
                            onProductSelect={(selectedProduct) => onChange(selectedProduct)}
                            onProductCreateOptionSelect={onProductCreateOptionSelect} />
                    )}
                    // This line is needed to prevent a warning of missing default value
                    defaultValue={props.targetProduct}
                />

                <input name="price" type="number" step=".01" ref={register({ required: true })}/> PLN
                <br/>

                <label>Shop name:</label>
                <input name="counterparty" defaultValue={defaultStoreName} ref={register({ required: true, maxLength: 64 })} />
                <br/>

                <button type="submit">Add entry</button>
            </form>
        </>
    );
};

export default ProductPriceForm;
