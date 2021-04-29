import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

export type TodoItemNameItem = {
    label: string;
    todoItemName: string;
};

type TodoItemNameSelectProps = {
    open: boolean;
    inputValue: string;
    options: TodoItemNameItem[];
    loading: boolean;
    setOpen(isOpened: boolean): void;
    setInputValue(newValue: string): void;
    onTodoItemNameSelect(todoItemName: string): void;
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
            const { todoItemName } = selectedItem as TodoItemNameItem;
            onTodoItemNameSelect(todoItemName);
        } else {
            onTodoItemNameSelect(selectedItem as string);
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
