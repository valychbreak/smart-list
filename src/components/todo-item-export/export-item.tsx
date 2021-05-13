import Category from "../../entity/category";
import Product from "../../entity/Product";
import TodoItem, { Store } from "../todo-item-list/types";

class ExportItem extends TodoItem {
    readonly category: Category | null;

    constructor(
        id: number,
        generalName: string,
        quantity: number,
        isBought: boolean,
        productPrice: number | null,
        purchasedPrice: number | null,
        purchasedStore: Store | null,
        category: Category | null,
        targetProduct: Product | null
    ) {
        super(
            id,
            generalName,
            quantity,
            targetProduct,
            isBought,
            productPrice,
            purchasedPrice,
            purchasedStore
        );

        this.category = category;
    }

    static fromTodoItem(todoItem: TodoItem): ExportItem {
        const product = todoItem.targetProduct || null;
        const category = product?.category || null;
        return new ExportItem(
            todoItem.id,
            todoItem.generalName,
            todoItem.quantity,
            todoItem.isBought,
            todoItem.productPrice,
            todoItem.purchasedPrice,
            todoItem.purchasedStore,
            category,
            product
        );
    }
}

export default ExportItem;
