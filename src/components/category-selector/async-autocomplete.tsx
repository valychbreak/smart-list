import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect } from "react";

interface AsyncAutocompleteProps<T> {
    loading: boolean;
    setLoading(isLoading: boolean): void;

    inputValue: string;
    setInputValue(value: string): void;
    onChange(option: T | null): void;
    loadOptions(inputValue: string): Promise<T[]>;
    options: T[];
    setOptions(options: T[]): void;
    getOptionLabel(option: T): string;
    getOptionSelected(option: T, value: T): boolean;

}

function AsyncAutocomplete<T>(props: AsyncAutocompleteProps<T>) {
    const { loading, options, inputValue, setInputValue, onChange, setLoading,
        setOptions, loadOptions, getOptionLabel, getOptionSelected } = props;

    const clear = () => {
        setInputValue("");
        // setOpen(false);
        setLoading(false);
        setOptions([]);
    };

    useEffect(() => {
        if (inputValue === "") {
            clear();
            return undefined;
        }

        let active = true;
        setLoading(true);

        loadOptions(inputValue)
            .then((loadedOptions) => {
                setOptions(loadedOptions);
            })
            .catch(() => { setOptions([]); })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, [inputValue]);

    return (<>
        {/* <AsyncCreatableSelect loadOptions={onInputValueChange}
            onChange={onCategorySelect}
            onCreateOption={onCategoryCreate}
            value={selectedCategory}
            isMulti={false}
            ref={ref}/> */}
        <Autocomplete
            noOptionsText="No suggestions"
            inputValue={inputValue}
            onInputChange={(event, value) => setInputValue(value)}
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
    </>);
}

export default AsyncAutocomplete;
