import React, { Component, useEffect, useRef, useState } from 'react';
import Product from '../../entity/Product';
import AddProductInfo from '../../components/AddProductInfo';
import ProductView from '../../components/ProductView';
import ProductApi from '../../api/ProductApi';


const AddNewProduct = () => {

  const [addingProduct, setAddingProduct] = useState(false);
  const [productError, setProductError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  function _startAddingProduct() {
    setAddingProduct(true);
    setSuccessMessage("");
  }

  const onProductSubmit = async (product: Product) => {
    try {
      let savedProduct = await ProductApi.saveProduct(product);
      setAddingProduct(false);

      setSuccessMessage("Successfully added " + savedProduct.productFullName + " to local DB. Go to Browse product page to export local db.")
    } catch (error) {
      setProductError(error);
    }
  }

  return (
    <div>

      <h2>Actions</h2>
      <button onClick={_startAddingProduct}>{addingProduct ? 'Cancel' : 'Add Product'}</button>
      <hr />
      {successMessage && <p>{successMessage}</p>}
      {productError && <p>{productError}</p>}
      {addingProduct && <AddProductInfo onProductSubmit={onProductSubmit} />}

    </div>
  )
}

export default AddNewProduct;
