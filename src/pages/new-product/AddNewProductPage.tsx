import React, {
    Component, useEffect, useRef, useState,
} from "react";
import { Container } from "@material-ui/core";
import Product from "../../entity/Product";
import AddProductInfo from "../../components/AddProductInfo";
import ProductView from "../../components/ProductView";
import ProductApi from "../../api/ProductApi";

const AddNewProduct = () => {
    const [addingProduct, setAddingProduct] = useState(false);
    const [productError, setProductError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    function startAddingProduct() {
        setAddingProduct(true);
        setSuccessMessage("");
    }

    function cancelAddingProduct() {
        setAddingProduct(false);
    }

    const onProductSubmit = async (product: Product) => {
        try {
            const savedProduct = await ProductApi.saveProduct(product);
            setAddingProduct(false);

            setSuccessMessage(`Successfully added ${savedProduct.productFullName} to local DB. Go to Browse product page to export local db.`);
        } catch (error) {
            setProductError(error);
        }
    };

    return (
        <Container>

            <h2>Actions</h2>
            {addingProduct
                ? <button onClick={cancelAddingProduct}>Cancel</button>
                : <button onClick={startAddingProduct}>Add Product</button>}
            <hr />
            {successMessage && <p>{successMessage}</p>}
            {productError && <p>{productError}</p>}
            {addingProduct && <AddProductInfo onProductSubmit={onProductSubmit} />}

        </Container>
    );
};

export default AddNewProduct;
