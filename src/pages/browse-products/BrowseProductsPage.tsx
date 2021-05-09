import React, { useEffect, useRef, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import ProductApi from "../../api/ProductApi";
import ProductPriceApi from "../../api/ProductPriceApi";
import ProductPriceEntry from "../../entity/ProductPriceEntry";
import ProductPriceForm, { ProductPriceData } from "../../components/ProductPriceForm";
import ProductView from "../../components/ProductView";
import Product from "../../entity/Product";

const BrowseProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [addingPrice, setAddingPrice] = useState(false);

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

    function onPriceEntrySubmit(formData: ProductPriceData) {
        if (selectedProduct) {
            const priceEntry = new ProductPriceEntry(
                selectedProduct.productBarcode,
                formData.price,
                formData.storeName,
                new Date()
            );
            ProductPriceApi.addPriceEntry(selectedProduct, priceEntry);
        }
    }

    return (
        <>
            {addingPrice && (<>
                <h3>Add price for {selectedProduct?.productFullName}</h3>
                <ProductPriceForm
                    targetProduct={selectedProduct}
                    onSubmit={onPriceEntrySubmit}
                />
            </>)}
            <Typography variant="h4">Browse products</Typography>
            <Grid container>
                <Grid item>
                    {products.map((product: Product, idx: number) => (
                        <ProductView
                            key={idx}
                            product={product}
                            onPriceEntryClick={() => showProductPriceForm(product)}/>
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
