import React from "react";
import Product from "../../../entity/Product";
import AsyncSelect from "react-select/async";
import { OptionsType } from "react-select";
import ProductApi from "../../../api/ProductApi";

type TagItem = {
    label: string,
    product: Product;
}

interface ProductSelectProps {
    onProductSelect(selectedProduct: Product | null): void;
}

export const ProductSelect = (props: ProductSelectProps) => {

    const onItemTagValueChange = (value: string): Promise<OptionsType<TagItem>> => {
        return new Promise((resolve, reject) => {
            ProductApi.findMatchingBy(value)
                .then(products => {
                    let foundProducts: TagItem[] = products.map(product => { 
                        return {label: product.productFullName as string, product: product}
                    });

                    resolve (foundProducts);
                })
        });
    }

    const onProductSelect = (selectedProduct: TagItem | null) => {
        props.onProductSelect(selectedProduct == null ? null : selectedProduct.product);
    }
    return (
        <AsyncSelect loadOptions={onItemTagValueChange} 
                     onChange={onProductSelect} />
    )
}
