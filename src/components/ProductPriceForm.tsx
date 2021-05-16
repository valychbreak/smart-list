import { Button, DialogActions, DialogContent, FormControl, FormHelperText, Input, InputAdornment, InputLabel } from "@material-ui/core";
import { useEffect, useState } from "react";
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
    store: Store;
    selectedProduct: Product | null;
}

interface ProductPriceFormProps {
    targetProduct: Product | null;
    defaultStore?: Store | null;
    onSubmit(formData: ProductPriceData): void;
    onClose(): void;
}

const ProductPriceForm = (props: ProductPriceFormProps) => {
    const { defaultStore, onClose } = props;

    const { handleSubmit, control, formState: { errors } } = useForm<ProductPriceFormFields>({
        defaultValues: {
            price: "",
            counterparty: defaultStore || null,
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
            store: counterparty,
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
                <DialogContent>
                    <Controller
                        name="selectedProduct"
                        control={control}
                        rules={{ required: false }}
                        render={({ onChange, value }) => (
                            <ProductSelect
                                label="Product"
                                product={value}
                                onProductSelect={(selectedProduct) => onChange(selectedProduct)}
                                onProductCreateOptionSelect={onProductCreateOptionSelect} />
                        )}
                    />

                    <FormControl error={!!errors.price} fullWidth>
                        <InputLabel required htmlFor="item-price">Product price</InputLabel>
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
                        <FormHelperText>
                            {errors.price ? "Price is required" : "Price for 1 unit"}
                        </FormHelperText>
                    </FormControl>

                    <FormControl error={!!errors.counterparty} fullWidth>
                        <Controller
                            name="counterparty"
                            control={control}
                            rules={{ required: true }}
                            render={({ onChange, value }) => (
                                <StoreSelect
                                    selectedStore={value}
                                    storeList={storeList}
                                    onStoreSelect={(store) => onChange(store)}
                                />
                            )}
                        />
                        <FormHelperText>
                            {errors.counterparty
                                ? "Store is required"
                                : "Store in which product was purchased"
                            }
                        </FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose()}>Skip</Button>
                    <Button variant="outlined" type="submit">Submit</Button>
                </DialogActions>
            </form>
        </>
    );
};

export default ProductPriceForm;
