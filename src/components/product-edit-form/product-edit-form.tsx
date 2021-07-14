import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ProductApi from "../../api/ProductApi";
import Product from "../../entity/Product";
import { getImageUrlFromEvent } from "../utils/image-utils";

interface ProductEditFormFields {
    productGeneralName: string;

    productFullName: string | null;
    productCountry: string | null;
    productCompanyName: string | null;
    image: string | null;
}

type ProductEditFormProps = {
    product: Product;
    onProductSubmit?(product: Product): void;
    onCancel(): void;
};

const useStyles = makeStyles(() => ({
    productImage: {
        maxHeight: 300,
        maxWidth: 300,
    }
}));

const ProductEditForm = (props: ProductEditFormProps) => {
    const classes = useStyles();

    const { product } = props;

    const { handleSubmit, errors, control } = useForm<ProductEditFormFields>({
        defaultValues: {
            productGeneralName: product.productGeneralName || "",
            productFullName: product.productFullName || "",
            productCompanyName: product.productCompanyName || "",
            productCountry: product.productCountry || "",
            image: product.image
        },
    });

    const [productImage, setProductImage] = useState<string | null>(product.image);

    const onPhotoUpdate = (imageUrl: string | null) => {
        setProductImage(imageUrl);
    };

    const editProduct = async (formData: ProductEditFormFields) => {
        const {
            productGeneralName,
            productFullName,
            productCompanyName,
            productCountry,
            image
        } = formData;

        const updatedProduct = Product.constructorAll(
            product.id,
            productGeneralName,
            product.productBarcode,
            product.productBarcodeType,
            productFullName,
            productCountry,
            productCompanyName,
            null
        );

        await ProductApi.updateProduct(updatedProduct, image || undefined);

        if (props.onProductSubmit) {
            props.onProductSubmit(updatedProduct);
        }
    };

    return (
        <form onSubmit={handleSubmit(editProduct)}>
            <Grid container justify="center">
                <Grid item>
                    <img src={productImage || undefined} className={classes.productImage} />
                </Grid>
            </Grid>
            <Grid container justify="center">
                <Grid item>
                    <Controller
                        name="image"
                        control={control}
                        render={({ onChange }) => (
                            <Button variant="contained" component="label">
                                Change photo
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const imageUrl = getImageUrlFromEvent(e);
                                        onPhotoUpdate(imageUrl);
                                        onChange(imageUrl);
                                    }}
                                    hidden
                                />
                            </Button>
                        )}
                    />
                </Grid>
            </Grid>
            <Box marginY={3}>
                <Typography color="textSecondary">
                    {product.productBarcode} ({product.productBarcodeType})
                </Typography>
            </Box>
            <FormControl error={!!errors.productGeneralName} fullWidth>
                <InputLabel required htmlFor="product-general-name">
                    General name
                </InputLabel>
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
                        : "For example: Milk, Bread, Butter, Cheese"}
                </FormHelperText>
            </FormControl>

            <FormControl error={!!errors.productFullName} fullWidth>
                <InputLabel htmlFor="product-full-name">
                    Full product name
                </InputLabel>
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

            <FormControl error={!!errors.productCountry} fullWidth>
                <InputLabel htmlFor="product-country">
                    Release country
                </InputLabel>
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
                <InputLabel htmlFor="product-company-name">
                    Release company
                </InputLabel>
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

            <Button type="submit" variant="outlined">
                Submit
            </Button>
            {" or "}
            <Button variant="text" onClick={() => props.onCancel()}>
                Cancel
            </Button>
        </form>
    );
};

export default ProductEditForm;
