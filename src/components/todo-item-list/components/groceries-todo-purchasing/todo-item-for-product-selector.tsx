import { Button, Link, Select, Typography } from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import TodoItem from "../../types";

type FormFields = {
    todoItemId: number;
};

type SelectTodoItemForProductProps = {
    barcodeScanResult: BarcodeScanResult;
    todoItems: TodoItem[];
    onTodoItemSubmit(todoItem: TodoItem): void;
};
const SelectTodoItemForProduct = (props: SelectTodoItemForProductProps) => {
    const { todoItems } = props;

    const { handleSubmit, control } = useForm<FormFields>();
    const history = useHistory();

    const onSubmit = (formData: FormFields) => {
        const todoItem = todoItems.find(
            (item) => item.id === formData.todoItemId
        );
        if (!todoItem) {
            return;
        }

        props.onTodoItemSubmit(todoItem);
    };

    const redirectToAddNewProduct = () => {
        history.push("/new-product");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h3">
                Select item from the list that you want to link scanned product
                to:
            </Typography>
            <Controller
                name="todoItemId"
                as={Select}
                defaultValue={0}
                control={control}
            >
                <option value={0}>None</option>

                {todoItems.map((todoItem) => (
                    <option key={todoItem.id} value={todoItem.id}>
                        {todoItem.generalName}
                    </option>
                ))}
            </Controller>
            <Button type="submit" data-test-id="product-todo-item-submit-btn">
                Submit
            </Button>
            Or
            <Link onClick={() => redirectToAddNewProduct()} data-test-id="create-new-product-btn">
                Add new product
            </Link>
        </form>
    );
};

export default SelectTodoItemForProduct;
