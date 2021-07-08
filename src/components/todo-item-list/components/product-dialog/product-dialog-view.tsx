import { Grid, makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Product from "../../../../entity/Product";

function getProductBarcode(product: Product): string {
    return `${product.productBarcode} (${product.productBarcodeType})`;
}

const ProductName = (props: { product: Product }) => {
    const { product } = props;
    if (product.productFullName) {
        return <Typography><b>{product.productFullName}</b></Typography>;
    }

    return (
        <Typography>
            <b>{product.productGeneralName}</b> (full name is missing)
        </Typography>
    );
};

type ProductDialogViewProps = {
    product: Product;
};

const useStyles = makeStyles(() => ({
    productImage: {
        maxHeight: 300,
        maxWidth: 300,
    }
}));

const ProductDialogView = (props: ProductDialogViewProps) => {
    const { product } = props;
    const classes = useStyles();

    const productImage = product.image;
    return (
        <>
            {productImage && <>
                <Grid container justify="center">
                    <Grid item>
                        <img src={productImage} className={classes.productImage} />
                    </Grid>
                </Grid>
            </>}
            <ProductName product={product} />
            <Typography>Barcode: {getProductBarcode(product)}</Typography>
            <Typography>Company: {product.productCompanyName}</Typography>
            <Typography>Country: {product.productCountry}</Typography>
        </>
    );
};

export default ProductDialogView;
