/* eslint-disable max-classes-per-file */
import Product from "../../entity/Product";

export class Store {
    readonly id: number;

    readonly name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromJson(json: any): Store {
        const { id, name } = json;
        return new Store(id, name);
    }
}

class TodoItem {
    id: number;

    generalName: string;

    quantity: number;

    targetProduct: Product | null;

    isBought: boolean;

    readonly productPrice: number | null;

    readonly purchasedPrice: number | null;

    private purchasedStoreInternal: Store | null;

    constructor(
        id: number,
        generalName: string,
        quantity: number,
        targetProduct: Product | null,
        isBought: boolean,
        productPrice: number | null,
        purchasedPrice: number | null,
        purchasedStore: Store | null
    ) {
        this.id = id;
        this.generalName = generalName;
        this.quantity = quantity;
        this.targetProduct = targetProduct;
        this.isBought = isBought;
        this.productPrice = productPrice;
        this.purchasedPrice = purchasedPrice;
        this.purchasedStoreInternal = purchasedStore;
    }

    static createTodoItem(
        id: number,
        generalName: string,
        productPrice: number | null = null
    ) {
        return new TodoItem(
            id,
            generalName,
            1,
            null,
            false,
            productPrice,
            null,
            null
        );
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
        const {
            id,
            generalName,
            quantity,
            targetProduct,
            isBought,
            purchasedPrice,
            purchasedStoreInternal,
        } = json;

        let product = null;
        if (targetProduct) {
            product = Product.from(targetProduct);
        }

        let loadedStore = null;
        if (purchasedStoreInternal) {
            loadedStore = Store.fromJson(purchasedStoreInternal);
        }

        return new TodoItem(
            id,
            generalName,
            quantity,
            product,
            isBought,
            null,
            purchasedPrice,
            loadedStore
        );
    }

    setProductPrice(newPrice: number | null): TodoItem {
        const todoItem = new TodoItem(
            this.id,
            this.generalName,
            this.quantity,
            this.targetProduct,
            this.isBought,
            newPrice,
            this.purchasedPrice,
            this.purchasedStoreInternal
        );
        return todoItem;
    }

    setTargetProduct(product: Product | null): TodoItem {
        const todoItem = new TodoItem(
            this.id,
            this.generalName,
            this.quantity,
            product,
            this.isBought,
            this.productPrice,
            this.purchasedPrice,
            this.purchasedStoreInternal
        );
        return todoItem;
    }

    setPurchasedPrice(newPrice: number | null): TodoItem {
        const todoItem = new TodoItem(
            this.id,
            this.generalName,
            this.quantity,
            this.targetProduct,
            this.isBought,
            this.productPrice,
            newPrice,
            this.purchasedStoreInternal
        );
        todoItem.targetProduct = this.targetProduct;
        return todoItem;
    }

    setPurchasedStore(store: Store | null): TodoItem {
        const todoItem = this.clone();
        todoItem.purchasedStoreInternal = store;
        return todoItem;
    }

    get purchasedStore(): Store | null {
        return this.purchasedStoreInternal;
    }

    private clone() {
        return new TodoItem(
            this.id,
            this.generalName,
            this.quantity,
            this.targetProduct,
            this.isBought,
            this.productPrice,
            this.purchasedPrice,
            this.purchasedStoreInternal
        );
    }
}

export default TodoItem;
