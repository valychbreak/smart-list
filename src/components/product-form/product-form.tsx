import { Button, FormControl, FormHelperText, Grid, Input, InputLabel, makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getImageUrlFromEvent } from "../utils/image-utils";
import ProductFormData from "./types";

export interface ProductFormFields {
    productBarcode: string;
    productBarcodeType: string;
    productGeneralName: string;

    productFullName: string | null;
    productCountry: string | null;
    productCompanyName: string | null;
    image: string | null;
}

interface ProductFormProps {
    shortForm?: boolean;
    defaultFieldValues?: ProductFormFields;
    onProductSubmit(product: ProductFormData): void;
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

const useStyles = makeStyles(() => ({
    productImage: {
        maxHeight: 100,
        maxWidth: 100,
    }
}));

const ProductForm = (props: ProductFormProps) => {
    const { defaultFieldValues } = props;
    const classes = useStyles();

    const {
        handleSubmit, errors, control, setValue
    } = useForm<ProductFormFields>({
        defaultValues: {
            productBarcode: defaultFieldValues?.productBarcode || "",
            productBarcodeType: defaultFieldValues?.productBarcodeType || "",
            productGeneralName: defaultFieldValues?.productGeneralName || "",
            productFullName: defaultFieldValues?.productFullName || "",
            productCompanyName: defaultFieldValues?.productCompanyName || "",
            productCountry: defaultFieldValues?.productCountry || "",
        }
    });

    const [
        productImage, setProductImage
    ] = useState<string | null>(defaultFieldValues?.image || null);

    function updatedSuggestedCountry(barcode: string) {
        if (!barcode || barcode.length < 3) {
            return;
        }

        const countryPrefix = barcode.substring(0, 3);

        axios.get("barcode_country_mapping.json")
            .then((response) => {
                if (!response.data) {
                    return;
                }
                const countryRecord = response.data
                    .find((record: any) => isCountryCodeMatching(countryPrefix, record.barcode));

                if (!countryRecord) {
                    return;
                }

                setValue("productCountry", countryRecord.country);
            });
    }

    function onBarcodeChange(newBarcodeValue: string) {
        updatedSuggestedCountry(newBarcodeValue);
    }

    useEffect(() => {
        const barcode = defaultFieldValues?.productBarcode;

        if (!barcode) {
            return;
        }

        updatedSuggestedCountry(barcode);
    }, [defaultFieldValues?.productBarcode]);

    const createProduct = (formData: ProductFormFields): ProductFormData => (
        {
            generalName: formData.productGeneralName,
            barcode: formData.productBarcode,
            barcodeType: formData.productBarcodeType,
            fullName: formData.productFullName,
            companyName: formData.productCompanyName,
            country: formData.productCountry,
            imageUrl: formData.image
        }
    );

    const addItemInfo = (formData: ProductFormFields) => {
        const productFormData = createProduct(formData);
        props.onProductSubmit(productFormData);
    };

    const onPhotoUpload = (imageUrl: string | null) => {
        setProductImage(imageUrl);
    };

    return (
        <>
            <form onSubmit={handleSubmit(addItemInfo)}>
                <FormControl error={!!errors.productBarcode} fullWidth>
                    <InputLabel required htmlFor="product-barcode">Barcode</InputLabel>
                    <Controller
                        name="productBarcode"
                        control={control}
                        rules={{ required: true, maxLength: 64 }}
                        render={({ onChange, value }) => (
                            <Input
                                id="product-barcode"
                                value={value}
                                onChange={(inputValue) => {
                                    onBarcodeChange(inputValue.target.value);
                                    onChange(inputValue);
                                }}
                            />
                        )}
                    />
                    <FormHelperText>
                        {errors.productBarcode && "Required and max length is 64."}
                    </FormHelperText>
                </FormControl>

                <FormControl error={!!errors.productBarcodeType} fullWidth>
                    <InputLabel required htmlFor="product-barcode-type">Barcode type</InputLabel>
                    <Controller
                        name="productBarcodeType"
                        control={control}
                        rules={{ required: true, maxLength: 64 }}
                        render={({ onChange, value }) => (
                            <Input
                                id="product-barcode-type"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <FormHelperText>
                        {errors.productBarcodeType
                            ? "Required and max length is 64."
                            : "For example: ean8, ean13"
                        }
                    </FormHelperText>
                </FormControl>

                <FormControl error={!!errors.productGeneralName} fullWidth>
                    <InputLabel required htmlFor="product-general-name">General name</InputLabel>
                    <Controller
                        name="productGeneralName"
                        control={control}
                        rules={{ required: true, maxLength: 64 }}
                        render={({ onChange, value }) => (
                            <Input
                                id="product-general-name"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <FormHelperText>
                        {errors.productGeneralName
                            ? "Required and max length is 64."
                            : "For example: Milk, Bread, Butter, Cheese"
                        }
                    </FormHelperText>
                </FormControl>

                <FormControl error={!!errors.productFullName} fullWidth>
                    <InputLabel htmlFor="product-full-name">Full product name</InputLabel>
                    <Controller
                        name="productFullName"
                        control={control}
                        rules={{ required: false, maxLength: 128 }}
                        render={({ onChange, value }) => (
                            <Input
                                id="product-full-name"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <FormHelperText>
                        {errors.productFullName && "Max length is 128."}
                    </FormHelperText>
                </FormControl>

                {!props.shortForm && <>

                    <FormControl error={!!errors.productCountry} fullWidth>
                        <InputLabel htmlFor="product-country">Release country</InputLabel>
                        <Controller
                            name="productCountry"
                            control={control}
                            rules={{ required: false, maxLength: 64 }}
                            render={({ onChange, value }) => (
                                <Input
                                    id="product-country"
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                        <FormHelperText>
                            {errors.productCountry && "Max length is 64."}
                        </FormHelperText>
                    </FormControl>

                    <FormControl error={!!errors.productCompanyName} fullWidth>
                        <InputLabel htmlFor="product-company-name">Release company</InputLabel>
                        <Controller
                            name="productCompanyName"
                            control={control}
                            rules={{ required: false, maxLength: 64 }}
                            render={({ onChange, value }) => (
                                <Input
                                    id="product-company-name"
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                        <FormHelperText>
                            {errors.productCompanyName && "Max length is 64."}
                        </FormHelperText>
                    </FormControl>

                    <Grid container>
                        <Grid item>
                            <img src={productImage || undefined} className={classes.productImage} />
                        </Grid>
                        <Grid item>
                            <Controller
                                name="image"
                                control={control}
                                render={({ onChange }) => (
                                    <Button variant="contained" component="label">
                                        Upload photo
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const imageUrl = getImageUrlFromEvent(e);
                                                onPhotoUpload(imageUrl);
                                                onChange(imageUrl);
                                            }}
                                            hidden
                                        />
                                    </Button>
                                )}
                            />
                        </Grid>
                    </Grid>
                    <br/>
                </>}

                <Button type="submit" variant="outlined">Submit</Button>
            </form>
        </>
    );
};

export default ProductForm;
