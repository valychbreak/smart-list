import axios from "axios";
import ProductPriceEntry from "../entity/ProductPriceEntry";
import Product from "../entity/Product";

const PRODUCTS_KEY = 'products';
const PRODUCTS_PRICES_KEY = 'productPrices';


class LocalDB {
    private _productCache: Product[];
    private _priceEntriesCache: ProductPriceEntry[];

    constructor() {
        this._productCache = [];
        this._priceEntriesCache = [];
    }

    async loadProducts(): Promise<Product[]> {
        await this.initCacheIfNeeded();
        
        return this._productCache;
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
        let parsedProduct = new Product(productJson.productGeneralName, productJson.productBarcode, productJson.productBarcodeType);
        
        parsedProduct.id = productJson.id;
        parsedProduct.productFullName = productJson.productFullName;
        parsedProduct.productCompanyName = productJson.productCompanyName;
        parsedProduct.productCountry = productJson.productCountry;

        return parsedProduct;
    }
}

export default new LocalDB();
