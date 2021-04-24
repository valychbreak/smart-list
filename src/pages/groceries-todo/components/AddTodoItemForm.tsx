import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
    TextField, Button, CircularProgress, Grid,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Product from "../../../entity/Product";
import ProductApi from "../../../api/ProductApi";
import TodoItemListContext, { TodoItemListContextType } from "../context/TodoItemListContext";
import TodoItem from "../../../components/todo-item-list/types";
import QuantityField from "../../../components/quantity-field";

type ProductSelectItem = {
    inputValue?: string;
    label: string,
    product: Product;
};

interface ProductSelectProps {
    inputValue: string;
    setInputValue(newValue: string): void;
    onProductSelect(selectedProduct: Product | null): void;
    onProductCreateOptionSelect(inputValue: string): void;
}

const NEW_PRODUCT = new Product("", "", "");

const ProductSelect = (props: ProductSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<ProductSelectItem[]>([]);
    const loading = open && options.length === 0 && props.inputValue.length > 0;

    const onInputChange = async (inputValue: string) => {
        props.setInputValue(inputValue);
        setOptions([]);
        if (inputValue.length > 0) {
            const loadedProducts = await ProductApi.findMatchingBy(inputValue);
            const foundProducts: ProductSelectItem[] = loadedProducts.map((product) => (
                { label: product.productFullName as string, product }
            ));

            foundProducts.push({ inputValue, label: `Add '${inputValue}' product`, product: NEW_PRODUCT });
            setOptions(foundProducts);
        }
    };

    const onProductOptionCreate = (inputValue: string) => {
        props.onProductCreateOptionSelect(inputValue);
    };

    const onProductSelect = (selectedProduct: ProductSelectItem | null) => {
        if (selectedProduct) {
            if (selectedProduct.product === NEW_PRODUCT && selectedProduct.inputValue) {
                onProductOptionCreate(selectedProduct.inputValue);
            } else {
                props.onProductSelect((selectedProduct as ProductSelectItem).product);
            }
        } else {
            props.onProductSelect(null);
        }
    };

    return (<>
        <Autocomplete
            open={open}
            inputValue={props.inputValue}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionSelected={(option, selectedValue) => option.label === selectedValue.label}
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => {
                onProductSelect(newValue);
            }}
            onInputChange={(event, value) => {
                onInputChange(value);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="medium"
                    placeholder="Select product..."
                    variant="standard"
                    margin="none"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }} />
            )} />
    </>);
};

const DEFAULT_AMOUNT = "1";

const AddTodoItemForm = (props: RouteComponentProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>();
    const [newItemQuantity, setNewItemQuantity] = useState(DEFAULT_AMOUNT);
    const [productSearchInput, setProductSearchInput] = useState("");

    const handleQuantityFieldChange = (quantity: number) => {
        setNewItemQuantity(quantity.toString());
    };

    const handleSubmit = (e: any, context: TodoItemListContextType) => {
        e.preventDefault();

        const quantity = parseInt(newItemQuantity, 10);
        if (selectedProduct && quantity > 0) {
            const newItem = TodoItem.fromProduct(selectedProduct, quantity);
            context.addItem(newItem);
            setNewItemQuantity(DEFAULT_AMOUNT);
            setProductSearchInput("");
        }
    };

    const onProductSelect = (selectedItem: Product | null) => {
        setSelectedProduct(selectedItem);
    };

    const onProductCreateOptionSelect = (inputValue: string) => {
        // eslint-disable-next-line no-alert
        if (window.confirm(`No product matching '${inputValue}' was added. \nDo you want to go to product adding page?`)) {
            props.history.push("new-product");
        }
    };

    return (
        <TodoItemListContext.Consumer>
            {(context) => (<>
                <form onSubmit={(e) => handleSubmit(e, context)}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <ProductSelect
                                inputValue={productSearchInput}
                                setInputValue={setProductSearchInput}
                                onProductSelect={onProductSelect}
                                onProductCreateOptionSelect={onProductCreateOptionSelect} />
                        </Grid>
                        <Grid item xs>
                            <QuantityField
                                defaultQuantity={1}
                                onChange={handleQuantityFieldChange} />
                        </Grid>
                        <Grid item xs>
                            <Button size="small" variant="outlined" type="submit">Add</Button>
                        </Grid>
                    </Grid>
                </form>
            </>)}
        </TodoItemListContext.Consumer>
    );
};

export default withRouter(AddTodoItemForm);
