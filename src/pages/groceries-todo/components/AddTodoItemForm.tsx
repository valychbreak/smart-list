import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
    Button, Grid,
} from "@material-ui/core";
import Product from "../../../entity/Product";
import TodoItemListContext, { TodoItemListContextType } from "../context/TodoItemListContext";
import TodoItem from "../../../components/todo-item-list/types";
import QuantityField from "../../../components/quantity-field";
import ProductSelect from "../../../components/todo-item-list/components/product-select";

const DEFAULT_AMOUNT = "1";

const AddTodoItemForm = (props: RouteComponentProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>();
    const [newItemQuantity, setNewItemQuantity] = useState(DEFAULT_AMOUNT);
    const [productSearchInput, setProductSearchInput] = useState("");

    const handleQuantityFieldChange = (quantity: number) => {
        setNewItemQuantity(quantity.toString());
    };

    const handleSubmit = (e: any, context: TodoItemListContextType) => {
        e.preventDefault();

        const quantity = parseInt(newItemQuantity, 10);
        if (selectedProduct && quantity > 0) {
            const newItem = TodoItem.fromProduct(selectedProduct, quantity);
            context.addItem(newItem);
            setNewItemQuantity(DEFAULT_AMOUNT);
            setProductSearchInput("");
        }
    };

    const onProductSelect = (selectedItem: Product | null) => {
        setSelectedProduct(selectedItem);
    };

    const onProductCreateOptionSelect = (inputValue: string) => {
        // eslint-disable-next-line no-alert
        if (window.confirm(`No product matching '${inputValue}' was added. \nDo you want to go to product adding page?`)) {
            props.history.push("new-product");
        }
    };

    return (
        <TodoItemListContext.Consumer>
            {(context) => (<>
                <form onSubmit={(e) => handleSubmit(e, context)}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <ProductSelect
                                inputValue={productSearchInput}
                                setInputValue={setProductSearchInput}
                                onProductSelect={onProductSelect}
                                onProductCreateOptionSelect={onProductCreateOptionSelect} />
                        </Grid>
                        <Grid item xs>
                            <QuantityField
                                defaultQuantity={1}
                                onChange={handleQuantityFieldChange} />
                        </Grid>
                        <Grid item xs>
                            <Button size="small" variant="outlined" type="submit">Add</Button>
                        </Grid>
                    </Grid>
                </form>
            </>)}
        </TodoItemListContext.Consumer>
    );
};

export default withRouter(AddTodoItemForm);
