import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Product from "../entity/Product";

interface ProductFormFields {
    productBarcode: string;
    productBarcodeType: string;
    productGeneralName: string;

    productFullName: string | null;
    productCountry: string | null;
    productCompanyName: string | null;
    image: string | null;
}

interface ProductFormProps {
    productBarcode: string;
    productBarcodeType: string;

    onProductSubmit(product: Product): void;
}

function isCountryCodeMatching(productCountryPrefix: string, recordCountryCode: string): boolean {
    if (recordCountryCode.includes("-")) {
        const prefixRange = recordCountryCode.split("-");
        const codeLowerLimit = parseInt(prefixRange[0].trim(), 10);
        const codeUpperLimit = parseInt(prefixRange[1].trim(), 10);

        const productCountryCode = parseInt(productCountryPrefix, 10);
        if (productCountryCode >= codeLowerLimit && productCountryCode <= codeUpperLimit) {
            return true;
        }
    } else if (recordCountryCode === productCountryPrefix) {
        return true;
    }

    return false;
}

const ProductForm = (props: ProductFormProps) => {
    const {
        register, handleSubmit, errors,
    } = useForm<ProductFormFields>();

    const [suggestedCountry, setSuggestedCountry] = useState(undefined);

    function updatedSuggestedCountry(barcode: string) {
        const countryPrefix = barcode.substring(0, 3);

        axios.get("barcode_country_mapping.json")
            .then((response) => {
                if (!response.data) {
                    return;
                }
                const countryRecord = response.data
                    .find((record: any) => isCountryCodeMatching(countryPrefix, record.barcode));

                setSuggestedCountry(countryRecord.country);
            });
    }

    function onBarcodeChange(event: any) {
        const newBarcodeValue = event.target.value;
        updatedSuggestedCountry(newBarcodeValue);
    }

    useEffect(() => {
        const barcode = props.productBarcode;

        if (!barcode) {
            return;
        }

        updatedSuggestedCountry(barcode);
    }, []);

    const createProduct = (formData: ProductFormFields) => {
        const product = new Product(
            formData.productGeneralName,
            formData.productBarcode,
            formData.productBarcodeType,
        );

        product.productFullName = formData.productFullName;
        product.productCompanyName = formData.productCompanyName;
        product.productCountry = formData.productCountry;
        return product;
    };

    const addItemInfo = (formData: ProductFormFields) => {
        const product = createProduct(formData);
        props.onProductSubmit(product);
    };

    return (
        <>
            <div>
                <p>Barcode: {props.productBarcode}</p>
                <p>Barcode format: {props.productBarcodeType}</p>
            </div>
            <form onSubmit={handleSubmit(addItemInfo)}>

                <label>Barcode and barcode format (change if scanned incorrectly): </label>
                <input name="productBarcode" defaultValue={props.productBarcode} onChange={(e) => onBarcodeChange(e)} ref={register({ required: true, maxLength: 64 })}/>
                <input name="productBarcodeType" defaultValue={props.productBarcodeType} ref={register({ required: true, maxLength: 64 })}/>
                {(errors.productBarcode || errors.productBarcodeType) && "Barcode and barcode format are required and max length is 64."}
                <br/>

                <label>General product name (e.g. Milk, Bread, Butter): </label>
                <input name="productGeneralName" ref={register({ required: true, maxLength: 64 })}/>
                {errors.productGeneralName && "Required and max length is 64."}
                <br/>

                <label>Full product name: </label>
                <input name="productFullName" ref={register({ maxLength: 128 })}/>
                {errors.productFullName && "Max length is 128."}
                <br/>

                <label>Release country: </label>
                <input name="productCountry" defaultValue={suggestedCountry} ref={register({ maxLength: 64 })}/>
                {errors.productCountry && "Max length is 64."}
                <br/>

                <label>Release company: </label>
                <input name="productCompanyName" ref={register({ maxLength: 64 })}/>
                {errors.productCompanyName && "Max length is 64."}
                <br/>

                <label>Product image (optional): </label>
                <button>Take a picture (TODO)</button>
                <br/>

                <button type="submit">Submit</button>
            </form>
        </>
    );
};

export default ProductForm;
