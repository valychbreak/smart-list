import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

interface AsyncAutocompleteProps<T> {
    value: T | null;

    loading: boolean;
    inputValue: string;
    options: T[];

    freeSolo?: boolean | undefined;
    placeholder?: string;

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
        freeSolo,
        placeholder,
        setInputValue,
        onChange,
        getOptionLabel,
        getOptionSelected,
    } = props;

    return (
        <>
            <Autocomplete
                freeSolo={freeSolo}
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
                    if (typeof option !== "string") {
                        onChange(option);
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="medium"
                        placeholder={placeholder}
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
