/* eslint-disable class-methods-use-this */
import ProductFormData from "../components/product-form/types";
import Category from "../entity/category";
import Product from "../entity/Product";
import LocalDB from "./LocalDB";
import CategoryLocalDB from "./persistance/local-db-category";

interface ProductApi {
    getProducts(): Promise<Product[]>;
    /**
     * @deprecated Use createNewProduct method with ProductFormData argument instead
     */
    saveProduct(product: Product): Promise<Product>;
    createNewProduct(productFormData: ProductFormData): Promise<Product>;
    updateProduct(product: Product): Promise<void>;
    changeCategory(product: Product, category: Category | null): Promise<void>;
    findBy(generalName: string): Promise<Product[]>;
    findMatchingBy(query: string): Promise<Product[]>;
    findByBarcode(barcode: string, barcodeType: string): Promise<Product | null>;
    findGeneralNamesBy(query: string): Promise<string[]>;
}

class MockedProductApi implements ProductApi {
    productCache: Product[];

    constructor() {
        this.productCache = [];
    }

    async findGeneralNamesBy(query: string): Promise<string[]> {
        const matchingProducts = await LocalDB.findByGeneralNameOrFullName(query);
        return matchingProducts.map((product) => product.productGeneralName)
            .slice(0, 5);
    }

    findMatchingBy(query: string): Promise<Product[]> {
        return LocalDB.findByGeneralNameOrFullName(query);
    }

    findBy(generalName: string): Promise<Product[]> {
        return LocalDB.findProductsBy(generalName);
    }

    async findByBarcode(barcode: string, barcodeType: string): Promise<Product | null> {
        const products = await LocalDB.loadProducts();
        const product = products.find(
            (cachedProducts) => cachedProducts.productBarcode === barcode
                && cachedProducts.productBarcodeType === barcodeType,
        );
        return product || null;
    }

    async getProducts(): Promise<Product[]> {
        return LocalDB.loadProducts();
    }

    async saveProduct(product: Product): Promise<Product> {
        return LocalDB.saveProduct(product);
    }

    async createNewProduct(productFormData: ProductFormData): Promise<Product> {
        const {
            generalName,
            barcode,
            barcodeType,
            fullName,
            companyName,
            country,
        } = productFormData;
        const product = new Product(generalName, barcode, barcodeType);
        product.productFullName = fullName;
        product.productCompanyName = companyName;
        product.productCountry = country;
        return LocalDB.saveProduct(product);
    }

    async updateProduct(product: Product): Promise<void> {
        await LocalDB.replaceProduct(product);
    }

    async changeCategory(product: Product, category: Category | null): Promise<void> {
        if (category === null) {
            await CategoryLocalDB.removeCategory(product);
        } else {
            await CategoryLocalDB.changeCategory(product, category);
        }
    }
}

export default new MockedProductApi() as ProductApi;
