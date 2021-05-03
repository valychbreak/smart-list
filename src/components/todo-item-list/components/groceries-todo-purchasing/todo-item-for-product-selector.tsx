import { Button, FormGroup, Grid, Link, makeStyles, Select, Typography } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import TodoItem from "../../types";

type FormFields = {
    todoItemId: number;
};

type SelectTodoItemForProductProps = {
    barcodeScanResult?: BarcodeScanResult;
    todoItems: TodoItem[];
    onTodoItemSubmit(todoItem: TodoItem): void;
};

const useStyles = makeStyles((theme) => ({
    formButtons: {
        paddingTop: theme.spacing(1)
    }
}));

const SelectTodoItemForProduct = (props: SelectTodoItemForProductProps) => {
    const { todoItems } = props;

    const { handleSubmit, control } = useForm<FormFields>();
    const history = useHistory();

    const classes = useStyles();

    const onSubmit = (formData: FormFields) => {
        const todoItem = todoItems.find(
            (item) => item.id === formData.todoItemId
        );
        if (!todoItem) {
            return;
        }

        props.onTodoItemSubmit(todoItem);
    };

    const redirectToAddNewProduct = () => {
        history.push("/new-product");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="inherit">
                Select item from the list that you want to link scanned product
                to:
            </Typography>
            <FormGroup>
                <Controller
                    name="todoItemId"
                    as={Select}
                    defaultValue={0}
                    control={control}
                >
                    <MenuItem value={0}>Please select...</MenuItem>

                    {todoItems.map((todoItem) => (
                        <MenuItem key={todoItem.id} value={todoItem.id}>
                            {todoItem.generalName}
                        </MenuItem>
                    ))}
                </Controller>
            </FormGroup>

            <Grid spacing={1} alignItems="center" className={classes.formButtons} container>
                <Grid item>
                    <Button variant="contained" type="submit" data-test-id="product-todo-item-submit-btn">
                        Submit
                    </Button>
                </Grid>
                <Grid item>or</Grid>
                <Grid item>
                    <Link onClick={() => redirectToAddNewProduct()} data-test-id="create-new-product-btn">
                        Add new product
                    </Link>
                </Grid>
            </Grid>
        </form>
    );
};

export default SelectTodoItemForProduct;
