import { useState } from "react";
import UserCategoryAPI from "../../api/UserCategoryAPI";
import Category from "../../entity/category";
import AsyncAutocomplete from "./async-autocomplete";

export type CategoryOption = {
    label: string;
    inputValue?: string;
    category?: Category;
};

type CategorySelectProps = {
    defaultCategory?: Category | undefined | null;
    category: Category | null;
    onCategoryChange(category: Category | null): void;
    onCategoryCreate(inputValue: string): void;
};

function toOption(category: Category): CategoryOption {
    return { label: category.name, category };
}

const CategorySelect = (props: CategorySelectProps) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<CategoryOption[]>([]);

    const loadOptions = async (value: string): Promise<CategoryOption[]> => {
        const matchedCategories = await UserCategoryAPI.fetchCategoriesBy(value);
        return matchedCategories.map((category) => toOption(category));
    };

    const onCategorySelect = (
        selectedCategoryItem: CategoryOption | null,
    ) => {
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

    return (
        <AsyncAutocomplete
            loading={false}
            setLoading={() => {}}
            inputValue={inputValue}
            setInputValue={setInputValue}
            options={options}
            setOptions={setOptions}
            loadOptions={loadOptions}
            onChange={onCategorySelect}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) => option.label === value.label}
        />
    );
};

export default CategorySelect;
