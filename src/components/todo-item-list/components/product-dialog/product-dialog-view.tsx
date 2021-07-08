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

const ProductDialogView = (props: ProductDialogViewProps) => {
    const { product } = props;
    return (
        <>
            <ProductName product={product} />
            <Typography>Barcode: {getProductBarcode(product)}</Typography>
            <Typography>Company: {product.productCompanyName}</Typography>
            <Typography>Country: {product.productCountry}</Typography>
        </>
    );
};

export default ProductDialogView;
