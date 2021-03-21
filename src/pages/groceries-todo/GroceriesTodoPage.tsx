import React, { useState } from "react";
import remove from './icons/remove.jfif';
import add from './icons/add2.png';
import space from './icons/space.jfif';
import scan from './icons/scan.png';
import './GroceriesTodoPage.css'
import ProductApi from "../../api/ProductApi";
import TodoItem from "./components/TodoItem";
import TodoListView from "./components/TodoListView";
import TodoItemListContext, { TodoItemListContextType } from "./context/TodoItemListContext";
import { TodoItemListContextProvider } from "./context/TodoItemListContextProvider";
import ProductPriceForm from "../../components/ProductPriceForm";
import ProductPriceEntry from "../../entity/ProductPriceEntry";
import ProductPriceApi from "../../api/ProductPriceApi";
import AsyncSelect from "react-select/async";
import { OptionsType, OptionTypeBase } from "react-select";
import Product from "../../entity/Product";
import { ProductSelect } from "./components/ProductSelect";

const ADDING_ITEMS_MODE = 1;
const PURCHASE_MODE = 2;

const GroceriesTodoPage = (props: any) => {

    const [mode, setMode] = useState(ADDING_ITEMS_MODE);

    const [selectedTagItem, setSelectedTagItem] = useState<Product | null>(null);
    const [newItemQuantity, setNewItemQuantity] = useState('1');

    const [addingPrice, setAddingPrice] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TodoItem>();

    function enablePurchaseMode(e: any) {
        setMode(PURCHASE_MODE);
    }

    function enableAddingItemsMode(e: any) {
        setMode(ADDING_ITEMS_MODE);
    }

    function handleQuantityFieldChange(e: any) {
        setNewItemQuantity(e.target.value)
    }


    function handleSubmit(e: any, context: TodoItemListContextType) {
        e.preventDefault();
        
        if (selectedTagItem) {
            const newItem = new TodoItem(Date.now(), selectedTagItem.productGeneralName);
            newItem.quantity = parseInt(newItemQuantity);
            newItem.targetProduct = selectedTagItem;
            context.addItem(newItem);
        }
    }

    function onItemPurchaseToggle(item: TodoItem, isChecked: boolean) {
        if (isChecked) {
            setSelectedItem(item);
            setAddingPrice(true);
        } else {
            cancelAddingPrice();
        }
    }

    function onPriceEntrySubmit(priceEntry: ProductPriceEntry) {
        setSelectedItem(undefined);
        if (selectedItem?.targetProduct) {
            ProductPriceApi.addPriceEntry(selectedItem.targetProduct, priceEntry)
                .then((priceEntry) => {
                  console.log(priceEntry);
                  setAddingPrice(false);
                });
        }
    }

    function cancelAddingPrice() {
        setSelectedItem(undefined);
        setAddingPrice(false);
    }

    function onTagItemChange(selectedItem: Product | null) {
        setSelectedTagItem(selectedItem);
    }

    return (
        <fieldset>
            <legend>Purchase list</legend>
            <div>
                <TodoItemListContextProvider onItemPurchaseToggle={onItemPurchaseToggle}>
                {addingPrice && 
                    <>
                        <h3>Add price for {selectedItem?.targetProduct?.productFullName}</h3>
                        <button onClick={() => cancelAddingPrice()}>Skip / Cancel</button>
                        <ProductPriceForm targetProduct={selectedItem?.targetProduct} onEntrySubmit={onPriceEntrySubmit}/>
                    </>
                }
                    <TodoListView />
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

                                    <TodoItemListContext.Consumer>
                                        {context => (
                                            <form onSubmit={(e) => handleSubmit(e, context)} className="MyForm">
                                                <div>
                                                    <ProductSelect onProductSelect={onTagItemChange} />
                                                    <div className="quantity">
                                                        <input
                                                            id="quantity"
                                                            onChange={handleQuantityFieldChange}
                                                            value={newItemQuantity}
                                                        />
                                                    </div>
                                                    <div className="btn">
                                                        <button>
                                                            Add #{context.todoItems.length + 1}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </TodoItemListContext.Consumer>

                                </td>
                                <td colSpan={3}>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="myBTN">
                                        {mode === ADDING_ITEMS_MODE && <button onClick={enablePurchaseMode}>Purchase mode</button>}
                                        {mode === PURCHASE_MODE && <button onClick={enableAddingItemsMode}>Exit Purchase mode</button>}
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
                            <tr>
                                <td colSpan={4}>
                                    {mode === ADDING_ITEMS_MODE && <p>You are currently in the list preparation mode. Add items you are planning to buy by scanning barcode or typing Product General Name (e.g. milk, tea, bread).</p>}
                                    {mode === PURCHASE_MODE && <p>You are currently in the purchase mode. Scan or type product's barcode to mark as purchased.</p>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </TodoItemListContextProvider>
            </div>
        </fieldset>
    );
}


export default GroceriesTodoPage;
