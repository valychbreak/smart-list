import { Button, FormGroup, makeStyles, Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import TodoItem from "../../types";

type FormFields = {
    todoItemId: number;
};

type SelectTodoItemForProductProps = {
    barcodeScanResult?: BarcodeScanResult;
    todoItems: TodoItem[];
    onTodoItemSubmit(todoItem: TodoItem): void;
};

const useStyles = makeStyles((theme) => ({
    formButtons: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
}));

const SelectTodoItemForProduct = (props: SelectTodoItemForProductProps) => {
    const { todoItems } = props;

    const { handleSubmit, control } = useForm<FormFields>();

    const classes = useStyles();

    const onSubmit = (formData: FormFields) => {
        const todoItem = todoItems.find(
            (item) => item.id === formData.todoItemId
        );
        if (!todoItem) {
            return;
        }

        props.onTodoItemSubmit(todoItem);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
                <Controller
                    name="todoItemId"
                    as={Select}
                    defaultValue={0}
                    control={control}
                >
                    <MenuItem value={0} disabled>
                        Please select...
                    </MenuItem>

                    {todoItems.map((todoItem) => (
                        <MenuItem key={todoItem.id} value={todoItem.id}>
                            {todoItem.generalName}
                        </MenuItem>
                    ))}
                </Controller>
            </FormGroup>

            <Button className={classes.formButtons} variant="contained" type="submit" data-test-id="product-todo-item-submit-btn">
                Submit
            </Button>
        </form>
    );
};

export default SelectTodoItemForProduct;
