import { Button } from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import QuantityField from "../../../quantity-field";
import TodoItem from "../../types";
import TodoItemNameSelect from "./todo-item-name-select";
import useTodoItemNameSelectController from "./todo-item-name-select-controller";

type TodoItemAddFormFields = {
    name: string;
    quantity: number;
};

const TodoItemAddForm = () => {
    const {
        open,
        inputValue,
        options,
        loading,
        setOpen,
        setInputValue,
        clear,
    } = useTodoItemNameSelectController();

    const { control, handleSubmit } = useForm<TodoItemAddFormFields>();

    const { addItem } = useTodoItemListContext();

    const onFormSubmit = (formData: TodoItemAddFormFields) => {
        const { name, quantity } = formData;
        if (name !== "") {
            addItem(TodoItem.fromName(name, quantity));
            clear();
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ onChange }) => (
                    <TodoItemNameSelect
                        loading={loading}
                        open={open}
                        inputValue={inputValue}
                        options={options}
                        setOpen={setOpen}
                        setInputValue={setInputValue}
                        onTodoItemNameSelect={(todoItemName) => onChange(todoItemName)}
                    />
                )}
            />
            <Controller
                name="quantity"
                control={control}
                rules={{ required: true }}
                defaultValue={1}
                render={({ onChange }) => (
                    <QuantityField
                        defaultQuantity={1}
                        onChange={(newQuantity) => onChange(newQuantity)}
                    />
                )}
            />
            <Button type="submit">Add</Button>
        </form>
    );
};

export default TodoItemAddForm;
