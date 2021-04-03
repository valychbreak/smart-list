import axios from "axios";
import ProductPriceEntry from "../entity/ProductPriceEntry";
import Product from "../entity/Product";
import TodoItem from "../components/todo-item-list/types";
import CategoryLocalDB from "./persistance/local-db-category"
import Category from "../entity/category";

const PRODUCTS_KEY = 'products';
const PRODUCTS_PRICES_KEY = 'productPrices';
const TODO_PRODUCT_ITEMS_KEY = 'todoProductItems'


class LocalDB {
    private _productCache: Product[];
    private _priceEntriesCache: ProductPriceEntry[];
    private _todoProductItemsCache: TodoItem[];

    constructor() {
        this._productCache = [];
        this._priceEntriesCache = [];
        this._todoProductItemsCache =[];
    }

    async loadProducts(): Promise<Product[]> {
        await this.initCacheIfNeeded();
        
        return [...this._productCache];
    }

    async saveProduct(product: Product): Promise<Product> {
        await this.initCacheIfNeeded();

        return new Promise((resolve, reject) => {

            if (this.containsProduct(this._productCache, product)) {
                return reject('Product already exists in db');
            }

            product.id = this._productCache.length + 1;
            this._productCache.push(product);

            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this._productCache));
            return resolve(product);
        })
    }

    async findProductsBy(generalName: string): Promise<Product[]> {
        await this.initCacheIfNeeded();

        return this._productCache.filter(
            product => product.productGeneralName.toLocaleLowerCase() === generalName.toLocaleLowerCase()
        );
    }

    async findByGeneralNameOrFullName(query: string): Promise<Product[]> {
        await this.initCacheIfNeeded();

        let lowerCaseQuery = query.toLowerCase();
        return this._productCache.filter(
            product => {
                return product.productGeneralName.toLowerCase().includes(lowerCaseQuery) 
                       || (product.productFullName && product.productFullName.toLowerCase().includes(lowerCaseQuery))
            }
        )
    }

    async saveNewPriceEntry(productPriceEntry: ProductPriceEntry): Promise<ProductPriceEntry> {
        await this.initPriceEntriesCacheIfNeeded();

        return new Promise((resolve, reject) => {
            this._priceEntriesCache.push(productPriceEntry);
            localStorage.setItem(PRODUCTS_PRICES_KEY, JSON.stringify(this._priceEntriesCache));
            return resolve(productPriceEntry);
        });
    }

    async fetchLatestPriceEntry(product: Product): Promise<ProductPriceEntry | null> {
        await this.initPriceEntriesCacheIfNeeded();

        return new Promise((resolve, reject) => {
            let productPriceEntries = this._priceEntriesCache.filter(function (entry) { 
                return entry.barcode === product.productBarcode 
            });
            
            return resolve(this.getLatestEntry(productPriceEntries));
        });
    }

    async fetchLatestPriceEntryBy(product: Product, counterparty: string): Promise<ProductPriceEntry | null> {
        await this.initPriceEntriesCacheIfNeeded();

        return new Promise((resolve, reject) => {
            let productPriceEntries = this._priceEntriesCache.filter(function (entry) { 
                return entry.barcode === product.productBarcode && entry.counterparty === counterparty;
            });
            
            return resolve(this.getLatestEntry(productPriceEntries));
        });
    }

    async loadTodoProductItems(): Promise<TodoItem[]> {
        await this.initTodoProductItemsCache();

        return [...this._todoProductItemsCache];
    }

    async saveTodoProductItem(todoItem: TodoItem): Promise<void> {
        await this.initTodoProductItemsCache();

        this._todoProductItemsCache.push(todoItem);
        localStorage.setItem(TODO_PRODUCT_ITEMS_KEY, JSON.stringify(this._todoProductItemsCache));
    }

    async removeTodoProductItem(todoItemRemove: TodoItem): Promise<TodoItem> {
        await this.initTodoProductItemsCache();

        this._todoProductItemsCache = this._todoProductItemsCache.filter(todoItem => todoItem.id !== todoItemRemove.id);
        localStorage.setItem(TODO_PRODUCT_ITEMS_KEY, JSON.stringify(this._todoProductItemsCache));
        return todoItemRemove;
    }

    async updateTodoProductItem(todoItem: TodoItem): Promise<void> {
        await this.initTodoProductItemsCache();

        this._todoProductItemsCache = this._todoProductItemsCache.map(cachedItem => cachedItem.id === todoItem.id ? todoItem : cachedItem);
        localStorage.setItem(TODO_PRODUCT_ITEMS_KEY, JSON.stringify(this._todoProductItemsCache));
    }

    private async initTodoProductItemsCache(): Promise<void> {
        if (this._todoProductItemsCache.length === 0) {
            let storedTodoItemsJson = localStorage.getItem(TODO_PRODUCT_ITEMS_KEY);
            let parsedTodoItems: TodoItem[] = [];

            if (storedTodoItemsJson != null) {
                try {
                    for (let todoItemJson of JSON.parse(storedTodoItemsJson)) {
                        let parsedTodoItem = TodoItem.from(todoItemJson);
                        parsedTodoItems.push(parsedTodoItem);
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            this._todoProductItemsCache = parsedTodoItems;            
        }
    }

    private getLatestEntry(priceEntries: ProductPriceEntry[]): ProductPriceEntry | null {
        if (priceEntries.length === 0) {
            return null;
        } else {
            let latestEntry = priceEntries.reduce(function (prev: ProductPriceEntry, current: ProductPriceEntry) {
                return prev.date.getTime() > current.date.getTime() ? prev : current;
            });
            return latestEntry;
        }
    }

    private async initPriceEntriesCacheIfNeeded(): Promise<void> {
        if (this._priceEntriesCache.length === 0) {
            let storedPricesJson = localStorage.getItem(PRODUCTS_PRICES_KEY);
            let storedPriceEntries = [];

            if (storedPricesJson != null) {
                try {
                    for (let storedPrice of JSON.parse(storedPricesJson)) {
                        let parsedPriceEntry = new ProductPriceEntry(storedPrice.barcode, storedPrice.price, storedPrice.counterparty, new Date(storedPrice.date));
                        storedPriceEntries.push(parsedPriceEntry);
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            this._priceEntriesCache = storedPriceEntries;
        }
    }

    private async initCacheIfNeeded(): Promise<void> {
        if (this._productCache.length === 0) {
            let defaultProducts = await this.loadDefaultProducts();
            let storedProducts = localStorage.getItem(PRODUCTS_KEY);
        

            if (storedProducts == null) {
                this._productCache = defaultProducts;
            } else {
                let combinedProducts = defaultProducts;

                try {
                    for (let storedProduct of JSON.parse(storedProducts)) {
                        let parsedProduct = this.toProduct(storedProduct);
                        if (!this.containsProduct(combinedProducts, parsedProduct)) {
                            const productCategory = await CategoryLocalDB.findCategoryFor(parsedProduct);
                            if (productCategory != null) {
                                parsedProduct.category = new Category(productCategory.id, productCategory.name);
                            }
                            combinedProducts.push(parsedProduct);
                        }
                    }

                    this._productCache = combinedProducts;
                } catch (err) {
                    console.error(err);
                    this._productCache = defaultProducts;
                }
                
            }

            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this._productCache));
        }
    }

    private async loadDefaultProducts(): Promise<Product[]> {
        const response = await axios.get('products.json');
        let fetchedData = response.data;
        let products: Product[] = [];

        for (let productJson of fetchedData) {
            let parsedProduct = this.toProduct(productJson);
            products.push(parsedProduct);
        }

        return products;
    }

    private containsProduct(products: Product[], product: Product): boolean {
        for (let existingProduct of products) {
            if (existingProduct.productBarcode == product.productBarcode) {
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
