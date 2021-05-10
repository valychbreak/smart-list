import { Button } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import Category from "../../entity/category";
import CategorySelect from "../category-selector/category-select";
import { Store } from "../todo-item-list/types";
import ExportItem from "./export-item";

type ExportItemFormFields = {
    category: Category | null;
    purchasedPrice: string;
    store: Store | null;
};

export type ExportItemFormSubmitData = {
    category: Category;
    purchasedPrice: number;
    store: Store | null;
};

type ExportItemEditFormProps = {
    exportItem: ExportItem | null;
    onSubmit: (formData: ExportItemFormSubmitData) => void;
};

const ExportItemEditForm = (props: ExportItemEditFormProps) => {
    const { exportItem } = props;
    const { register, handleSubmit, control } = useForm<ExportItemFormFields>({
        defaultValues: {
            category: exportItem?.category,
            purchasedPrice: exportItem?.purchasedPrice?.toString(),
            store: null,
        },
    });

    const submitExportItemEditData = (formData: ExportItemFormFields) => {
        if (formData.category === null || formData.purchasedPrice.length === 0) {
            return;
        }

        props.onSubmit({
            category: formData.category,
            purchasedPrice: parseFloat(formData.purchasedPrice),
            store: null,
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
            <br />
            <input name="purchasedPrice" type="number" step=".01" ref={register({ required: true })}/> PLN
            <br />
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default ExportItemEditForm;
