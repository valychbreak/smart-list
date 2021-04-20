import React from "react";
import { useForm } from "react-hook-form";
import Product from "../entity/Product";
import ProductPriceEntry from "../entity/ProductPriceEntry";
import { Store } from "./todo-item-list/types";

interface ProductPriceFormFields {
    price: number;
    counterparty: string;
}

interface ProductPriceFormProps {
    targetProduct: Product | undefined;
    defaultStore?: Store | null;
    onEntrySubmit(productPriceEntry: ProductPriceEntry): void;
}

const ProductPriceForm = (props: ProductPriceFormProps) => {
    const { register, handleSubmit } = useForm<ProductPriceFormFields>();

    const defaultStoreName = props.defaultStore?.name;

    const submitPriceEntry = (formData: ProductPriceFormFields) => {
        if (props.targetProduct) {
            const priceEntry = new ProductPriceEntry(
                props.targetProduct.productBarcode,
                formData.price,
                formData.counterparty,
                new Date(),
            );
            props.onEntrySubmit(priceEntry);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit(submitPriceEntry)}>
                <label>Price:</label>
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
