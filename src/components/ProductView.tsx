import { useEffect, useState } from "react";
import COUNTERPARTY_LIST from "../api/Constants";
import ProductPriceApi from "../api/ProductPriceApi";
import Product from "../entity/Product";

interface ProductViewPros {
    product: Product;
}

interface PriceData {
    price: number;
}

const ProductView = (props: ProductViewPros) => {
    const [latestPrice, setLatestPrice] = useState(0);

    const [priceData, setPriceData] = useState<{[id: string]: PriceData}>({});

    useEffect(() => {
        ProductPriceApi.fetchLatestPrice(props.product).then((entry) => {
            if (entry) {
                setLatestPrice(entry.price);
            }
        });

        COUNTERPARTY_LIST.forEach(counterparty => {
            ProductPriceApi.fetchLatestPrice(props.product, counterparty)
                .then(priceEntry => {
                    if (priceEntry) {
                        priceData[counterparty] = {price: priceEntry.price}
                        setPriceData({...priceData});
                    }
                })
        })
      }, []);

    return (<>
        <ul>
            <li>General name: {props.product.productGeneralName}</li>
            <li>Full name: {props.product.productFullName}</li>
            <li>Barcode: {props.product.productBarcode} | {props.product.productBarcodeType}</li>
            <li>Release country: {props.product.productCountry}</li>
            <li>Release company: {props.product.productCompanyName}</li>
            <li>Latest price: {latestPrice}</li>
            <li>
                Price per counterparty: 
                {COUNTERPARTY_LIST.map((counterparty: string, idx: number) => {
                    return <CounterpartyPriceView key={idx} counterparty={counterparty} priceData={priceData} />
                })}
            </li>
            <li>Image: TODO</li>
        </ul>
        <hr />
    </>)
}

interface CounterpartyPriceViewProps {
    counterparty: string;
    priceData: {[id: string]: PriceData};
}

const CounterpartyPriceView = (props: CounterpartyPriceViewProps) => {

    if (props.priceData[props.counterparty]) {
        return <span> {props.counterparty} - {props.priceData[props.counterparty].price} PLN |</span>
    } else {
        return <span> {props.counterparty} - No data yet |</span>
    }
}

export default ProductView;
