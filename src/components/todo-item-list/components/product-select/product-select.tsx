import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";

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

    defaultProduct?: Product;
}

const NEW_PRODUCT = new Product("", "", "");

function asProductSelectItem(product: Product): ProductSelectItem {
    return { label: product.productFullName as string, product };
}

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
                asProductSelectItem(product)
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
            defaultValue={props.defaultProduct ? asProductSelectItem(props.defaultProduct) : null}
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

export default ProductSelect;
