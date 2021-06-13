import React, { useState } from "react";
import { Container } from "@material-ui/core";
import AddProductInfo from "../../components/AddProductInfo";
import ProductApi from "../../api/ProductApi";
import ProductFormData from "../../components/product-form/types";

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

    const onProductSubmit = async (productFormData: ProductFormData) => {
        try {
            const savedProduct = await ProductApi.createNewProduct(productFormData);
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
            {addingProduct && (
                <AddProductInfo
                    onProductSubmit={(productFormData) => onProductSubmit(productFormData)}
                />
            )}

        </Container>
    );
};

export default AddNewProduct;
