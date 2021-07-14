import React, { useMemo } from "react";
import UserCategoryAPI from "../../api/UserCategoryAPI";
import Category from "../../entity/category";
import { AsyncAutocomplete, useAsyncAutocompleteController } from "../async-autocomplete";

export type CategoryOption = {
    label: string;
    inputValue?: string;
    category?: Category;
};

type CategorySelectProps = {
    category: Category | null;
    label?: string;
    onCategoryChange(category: Category | null): void;
    onCategoryCreate(inputValue: string): void;
};

function toOption(category: Category): CategoryOption {
    return { label: category.name, category };
}

const loadOptions = async (value: string): Promise<CategoryOption[]> => {
    const matchedCategories = await UserCategoryAPI.fetchCategoriesBy(value);
    const options = matchedCategories.map((category) => toOption(category));
    options.push({ label: `Create "${value}" category`, inputValue: value });
    return options;
};

const CategorySelect = (props: CategorySelectProps) => {
    const {
        loading,
        inputValue,
        options,
        setInputValue,
    } = useAsyncAutocompleteController<CategoryOption>({ loadOptions });

    const onCategorySelect = (selectedCategoryItem: CategoryOption | null) => {
        if (selectedCategoryItem) {
            const { category } = selectedCategoryItem;
            const manualInput = selectedCategoryItem.inputValue;
            if (category) {
                props.onCategoryChange(category);
            } else if (manualInput) {
                props.onCategoryCreate(manualInput);
            } else {
                throw new Error("category and manualInput are null");
            }
        } else {
            props.onCategoryChange(null);
        }
    };

    const selectedOption: CategoryOption | null = useMemo(() => (
        props.category ? toOption(props.category) : null
    ), [props.category]);

    return (
        <AsyncAutocomplete
            freeSolo
            label={props.label}
            placeholder="Select category..."
            value={selectedOption}
            loading={loading}
            inputValue={inputValue}
            setInputValue={setInputValue}
            options={options}
            onChange={onCategorySelect}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) => option.label === value.label}
        />
    );
};

export default CategorySelect;
