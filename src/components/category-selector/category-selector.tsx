import React, { useState } from "react";
import { ActionMeta, OptionsType } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import UserCategoryAPI from "../../api/UserCategoryAPI";
import Category from "../../entity/category";

type CategorySelectItem = {
    label: string,
    category: Category;
}

interface CategorySelectorProps {
    defaultCategory?: Category | undefined | null;
    onCategorySelect(category: Category | null): void;
}

function toCategorySelectItem(category: Category): CategorySelectItem {
    return { label: category.name, category }
}

const CategorySelector = React.forwardRef<any, CategorySelectorProps>((props: CategorySelectorProps, ref: React.ForwardedRef<any>) => {

    const [selectedCategory, setSelectedCategory] = useState<CategorySelectItem | null>(
        props.defaultCategory ? toCategorySelectItem(props.defaultCategory) : null
    );

    const onInputValueChange = async (value: string): Promise<OptionsType<CategorySelectItem>> => {
        const matchedCategories = await UserCategoryAPI.fetchCategoriesBy(value);
        return matchedCategories.map(category => {return {label: category.name, category: category}})
    }

    const onCategorySelect = (selectedCategory: CategorySelectItem | OptionsType<CategorySelectItem> | null, action: ActionMeta<CategorySelectItem>) => {
        if (selectedCategory) {
            setSelectedCategory(selectedCategory as CategorySelectItem);
            props.onCategorySelect((selectedCategory as CategorySelectItem).category);
        } else {
            setSelectedCategory(null);
            props.onCategorySelect(null);
        }
    }

    const onCategoryCreate = (inputValue: string) => {
        const categoryItem: CategorySelectItem = { label: inputValue, category: new Category(0, inputValue) };
        setSelectedCategory(categoryItem);
        props.onCategorySelect(categoryItem.category);
    }

    return (<>
        <AsyncCreatableSelect loadOptions={onInputValueChange}
                              onChange={onCategorySelect}
                              onCreateOption={onCategoryCreate}
                              value={selectedCategory}
                              isMulti={false}
                              ref={ref}/>
    </>)
});

export default CategorySelector;