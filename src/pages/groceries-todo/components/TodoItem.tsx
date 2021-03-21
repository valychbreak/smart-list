import PriceData from "../../../entity/PriceData";
import Product from "../../../entity/Product";

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

    incrementQuantity() {
        this.quantity ++;
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity --;
        }
    }
}

export default TodoItem;
