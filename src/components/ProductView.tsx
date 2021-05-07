import { Box, Button, Card, CardActions, CardContent, Chip, Grid, makeStyles, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import ProductPriceApi from "../api/ProductPriceApi";
import StoreApi from "../api/StoreApi";
import UserCategoryAPI from "../api/UserCategoryAPI";
import Category from "../entity/category";
import Product from "../entity/Product";
import CategorySelect from "./category-selector/category-select";
import { Store } from "./todo-item-list/types";

const ProductCategorySelector = (props: { product: Product }) => {
    const forceUpdate = useReducer((x) => x + 1, 0)[1];

    const { product } = props;

    const onCategorySelect = (category: Category | null) => {
        product.category = category;

        if (category === null) {
            UserCategoryAPI.removeCategory(product);
            return;
        }
        UserCategoryAPI.changeCategory(product, category);
    };

    const onCategoryCreate = (inputValue: string) => {
        onCategorySelect(new Category(Date.now(), inputValue));
        // workaround to "update" Autocomplete value from "Create ... category" to category name
        forceUpdate();
    };

    return (
        <CategorySelect
            category={product.category}
            onCategoryChange={(category) => onCategorySelect(category)}
            onCategoryCreate={onCategoryCreate} />
    );
};

interface CounterpartyPriceViewProps {
    counterparty: string;
    priceData: { [id: string]: PriceData };
}

const CounterpartyPriceView = (props: CounterpartyPriceViewProps) => {
    let priceLabel = `${props.counterparty}: -`;
    if (!props.priceData[props.counterparty]) {
        priceLabel = `${props.counterparty}: -`;
    } else {
        priceLabel = `${props.counterparty}: ${props.priceData[props.counterparty].price.toFixed(2)}`;
    }

    return (
        <Tooltip title="Latest price" aria-label="add">
            <Chip size="small" label={priceLabel} />
        </Tooltip>
    );
};

interface ProductViewPros {
    product: Product;
    onPriceEntryClick(): void;
}

interface PriceData {
    price: number;
}

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(1),
    }
}));

const ProductView = (props: ProductViewPros) => {
    const classes = useStyles();

    const [latestPrice, setLatestPrice] = useState(0);

    const [priceData, setPriceData] = useState<{ [id: string]: PriceData }>({});
    const [storeList, setStoreList] = useState<Store[]>([]);

    const { onPriceEntryClick } = props;

    useEffect(() => {
        ProductPriceApi.fetchLatestPrice(props.product)
            .then((entry) => {
                if (entry) {
                    setLatestPrice(entry.price);
                }
            });

        StoreApi.fetchStores()
            .then((stores) => setStoreList(stores));
    }, []);

    useEffect(() => {
        storeList.forEach((store) => {
            ProductPriceApi.fetchLatestPrice(props.product, store.name)
                .then((priceEntry) => {
                    if (priceEntry) {
                        priceData[store.name] = { price: priceEntry.price };
                        setPriceData({ ...priceData });
                    }
                });
        });
    }, [storeList]);

    const subheader = `${props.product.productBarcode} (${props.product.productBarcodeType})`;
    return (<>
        <Card className={classes.card}>
            <CardContent>
                <Box marginBottom={2}>
                    <Typography variant="h5">{props.product.productFullName}</Typography>
                    <Typography color="textSecondary">{subheader}</Typography>
                </Box>
                <Typography>General name: {props.product.productGeneralName}</Typography>
                <Grid spacing={1} alignItems="center" container>
                    <Grid item>
                        Category:
                    </Grid>
                    <Grid item xs={9}>
                        <ProductCategorySelector product={props.product} />
                    </Grid>
                </Grid>
                <Typography>Release country: {props.product.productCountry}</Typography>
                <Typography>Release company: {props.product.productCompanyName}</Typography>
                <Typography>Latest price: {latestPrice}</Typography>
                {storeList.map((store: Store) => (
                    <CounterpartyPriceView
                        key={store.id}
                        counterparty={store.name}
                        priceData={priceData} />
                ))}
            </CardContent>
            <CardActions>
                <Button size="small" variant="outlined" onClick={onPriceEntryClick}>Add price</Button>
            </CardActions>
        </Card>
    </>);
};

export default ProductView;
