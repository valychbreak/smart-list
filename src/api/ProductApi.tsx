/* eslint-disable class-methods-use-this */
import ProductFormData from "../components/product-form/types";
import Category from "../entity/category";
import Product from "../entity/Product";
import Page from "../entity/page";
import LocalDB from "./LocalDB";
import CategoryLocalDB from "./persistance/local-db-category";
import compressImage from "./utils/image-compression-utils";

interface ProductApi {
    getProducts(page?: number, itemsPerPage?: number): Promise<Page<Product>>;
    /**
     * @deprecated Use createNewProduct method with ProductFormData argument instead
     */
    saveProduct(product: Product): Promise<Product>;
    createNewProduct(productFormData: ProductFormData): Promise<Product>;
    updateProduct(product: Product, productImage?: File): Promise<void>;
    changeCategory(product: Product, category: Category | null): Promise<void>;
    findBy(generalName: string): Promise<Product[]>;
    findMatchingBy(query: string): Promise<Product[]>;
    searchProductBy(query: string, page: number, perPage?: number): Promise<Page<Product>>;
    findByBarcode(barcode: string, barcodeType: string): Promise<Product | null>;
    findGeneralNamesBy(query: string): Promise<string[]>;
}

function getPaged(page: number, perPage: number, products: Product[]) {
    const indexStart = (page - 1) * perPage;
    const indexEnd = page * perPage;
    const totalPages = Math.ceil(products.length / perPage);
    const totalResults = products.length;

    return new Page(
        products.slice(indexStart, indexEnd),
        perPage,
        totalPages,
        totalResults
    );
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

    async findMatchingBy(query: string): Promise<Product[]> {
        const searchResult = await this.searchProductBy(query, 1);
        return searchResult.items;
    }

    async searchProductBy(
        query: string,
        page: number,
        perPage: number = 10
    ): Promise<Page<Product>> {
        if (page < 1) {
            throw Error("page cannot be less than 1");
        }

        const foundProducts = await LocalDB.findByGeneralNameOrFullName(query);
        return getPaged(page, perPage, foundProducts);
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

    async getProducts(page: number = 1, itemsPerPage: number = 10): Promise<Page<Product>> {
        const allProducts = await LocalDB.loadProducts();
        return getPaged(page, itemsPerPage, allProducts);
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

    async updateProduct(product: Product, productImage?: File): Promise<void> {
        let base64Image: string;

        if (productImage) {
            base64Image = await compressImage(URL.createObjectURL(productImage), "image/jpeg");
            // eslint-disable-next-line no-param-reassign
            product.image = base64Image;
        }
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
