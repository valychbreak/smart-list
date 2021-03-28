import { useContext, useReducer, useState } from "react";
import COUNTERPARTY_LIST from "../../../api/Constants";
import PriceData from "../../../entity/PriceData";
import TodoItemListContext from "../context/TodoItemListContext";
import TodoItem from "../../../components/todo-item-list/types";


interface TodoListItemViewProps {
    item: TodoItem; 
    showPurchaseAction: boolean;
    onTodoItemPurchaseToggle(todoItem: TodoItem, isBought: boolean): void;
}

const TodoListItemView = (props: TodoListItemViewProps) => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [isPurchased, setIsPurchased] = useState(false);

    const todoItemListProvider = useContext(TodoItemListContext);

    function togglePurchase(toggle: boolean) {
        setIsPurchased(toggle);
        todoItemListProvider.toggleItemPurchased(props.item, toggle);

        props.onTodoItemPurchaseToggle(props.item, toggle);
    }

    const increaseQuantity = () => {
        const { item } = props;
        todoItemListProvider.updateItemQuantity(item, item.quantity + 1);
        forceUpdate();
    }

    const decreaseQuantity = () => {
        const { item } = props;

        if (item.quantity > 1) {
            todoItemListProvider.updateItemQuantity(item, item.quantity - 1);
            forceUpdate();
        }
    }

    return (
        <tr>
            <td hidden={!props.showPurchaseAction}>
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
                <button onClick={increaseQuantity}>+</button>
                <label htmlFor={props.item.id.toString()}>
                    {props.item.quantity}
                </label>
                <button onClick={decreaseQuantity}>-</button>
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
