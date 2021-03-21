
export default class ProductPriceEntry {
    barcode: string;
    price: number;
    counterparty: string;
    date: Date;

    constructor(barcode: string, price: number, counterparty: string, date: Date) {
        this.barcode = barcode;
        this.price = price;
        this.counterparty = counterparty;
        this.date = date;
    }
}
