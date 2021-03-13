import React, { useEffect, useState } from "react";
import remove from './icons/remove.jfif';
import add from './icons/add2.png';
import space from './icons/space.jfif';
import scan from './icons/scan.png';
import './GroceriesTodoPage.css'
import ProductApi from "../../api/ProductApi";
import TodoItem from "./components/TodoItem";
import TodoListView from "./components/TodoListView";
import TodoItemListContext from "./context/TodoItemListContext";
import ProductPriceApi from "../../api/ProductPriceApi";
import COUNTERPARTY_LIST from "../../api/Constants";
import PriceData from "../../entity/PriceData";


class ProductPriceData {
    latestPrice: number;
    perCounterpartyPrice: {[id: string]: PriceData};

    constructor () {
        this.latestPrice = 0;
        this.perCounterpartyPrice = {};
    }
}

const GroceriesTodoPage = (props: any) => {

    const [items, setItems] = useState<TodoItem[]>([]);
    const [text, setText] = useState('');
    const [text2, setText2] = useState('1');

    function handleChange(e: any) {
        setText(e.target.value)
    }

    function handleChange2(e: any) {
        setText2(e.target.value)
    }


    function handleSubmit(e: any) {
        e.preventDefault();
        if (text.length === 0) {
            return;
        }
        
        ProductApi.findBy(text).then(products => {
            let newItem: TodoItem;
            if (products.length === 0) {
                newItem = new TodoItem(Date.now(), text);
                newItem.quantity = parseInt(text2);
                addItem(newItem);
            } else {
                let targetProduct = products[0];
                
                newItem = new TodoItem(Date.now(), text);
                newItem.quantity = parseInt(text2);
                newItem.targetProduct = targetProduct;
                addItem(newItem);
            }
        });
    }

    function addItem(item: TodoItem) {
        if (item.targetProduct) {
            let latestPricePromise = ProductPriceApi.fetchLatestPrice(item.targetProduct).then((entry) => {
                if (entry) {
                    item.priceData.latestPrice = entry.price;
                }
            });

            let counterpartyPriceFetchList = [latestPricePromise];

            COUNTERPARTY_LIST.forEach(counterparty => {
                if (item.targetProduct) {
                    let fetchPromise = ProductPriceApi.fetchLatestPrice(item.targetProduct, counterparty)
                        .then(priceEntry => {
                            if (priceEntry) {
                                item.priceData.setCounterpartyPrice(counterparty, {price: priceEntry.price});
                            }
                        })
                    counterpartyPriceFetchList.push(fetchPromise);
                }
            });

            Promise.all(counterpartyPriceFetchList).then(_ => {
                setItems(items.concat(item));
            });
        }
    }

    function removeItem(removeItem: TodoItem) {
        setItems(items.filter(item => item.id !== removeItem.id));
    }

    return (
        <fieldset>
            <legend>Purchase list</legend>
            <div>
                <TodoItemListContext.Provider value={{todoItems: items, addItem: addItem, removeItem: removeItem}}>
                    <TodoListView />
                </TodoItemListContext.Provider>
                <hr />
                <table>
                    <tbody>
                        <tr>
                            <td className="T_action_button">
                                <div className="center">
                                    <input type="checkbox" id="show" className="scan_chk" />
                                    <label htmlFor="show" className="show-btn">
                                        <img src={scan} alt="remove" className="icon_scan" />
                                    </label>
                                    <div className="container">
                                        <label htmlFor="show" className="close-btn fas fa-times" title="close">
                                            <img src={remove} alt="remove" className="icons" />
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td colSpan={2}>

                                <form onSubmit={handleSubmit} className="MyForm">
                                    <div>
                                        <div className="Iname">
                                            <input
                                                id="new-todo"
                                                onChange={handleChange}
                                                value={text}
                                            />
                                        </div>
                                        <div className="quantity">
                                            <input
                                                id="quantity"
                                                onChange={handleChange2}
                                                value={text2}
                                            />
                                        </div>
                                        <div className="btn">
                                            <button>
                                                Add #{items.length + 1}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                            </td>
                            <td colSpan={3}>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className="myBTN">
                                    <button>Purchase mode</button>
                                </div>
                                <div className="myBTN">
                                    <button>Export to csv</button>
                                </div>
                            </td>
                            <td className="cpty">
                                [total_sum]
                            </td>
                            <td className="cpty">
                                [total_sum]
                            </td>
                            <td className="cpty">
                                [total_sum]
                            </td>
                            <td className="T_action_button">
                                <img src={space} alt="remove" className="icons" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </fieldset>
    );
}


export default GroceriesTodoPage;
