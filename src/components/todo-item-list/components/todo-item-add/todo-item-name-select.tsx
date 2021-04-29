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
    const loading = open && options.length === 0 && inputValue.length > 0;

    const onOptionSelect = (selectedItem: TodoItemNameItem | null) => {
        if (!selectedItem) {
            return;
        }

        onTodoItemNameSelect(selectedItem.todoItemName);
    };

    return (
        <Autocomplete
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
                setInputValue(value);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="medium"
                    placeholder="Type few letters..."
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
