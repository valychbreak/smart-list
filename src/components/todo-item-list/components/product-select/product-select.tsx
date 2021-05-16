import { useMemo } from "react";
import ProductApi from "../../../../api/ProductApi";
import Product from "../../../../entity/Product";
import { AsyncAutocomplete, useAsyncAutocompleteController } from "../../../async-autocomplete";

type ProductSelectItem = {
    inputValue?: string;
    label: string,
    product: Product;
};

const NEW_PRODUCT = new Product("", "", "");

function asProductSelectItem(product: Product): ProductSelectItem {
    const optionLabel = product.productFullName || product.productGeneralName;
    return { label: optionLabel, product };
}

async function loadOptions(inputValue: string) {
    const loadedProducts = await ProductApi.findMatchingBy(inputValue);
    const foundProducts: ProductSelectItem[] = loadedProducts.map((product) => (
        asProductSelectItem(product)
    ));

    foundProducts.push({ inputValue, label: `Add '${inputValue}' product`, product: NEW_PRODUCT });
    return foundProducts;
}

interface ProductSelectProps {
    onProductSelect(selectedProduct: Product | null): void;
    onProductCreateOptionSelect(inputValue: string): void;

    product: Product | null;
    label?: string;
}

const ProductSelect = (props: ProductSelectProps) => {
    const {
        loading,
        inputValue,
        options,
        setInputValue,
    } = useAsyncAutocompleteController<ProductSelectItem>({ loadOptions });

    const selectedProduct: ProductSelectItem | null = useMemo(() => (
        props.product ? asProductSelectItem(props.product) : null
    ), [props.product]);

    const onProductOptionCreate = (manualInput: string) => {
        props.onProductCreateOptionSelect(manualInput);
    };

    const onProductSelect = (productOption: ProductSelectItem | null) => {
        if (productOption) {
            if (productOption.product === NEW_PRODUCT && productOption.inputValue) {
                onProductOptionCreate(productOption.inputValue);
            } else {
                props.onProductSelect((productOption as ProductSelectItem).product);
            }
        } else {
            props.onProductSelect(null);
        }
    };

    return (
        <AsyncAutocomplete
            label={props.label}
            placeholder="Select product..."
            value={selectedProduct}
            loading={loading}
            inputValue={inputValue}
            setInputValue={setInputValue}
            options={options}
            onChange={onProductSelect}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) => option.label === value.label}
        />
    );
};

export default ProductSelect;
