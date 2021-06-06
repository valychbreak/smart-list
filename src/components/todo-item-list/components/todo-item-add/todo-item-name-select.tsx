import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import Product from "../../../../entity/Product";

export type TodoItemNameItem = {
    label: string;
    todoItemName: string;
    product?: Product;
};

export type ProductOrName = {
    product?: Product;
    productName: string;
};

type TodoItemNameSelectProps = {
    open: boolean;
    inputValue: string;
    options: TodoItemNameItem[];
    loading: boolean;
    setOpen(isOpened: boolean): void;
    setInputValue(newValue: string): void;
    onTodoItemNameSelect(todoItemName: ProductOrName): void;
};

const TodoItemNameSelect = (props: TodoItemNameSelectProps) => {
    const {
        inputValue,
        setInputValue,
        onTodoItemNameSelect,
        options,
        open,
        setOpen,
    } = props;
    const loading = open && props.loading;

    const onOptionSelect = (selectedItem: TodoItemNameItem | string | null) => {
        if (!selectedItem) {
            return;
        }

        if ((selectedItem as TodoItemNameItem).todoItemName) {
            const selectedOption = selectedItem as TodoItemNameItem;
            onTodoItemNameSelect({
                productName: selectedOption.todoItemName,
                product: selectedOption.product
            });
        } else {
            const itemName = selectedItem as string;
            onTodoItemNameSelect({ productName: itemName, product: undefined });
        }
    };

    const onInputChange = (value: string) => {
        setInputValue(value);
        onOptionSelect(value);
    };

    return (
        <Autocomplete
            noOptionsText="No suggestions"
            open={open}
            inputValue={inputValue}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            // disable autocomplete filter
            filterOptions={(loadedOptions) => loadedOptions}
            getOptionSelected={(option, selectedValue) => (
                option.label === selectedValue.label
            )}
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => {
                onOptionSelect(newValue);
            }}
            onInputChange={(event, value) => {
                onInputChange(value);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="medium"
                    placeholder="What to buy?"
                    variant="standard"
                    margin="none"
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default TodoItemNameSelect;
