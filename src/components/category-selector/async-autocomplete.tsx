import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

interface AsyncAutocompleteProps<T> {
    value: T | null;

    loading: boolean;
    inputValue: string;
    options: T[];

    setInputValue(value: string): void;
    onChange(option: T | null): void;

    getOptionLabel(option: T): string;
    getOptionSelected(option: T, value: T): boolean;
}

function AsyncAutocomplete<T>(props: AsyncAutocompleteProps<T>) {
    const {
        value,
        loading,
        options,
        inputValue,
        setInputValue,
        onChange,
        getOptionLabel,
        getOptionSelected,
    } = props;

    return (
        <>
            <Autocomplete
                value={value}
                noOptionsText="No suggestions"
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                options={options}
                getOptionSelected={getOptionSelected}
                getOptionLabel={getOptionLabel}
                onChange={(event, option) => {
                    onChange(option);
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
        </>
    );
}

export default AsyncAutocomplete;
