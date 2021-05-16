/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, FormGroup, FormHelperText, Input, InputAdornment, InputLabel } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import StoreApi from "../api/StoreApi";
import Product from "../entity/Product";
import StoreSelect from "./store-select";
import ProductSelect from "./todo-item-list/components/product-select";
import { Store } from "./todo-item-list/types";

interface ProductPriceFormFields {
    price: string;
    counterparty: Store | null;
    selectedProduct: Product | null;
}

export interface ProductPriceData {
    price: number;
    storeName: string;
    selectedProduct: Product | null;
}

interface ProductPriceFormProps {
    targetProduct: Product | null;
    defaultStore?: Store | null;
    onSubmit(formData: ProductPriceData): void;
}

const ProductPriceForm = (props: ProductPriceFormProps) => {
    const { defaultStore } = props;

    const { handleSubmit, control } = useForm<ProductPriceFormFields>({
        defaultValues: {
            price: "",
            counterparty: defaultStore,
            selectedProduct: props.targetProduct
        }
    });

    const [storeList, setStoreList] = useState<Store[]>(defaultStore ? [defaultStore] : []);

    const history = useHistory();

    useEffect(() => {
        StoreApi.fetchStores().then((stores) => setStoreList(stores));
    }, []);

    const submitPriceEntry = (formData: ProductPriceFormFields) => {
        const { price, counterparty, selectedProduct } = formData;

        if (!counterparty) {
            return;
        }

        props.onSubmit({
            price: parseFloat(price),
            storeName: counterparty?.name || "",
            selectedProduct
        });
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
                <Controller
                    name="selectedProduct"
                    control={control}
                    rules={{ required: false }}
                    defaultValue={props.targetProduct}
                    render={({ onChange, value }) => (
                        <ProductSelect
                            label="Product"
                            product={value}
                            onProductSelect={(selectedProduct) => onChange(selectedProduct)}
                            onProductCreateOptionSelect={onProductCreateOptionSelect} />
                    )}
                />

                <FormControl fullWidth>
                    <InputLabel required htmlFor="item-price">Purchased price</InputLabel>
                    <Controller
                        name="price"
                        control={control}
                        rules={{ required: true }}
                        render={({ onChange, value }) => (
                            <Input
                                id="item-price"
                                type="number"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                endAdornment={<InputAdornment position="end">PLN</InputAdornment>}
                            />
                        )}
                    />
                </FormControl>

                <FormControl>
                    <Controller
                        name="counterparty"
                        control={control}
                        render={({ onChange, value }) => (
                            <StoreSelect
                                selectedStore={value}
                                storeList={storeList}
                                onStoreSelect={(store) => onChange(store)}
                            />
                        )}
                    />
                    <FormHelperText>Store in which product was purchased</FormHelperText>
                </FormControl>
                <br />
                <button type="submit">Add entry</button>
            </form>
        </>
    );
};

export default ProductPriceForm;
