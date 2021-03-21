import { useContext, useEffect, useState } from "react";
import COUNTERPARTY_LIST from "../../../api/Constants";
import ProductPriceApi from "../../../api/ProductPriceApi";
import PriceData from "../../../entity/PriceData";
import TodoItemListContext from "../context/TodoItemListContext";
import TodoItem from "./TodoItem";

const TodoListItemView = (props: {item: TodoItem}) => {

    const [isPurchased, setIsPurchased] = useState(false);

    const todoItemListProvider = useContext(TodoItemListContext);

    function togglePurchase(toggle: boolean) {
        setIsPurchased(toggle);
        todoItemListProvider.toggleItemPurchased(props.item, toggle);
    }

    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    defaultChecked={isPurchased}
                    onChange={() => togglePurchase(!isPurchased)}
                    id={props.item.id.toString()}
                    name='MyItem'
                />
            </td>
            <td className="ItemName">
                <label htmlFor={props.item.id.toString()}>
                    {props.item.generalName} ({props.item.targetProduct && props.item.targetProduct.productFullName})
                </label>
            </td>
            <td>
                <label htmlFor={props.item.id.toString()}>
                    {props.item.quantity}
                </label>
            </td>
            <td>
                {props.item.priceData.latestPrice}
            </td>
            {COUNTERPARTY_LIST.map((counterparty: string, idx: number) => {
                return <td className="cpty" key={idx}>
                    <CounterpartyPriceView counterparty={counterparty} priceData={props.item.priceData.perCounterpartyPrice} />
                </td>
            })}
            <td>
                <button onClick={() => todoItemListProvider.removeItem(props.item)}>Remove</button>
            </td>
        </tr>
    )
}

interface CounterpartyPriceViewProps {
    counterparty: string;
    priceData: {[id: string]: PriceData};
}

const CounterpartyPriceView = (props: CounterpartyPriceViewProps) => {

    if (props.priceData[props.counterparty]) {
        return <span>{props.priceData[props.counterparty].price} PLN</span>
    } else {
        return <span>No data yet</span>
    }
}


export default TodoListItemView;
