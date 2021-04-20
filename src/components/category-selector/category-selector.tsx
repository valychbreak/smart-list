import React, { useState } from "react";
import { OptionsType } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import UserCategoryAPI from "../../api/UserCategoryAPI";
import Category from "../../entity/category";

type CategorySelectItem = {
    label: string,
    category: Category;
};

interface CategorySelectorProps {
    defaultCategory?: Category | undefined | null;
    onCategorySelect(category: Category | null): void;
}

function toCategorySelectItem(category: Category): CategorySelectItem {
    return { label: category.name, category };
}

const CategorySelector = React.forwardRef<any, CategorySelectorProps>((
    props: CategorySelectorProps, ref: React.ForwardedRef<any>,
) => {
    const [selectedCategory, setSelectedCategory] = useState<CategorySelectItem | null>(
        props.defaultCategory ? toCategorySelectItem(props.defaultCategory) : null,
    );

    const onInputValueChange = async (value: string): Promise<OptionsType<CategorySelectItem>> => {
        const matchedCategories = await UserCategoryAPI.fetchCategoriesBy(value);
        return matchedCategories.map((category) => ({ label: category.name, category }));
    };

    const onCategorySelect = (
        selectedCategoryItem: CategorySelectItem | OptionsType<CategorySelectItem> | null,
    ) => {
        if (selectedCategoryItem) {
            setSelectedCategory(selectedCategoryItem as CategorySelectItem);
            props.onCategorySelect((selectedCategoryItem as CategorySelectItem).category);
        } else {
            setSelectedCategory(null);
            props.onCategorySelect(null);
        }
    };

    const onCategoryCreate = (inputValue: string) => {
        const categoryItem: CategorySelectItem = {
            label: inputValue,
            category: new Category(0, inputValue),
        };
        setSelectedCategory(categoryItem);
        props.onCategorySelect(categoryItem.category);
    };

    return (<>
        <AsyncCreatableSelect loadOptions={onInputValueChange}
            onChange={onCategorySelect}
            onCreateOption={onCategoryCreate}
            value={selectedCategory}
            isMulti={false}
            ref={ref}/>
    </>);
});

export default CategorySelector;
