import React, { useState } from "react";
import remove from './remove.jfif';
import add from './add2.png';
import space from './space.jfif';
import scan from './scan.png';
import './GroceriesTodoPage.css'
import ProductApi from "../../api/ProductApi";
import ProductPriceApi from "../../api/ProductPriceApi";
import Product from "../../entity/Product";

class TodoItem {
    id: number;
    generalName: string;
    quantity: number;
    targetProduct?: Product;

    constructor (id: number, generalName: string) {
        this.id = id;
        this.generalName = generalName;
        this.quantity = 1;
    }
}

const COUNTERPARTY_LIST = ["Biedronka", "Auchan", "Carrefour", "Lidl"];

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
                setItems(items.concat(newItem));
            } else {
                let targetProduct = products[0];
                
                newItem = new TodoItem(Date.now(), text);
                newItem.quantity = parseInt(text2);
                newItem.targetProduct = targetProduct;
                setItems(items.concat(newItem));
            }
        });
    }

    return (
        <fieldset>
            <legend>Purchase list</legend>
            <div>
                <TodoList items={items} />
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

class TodoList extends React.Component<{items: TodoItem[]}, any> {
    render() {

        return (
            <table>
                <thead>
                    <tr className="cpty">
                        <td className="T_action_button">
                            Purchased
                        </td>
                        <td>
                            Item list
                        </td>
                        <td>
                            Quantity
                        </td>
                        <td className="cpty">
                            Auchan
                            <img src={remove} alt="remove" className="icons" />
                        </td>
                        <td className="cpty">
                            Lidl
                            <img src={remove} alt="remove" className="icons" />
                        </td>
                        <td className="cpty">
                            Biedronka
                            <img src={remove} alt="remove" className="icons" />
                        </td>
                        <td className="T_action_button">
                            <img src={add} alt="remove" className="icons" />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {this.props.items.map((item: TodoItem, idx: number) => (
                        <tr key={idx}>
                            <td>
                                <input
                                    type="checkbox"
                                    id={item.id.toString()}
                                    name='MyItem'
                                />
                            </td>
                            <td className="ItemName">
                                <label htmlFor={item.id.toString()}>
                                    {item.generalName} {item.targetProduct && item.targetProduct.productFullName}
                                </label>
                            </td>
                            <td>
                                <label htmlFor={item.id.toString()}>
                                    {item.quantity}
                                </label>
                            </td>
                            <td>
                                [A_price]
                            </td>
                            <td>
                                [L_price]
                            </td>
                            <td>
                                [B_price]
                            </td>
                            <td>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        );
    }
}

export default GroceriesTodoPage;
