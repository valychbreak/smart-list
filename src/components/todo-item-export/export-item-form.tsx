import { Button, Checkbox, FormControlLabel } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import StoreApi from "../../api/StoreApi";
import Category from "../../entity/category";
import CategorySelect from "../category-selector/category-select";
import StoreSelect from "../store-select";
import { Store } from "../todo-item-list/types";
import ExportItem from "./export-item";

type ExportItemFormFields = {
    category: Category | null;
    purchasedPrice: string;
    store: Store | null;
    applyToProduct: boolean;
};

export type ExportItemFormSubmitData = {
    category: Category;
    purchasedPrice: number;
    store: Store | null;
    applyToProduct: boolean;
};

type ExportItemEditFormProps = {
    exportItem: ExportItem | null;
    onSubmit: (formData: ExportItemFormSubmitData) => void;
};

const ExportItemEditForm = (props: ExportItemEditFormProps) => {
    const { exportItem } = props;
    const defaultStore = exportItem?.purchasedStore;

    const { register, handleSubmit, control } = useForm<ExportItemFormFields>({
        defaultValues: {
            category: exportItem?.category,
            purchasedPrice: exportItem?.purchasedPrice?.toString(),
            store: defaultStore,
            applyToProduct: false
        },
    });

    const [storeList, setStoreList] = useState<Store[]>(defaultStore ? [defaultStore] : []);

    useEffect(() => {
        StoreApi.fetchStores().then((stores) => setStoreList(stores));
    }, []);

    const submitExportItemEditData = (formData: ExportItemFormFields) => {
        if (formData.category === null || formData.purchasedPrice.length === 0) {
            return;
        }

        props.onSubmit({
            category: formData.category,
            purchasedPrice: parseFloat(formData.purchasedPrice),
            store: formData.store,
            applyToProduct: formData.applyToProduct
        });
    };

    return (
        <form onSubmit={handleSubmit(submitExportItemEditData)}>
            <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ onChange, value }) => (
                    <CategorySelect
                        category={value}
                        onCategoryChange={(category) => onChange(category)}
                        onCategoryCreate={(inputValue) => (
                            onChange({ id: -1, name: inputValue } as Category)
                        )}
                    />
                )}
            />
            <Controller
                name="applyToProduct"
                control={control}
                render={({ onChange, value }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={value}
                                onChange={(e) => onChange(e.target.checked)} />
                        }
                        label="Set for product as well"
                    />
                )}
            />
            <br />
            <input name="purchasedPrice" type="number" step=".01" ref={register({ required: true })}/> PLN
            <br />
            <Controller
                name="store"
                control={control}
                rules={{ required: true }}
                render={({ onChange, value }) => (
                    <StoreSelect
                        selectedStore={value}
                        storeList={storeList}
                        onStoreSelect={(store) => onChange(store)}
                    />
                )}
            />
            <br />
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default ExportItemEditForm;
