import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import ProductApi from "../../api/ProductApi";
import ProductPriceApi from "../../api/ProductPriceApi";
import ProductPriceEntry from "../../entity/ProductPriceEntry";
import ProductPriceDialogForm, { ProductPriceData } from "../../components/product-price-dialog-form/product-price-dialog-form";
import ProductView from "../../components/ProductView";
import Product from "../../entity/Product";
import ProductEditForm from "../../components/product-edit-form";

const BrowseProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [addingPrice, setAddingPrice] = useState(false);
    const [showProductEditDialog, setShowProductEditDialog] = useState(false);

    const [copySuccess, setCopySuccess] = useState("");
    const textAreaRef = useRef<any>(null);

    function copyToClipboard(e: any) {
        textAreaRef.current.select();
        document.execCommand("copy");
        e.target.focus();
        setCopySuccess("Copied!");
    }

    useEffect(() => {
        ProductApi.getProducts()
            .then((loadedProducts) => {
                setProducts(loadedProducts);
            });
    }, []);

    function showProductPriceForm(product: Product) {
        setSelectedProduct(product);
        setAddingPrice(true);
    }

    function closeProductPriceForm() {
        setAddingPrice(false);
    }

    function onPriceEntrySubmit(formData: ProductPriceData) {
        if (selectedProduct) {
            const priceEntry = new ProductPriceEntry(
                selectedProduct.productBarcode,
                formData.price,
                formData.store.name,
                new Date()
            );
            ProductPriceApi.addPriceEntry(selectedProduct, priceEntry);
            closeProductPriceForm();
        }
    }

    function showProductEditForm(product: Product) {
        setSelectedProduct(product);
        setShowProductEditDialog(true);
    }

    function closeProductEditDialog() {
        setShowProductEditDialog(false);
    }

    function updateProductInView(product: Product) {
        const updatedProductList = products.map((existingProduct) => {
            if (existingProduct.productBarcode === product.productBarcode) {
                const clonedProduct = Product.constructorAll(
                    product.id,
                    product.productGeneralName,
                    product.productBarcode,
                    product.productBarcodeType,
                    product.productFullName,
                    product.productCountry,
                    product.productCompanyName,
                    product.image
                );
                clonedProduct.category = existingProduct.category;
                return clonedProduct;
            }

            return existingProduct;
        });

        setProducts(updatedProductList);
    }

    function onProductEditSubmit(product: Product) {
        closeProductEditDialog();
        updateProductInView(product);
    }

    const productName = selectedProduct?.productFullName || selectedProduct?.productGeneralName;
    return (
        <>
            <Dialog open={addingPrice}>
                <DialogTitle>
                    Add price for {productName}
                </DialogTitle>
                <ProductPriceDialogForm
                    targetProduct={selectedProduct}
                    onSubmit={onPriceEntrySubmit}
                    onClose={closeProductPriceForm}
                />
            </Dialog>

            <Dialog open={showProductEditDialog} onClose={closeProductEditDialog}>
                <DialogTitle>
                    Edit {selectedProduct?.productFullName || selectedProduct?.productGeneralName}
                </DialogTitle>
                <DialogContent>
                    <ProductEditForm
                        product={selectedProduct as Product}
                        onProductSubmit={(product) => onProductEditSubmit(product)}
                        onCancel={closeProductEditDialog}
                    />
                </DialogContent>
            </Dialog>
            <Typography variant="h4">Browse products</Typography>
            <Grid container>
                <Grid item>
                    {products.map((product: Product, idx: number) => (
                        <ProductView
                            key={idx}
                            product={product}
                            onPriceEntryClick={() => showProductPriceForm(product)}
                            onProductEditClick={() => showProductEditForm(product)}
                        />
                    ))}
                </Grid>
            </Grid>

            <h2>JSON Data (for export):</h2>
            <button onClick={(e) => copyToClipboard(e)}>
                Copy JSON data to clipboard
            </button>
            {copySuccess}
            <form>
                <textarea
                    readOnly
                    ref={textAreaRef}
                    value={JSON.stringify(products)}
                    style={{ width: "60%", height: 100 }}
                />
            </form>
        </>
    );
};

export default BrowseProductsPage;
