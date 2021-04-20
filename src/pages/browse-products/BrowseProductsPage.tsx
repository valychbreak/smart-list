import React, { useEffect, useRef, useState } from "react";
import ProductApi from "../../api/ProductApi";
import ProductPriceApi from "../../api/ProductPriceApi";
import ProductPriceEntry from "../../entity/ProductPriceEntry";
import ProductPriceForm from "../../components/ProductPriceForm";
import ProductView from "../../components/ProductView";
import Product from "../../entity/Product";

const BrowseProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product>();
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
        ProductApi.getProducts().then((products) => {
            setProducts(products);
        });
    }, []);

    function showProductPriceForm(e: any, product: Product) {
        setSelectedProduct(product);
        setAddingPrice(true);
    }

    function onPriceEntrySubmit(productPriceEntry: ProductPriceEntry) {
        if (selectedProduct) {
            ProductPriceApi.addPriceEntry(selectedProduct, productPriceEntry)
                .then((priceEntry) => {
                    console.log(priceEntry);
                });
        }
    }

    return (
        <>
            {addingPrice
              && <>
                  <h3>Add price for {selectedProduct?.productFullName}</h3>
                  <ProductPriceForm targetProduct={selectedProduct} onEntrySubmit={onPriceEntrySubmit}/>
              </>
            }
            <h2>Existing products:</h2>
            <div>
                {products.map((product: Product, idx: number) => (<div key={idx}>
                    <button onClick={(e) => showProductPriceForm(e, product)} >Add price entry</button>
                    <br />
                    <ProductView product={product} />
                </div>))}
            </div>
            <hr />

            <h2>JSON Data (for export):</h2>
            <button onClick={(e) => copyToClipboard(e)}>Copy JSON data to clipboard</button>
            {copySuccess}
            <form>
                <textarea readOnly ref={textAreaRef} value={JSON.stringify(products)} style={{ width: "60%", height: 100 }} />
            </form>
        </>
    );
};

export default BrowseProductsPage;
