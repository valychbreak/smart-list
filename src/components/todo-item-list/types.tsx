/* eslint-disable max-classes-per-file */
import PriceData from "../../entity/PriceData";
import Product from "../../entity/Product";

export class ProductPriceData {
    latestPrice: number;

    private perCounterpartyPrice: Map<string, PriceData>;

    constructor() {
        this.latestPrice = 0;
        this.perCounterpartyPrice = new Map();
    }

    getCounterpartyPrice(counterparty: string): PriceData | undefined {
        return this.perCounterpartyPrice.get(counterparty);
    }

    setCounterpartyPrice(counterparty: string, priceData: PriceData) {
        this.perCounterpartyPrice.set(counterparty, priceData);
    }
}

export class Store {
    readonly id: number;

    readonly name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

class TodoItem {
    id: number;

    generalName: string;

    quantity: number;

    targetProduct?: Product;

    isBought: boolean;

    readonly productPrice: number | null;

    constructor(
        id: number,
        generalName: string,
        quantity: number,
        isBought: boolean,
        productPrice: number | null
    ) {
        this.id = id;
        this.generalName = generalName;
        this.quantity = quantity;
        this.isBought = isBought;
        this.productPrice = productPrice;
    }

    static createTodoItem(id: number, generalName: string, productPrice: number | null = null) {
        return new TodoItem(id, generalName, 1, false, productPrice);
    }

    static fromProduct(product: Product, quantity?: number): TodoItem {
        const todoItem = this.createTodoItem(
            Date.now(),
            product.productGeneralName
        );

        todoItem.quantity = quantity || 1;
        todoItem.targetProduct = product;
        todoItem.isBought = false;
        return todoItem;
    }

    static fromName(name: string, quantity: number): TodoItem {
        const todoItem = this.createTodoItem(Date.now(), name);
        todoItem.quantity = quantity;
        todoItem.isBought = false;
        return todoItem;
    }

    static from(json: any): TodoItem {
        const todoItem = this.createTodoItem(json.id, json.generalName);

        todoItem.quantity = json.quantity;
        if (json.targetProduct) {
            todoItem.targetProduct = Product.from(json.targetProduct);
        }
        todoItem.isBought = json.isBought;
        return todoItem;
    }

    setProductPrice(newPrice: number | null): TodoItem {
        return { ...this, productPrice: newPrice };
    }

    setTargetProduct(product: Product | null): TodoItem {
        return { ...this, targetProduct: product };
    }
}

export default TodoItem;
