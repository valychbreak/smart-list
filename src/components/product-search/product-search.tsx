import React, { useEffect, useRef, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Controller, useForm } from "react-hook-form";
import Pagination from "@material-ui/lab/Pagination";
import ProductApi from "../../api/ProductApi";
import ProductPriceApi from "../../api/ProductPriceApi";
import ProductPriceEntry from "../../entity/ProductPriceEntry";
import ProductPriceDialogForm, { ProductPriceData } from "../product-price-dialog-form/product-price-dialog-form";
import ProductView from "../ProductView";
import Product from "../../entity/Product";
import ProductEditForm from "../product-edit-form";
import Page from "../../entity/page";
import SearchRequest from "../../entity/search-request";

interface ProductSearchFields {
    query: string | null;
}

const ProductSearchPage = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    const [
        productSearchResult,
        setPagedProducts
    ] = useState<Page<Product> | null>(null);

    const products: Product[] = productSearchResult?.items || [];

    const { control, handleSubmit } = useForm<ProductSearchFields>({
        defaultValues: {
            query: ""
        }
    });

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [addingPrice, setAddingPrice] = useState(false);
    const [showProductEditDialog, setShowProductEditDialog] = useState(false);

    const [copySuccess, setCopySuccess] = useState("");
    const textAreaRef = useRef<any>(null);

    useEffect(() => {
        if (searchQuery) {
            return;
        }

        ProductApi.getProducts(currentPage).then((allProductsSearchResult) => {
            setPagedProducts(allProductsSearchResult);
        });
    }, [currentPage, searchQuery]);

    function copyToClipboard(e: any) {
        textAreaRef.current.select();
        document.execCommand("copy");
        e.target.focus();
        setCopySuccess("Copied!");
    }

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
        ProductApi.findByBarcode(product.productBarcode, product.productBarcodeType)
            .then((fetchedProduct) => {
                if (!fetchedProduct || !productSearchResult) {
                    return;
                }

                const updatedProductList = products.map((existingProduct) => {
                    if (existingProduct.productBarcode === product.productBarcode) {
                        return fetchedProduct;
                    }

                    return existingProduct;
                });

                setPagedProducts(
                    new Page(
                        updatedProductList,
                        productSearchResult.itemsPerPage,
                        productSearchResult.totalPages,
                        productSearchResult.totalResults
                    )
                );
            });
    }

    function onProductEditSubmit(product: Product) {
        closeProductEditDialog();
        updateProductInView(product);
    }

    const searchProducts = async (productSearchRequest: SearchRequest) => {
        const { query, page } = productSearchRequest;
        const searchResult = await ProductApi.searchProductBy(query, page);
        setPagedProducts(searchResult);
    };

    const resetSearch = () => {
        setSearchQuery(null);
        setCurrentPage(1);
        setPagedProducts(null);
    };

    const onProductSearch = async (formData: ProductSearchFields) => {
        const { query } = formData;
        if (!query) {
            resetSearch();
            return;
        }

        setSearchQuery(query);
        setCurrentPage(1);

        const productSearchRequest = new SearchRequest(query, 1);
        searchProducts(productSearchRequest);
    };

    const onSearchPageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);

        if (!searchQuery) {
            return;
        }

        const productSearchRequest = new SearchRequest(searchQuery, value);
        searchProducts(productSearchRequest);
    };

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
            <form onSubmit={handleSubmit(onProductSearch)}>
                <Grid justify="center" alignItems="center" container>
                    <Grid xs={10} item>
                        <Controller
                            as={TextField}
                            name="query"
                            control={control}
                            label="Search"
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <IconButton type="submit" aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </form>
            <Box marginY={1}>
                <Divider />
            </Box>
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

            {productSearchResult && (
                <Grid justify="center" container>
                    <Grid item>
                        <Pagination
                            page={currentPage}
                            count={productSearchResult.totalPages}
                            onChange={(e, value) => onSearchPageChange(e, value)}
                        />
                    </Grid>
                </Grid>
            )}

            <h2>JSON Data (for export):</h2>
            <button onClick={(e) => copyToClipboard(e)}>
                Copy JSON data to clipboard
            </button>
            {copySuccess}
            <form>
                <textarea
                    readOnly
                    ref={textAreaRef}
                    value={localStorage.getItem("products") || ""}
                    style={{ width: "60%", height: 100 }}
                />
            </form>
        </>
    );
};

export default ProductSearchPage;
