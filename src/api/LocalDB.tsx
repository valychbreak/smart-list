/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import axios from "axios";
import ProductPriceEntry from "../entity/ProductPriceEntry";
import Product from "../entity/Product";
import TodoItem from "../components/todo-item-list/types";
import CategoryLocalDB from "./persistance/local-db-category";
import Category from "../entity/category";

const PRODUCTS_KEY = "products";
const PRODUCTS_PRICES_KEY = "productPrices";
const TODO_PRODUCT_ITEMS_KEY = "todoProductItems";

class LocalDB {
    private productCache: Product[];

    private priceEntriesCache: ProductPriceEntry[];

    private todoProductItemsCache: TodoItem[];

    constructor() {
        this.productCache = [];
        this.priceEntriesCache = [];
        this.todoProductItemsCache = [];
    }

    async loadProducts(): Promise<Product[]> {
        await this.initCacheIfNeeded();

        return [...this.productCache];
    }

    async saveProduct(product: Product): Promise<Product> {
        await this.initCacheIfNeeded();

        return new Promise((resolve, reject) => {
            if (this.containsProduct(this.productCache, product)) {
                return reject(new Error("Product already exists in db"));
            }

            product.id = this.productCache.length + 1;
            this.productCache.push(product);

            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this.productCache));
            return resolve(product);
        });
    }

    async findProductsBy(generalName: string): Promise<Product[]> {
        await this.initCacheIfNeeded();

        const matchingName = generalName.toLocaleLowerCase();
        return this.productCache.filter(
            (product) => product.productGeneralName.toLocaleLowerCase() === matchingName,
        );
    }

    async findByGeneralNameOrFullName(query: string): Promise<Product[]> {
        await this.initCacheIfNeeded();

        const lowerCaseQuery = query.toLowerCase();
        return this.productCache.filter(
            (product) => product.productGeneralName.toLowerCase().includes(lowerCaseQuery)
                       || (product.productFullName
                           && product.productFullName.toLowerCase().includes(lowerCaseQuery)),
        );
    }

    async saveNewPriceEntry(productPriceEntry: ProductPriceEntry): Promise<ProductPriceEntry> {
        await this.initPriceEntriesCacheIfNeeded();

        return new Promise((resolve) => {
            this.priceEntriesCache.push(productPriceEntry);
            localStorage.setItem(PRODUCTS_PRICES_KEY, JSON.stringify(this.priceEntriesCache));
            return resolve(productPriceEntry);
        });
    }

    async fetchLatestPriceEntry(product: Product): Promise<ProductPriceEntry | null> {
        await this.initPriceEntriesCacheIfNeeded();

        return new Promise((resolve) => {
            const productPriceEntries = this.priceEntriesCache
                .filter((entry) => entry.barcode === product.productBarcode);

            return resolve(this.getLatestEntry(productPriceEntries));
        });
    }

    async fetchLatestPriceEntryBy(product: Product, counterparty: string): Promise<ProductPriceEntry | null> {
        await this.initPriceEntriesCacheIfNeeded();

        return new Promise((resolve) => {
            const productPriceEntries = this.priceEntriesCache.filter((entry) => entry.barcode === product.productBarcode && entry.counterparty === counterparty);

            return resolve(this.getLatestEntry(productPriceEntries));
        });
    }

    async loadTodoProductItems(): Promise<TodoItem[]> {
        await this.initTodoProductItemsCache();

        return [...this.todoProductItemsCache];
    }

    async saveTodoProductItem(todoItem: TodoItem): Promise<void> {
        await this.initTodoProductItemsCache();

        this.todoProductItemsCache.push(todoItem);
        localStorage.setItem(TODO_PRODUCT_ITEMS_KEY, JSON.stringify(this.todoProductItemsCache));
    }

    async removeTodoProductItem(todoItemRemove: TodoItem): Promise<TodoItem> {
        await this.initTodoProductItemsCache();

        this.todoProductItemsCache = this.todoProductItemsCache.filter((todoItem) => todoItem.id !== todoItemRemove.id);
        localStorage.setItem(TODO_PRODUCT_ITEMS_KEY, JSON.stringify(this.todoProductItemsCache));
        return todoItemRemove;
    }

    async updateTodoProductItem(todoItem: TodoItem): Promise<void> {
        await this.initTodoProductItemsCache();

        this.todoProductItemsCache = this.todoProductItemsCache.map((cachedItem) => (cachedItem.id === todoItem.id ? todoItem : cachedItem));
        localStorage.setItem(TODO_PRODUCT_ITEMS_KEY, JSON.stringify(this.todoProductItemsCache));
    }

    async clearTodoProductItems(): Promise<void> {
        await this.initTodoProductItemsCache();

        this.todoProductItemsCache = [];
        localStorage.setItem(TODO_PRODUCT_ITEMS_KEY, JSON.stringify(this.todoProductItemsCache));
    }

    private async initTodoProductItemsCache(): Promise<void> {
        if (this.todoProductItemsCache.length === 0) {
            const storedTodoItemsJson = localStorage.getItem(TODO_PRODUCT_ITEMS_KEY);
            const parsedTodoItems: TodoItem[] = [];

            if (storedTodoItemsJson != null) {
                try {
                    for (const todoItemJson of JSON.parse(storedTodoItemsJson)) {
                        const parsedTodoItem = TodoItem.from(todoItemJson);
                        const todoItemProduct = parsedTodoItem.targetProduct;

                        if (todoItemProduct) {
                            await this.enrichProduct(todoItemProduct);
                        }

                        parsedTodoItems.push(parsedTodoItem);
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            this.todoProductItemsCache = parsedTodoItems;
        }
    }

    private getLatestEntry(priceEntries: ProductPriceEntry[]): ProductPriceEntry | null {
        if (priceEntries.length === 0) {
            return null;
        }
        const latestEntry = priceEntries.reduce((prev: ProductPriceEntry, current: ProductPriceEntry) => (prev.date.getTime() > current.date.getTime() ? prev : current));
        return latestEntry;
    }

    private async initPriceEntriesCacheIfNeeded(): Promise<void> {
        if (this.priceEntriesCache.length === 0) {
            const storedPricesJson = localStorage.getItem(PRODUCTS_PRICES_KEY);
            const storedPriceEntries = [];

            if (storedPricesJson != null) {
                try {
                    for (const storedPrice of JSON.parse(storedPricesJson)) {
                        const parsedPriceEntry = new ProductPriceEntry(storedPrice.barcode, parseFloat(storedPrice.price), storedPrice.counterparty, new Date(storedPrice.date));
                        storedPriceEntries.push(parsedPriceEntry);
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            this.priceEntriesCache = storedPriceEntries;
        }
    }

    private async initCacheIfNeeded(): Promise<void> {
        if (this.productCache.length === 0) {
            const defaultProducts = await this.loadDefaultProducts();
            const storedProducts = localStorage.getItem(PRODUCTS_KEY);

            if (storedProducts == null) {
                this.productCache = defaultProducts;
            } else {
                const combinedProducts = defaultProducts;

                try {
                    for (const storedProduct of JSON.parse(storedProducts)) {
                        const parsedProduct = this.toProduct(storedProduct);
                        if (!this.containsProduct(combinedProducts, parsedProduct)) {
                            await this.enrichProduct(parsedProduct);
                            combinedProducts.push(parsedProduct);
                        }
                    }

                    this.productCache = combinedProducts;
                } catch (err) {
                    console.error(err);
                    this.productCache = defaultProducts;
                }
            }

            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this.productCache));
        }
    }

    private async enrichProduct(product: Product) {
        const productCategory = await CategoryLocalDB.findCategoryFor(product);
        if (productCategory != null) {
            product.category = new Category(productCategory.id, productCategory.name);
        }
    }

    private async loadDefaultProducts(): Promise<Product[]> {
        const response = await axios.get("products.json");
        const fetchedData = response.data;
        const products: Product[] = [];

        for (const productJson of fetchedData) {
            const parsedProduct = this.toProduct(productJson);
            products.push(parsedProduct);
        }

        return products;
    }

    private containsProduct(products: Product[], product: Product): boolean {
        for (const existingProduct of products) {
            if (existingProduct.productBarcode === product.productBarcode) {
                return true;
            }
        }
        return false;
    }

    private toProduct(productJson: any) {
        return Product.from(productJson);
    }
}

export default new LocalDB();
