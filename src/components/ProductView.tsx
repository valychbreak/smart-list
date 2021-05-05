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
    if (!props.priceData[props.counterparty]) {
        return <li> {props.counterparty} - No data yet</li>;
    }

    return <li> {props.counterparty} - {props.priceData[props.counterparty].price} PLN</li>;
};

interface ProductViewPros {
    product: Product;
}

interface PriceData {
    price: number;
}

const ProductView = (props: ProductViewPros) => {
    const [latestPrice, setLatestPrice] = useState(0);

    const [priceData, setPriceData] = useState<{ [id: string]: PriceData }>({});
    const [storeList, setStoreList] = useState<Store[]>([]);

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

    return (<>
        <ul>
            <li>General name: {props.product.productGeneralName}</li>
            <li>Full name: {props.product.productFullName}</li>
            <li>Barcode: {props.product.productBarcode} | {props.product.productBarcodeType}</li>
            <li><ProductCategorySelector product={props.product} /></li>
            <li>Release country: {props.product.productCountry}</li>
            <li>Release company: {props.product.productCompanyName}</li>
            <li>Latest price: {latestPrice}</li>
            <li>
                Price per counterparty:
                <ul>
                    {storeList.map((store: Store) => (
                        <CounterpartyPriceView
                            key={store.id}
                            counterparty={store.name}
                            priceData={priceData} />
                    ))}
                </ul>
            </li>
            <li>Image: TODO</li>
        </ul>
        <hr />
    </>);
};

export default ProductView;
