import PriceData from "../../entity/PriceData";
import Product from "../../entity/Product";

export class ProductPriceData {
    latestPrice: number;
    perCounterpartyPrice: {[id: string]: PriceData};

    constructor () {
        this.latestPrice = 0;
        this.perCounterpartyPrice = {};
    }

    setCounterpartyPrice(counterparty: string, priceData: PriceData) {
        this.perCounterpartyPrice[counterparty] = priceData;
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
    priceData: ProductPriceData;

    constructor (id: number, generalName: string) {
        this.id = id;
        this.generalName = generalName;
        this.quantity = 1;
        this.isBought = false;
        this.priceData = new ProductPriceData();
    }

    static fromProduct(product: Product, quantity?: number): TodoItem {
        let todoItem = new TodoItem(Date.now(), product.productGeneralName);

        todoItem.quantity = quantity? quantity : 1;
        todoItem.targetProduct = product;
        todoItem.isBought = false;
        return todoItem;
    }

    static from(json: any): TodoItem {
        let todoItem = new TodoItem(json.id, json.generalName);

        todoItem.quantity = json.quantity;
        todoItem.targetProduct = Product.from(json.targetProduct);
        todoItem.isBought = json.isBought;
        return todoItem;
    }
}

export default TodoItem;
