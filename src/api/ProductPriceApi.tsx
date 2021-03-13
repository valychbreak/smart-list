import ProductPriceEntry from "../components/ProductPriceEntry";
import Product from "../entity/Product";
import LocalDB from "./LocalDB";

interface ProductPriceApi {
    addPriceEntry(product: Product, productPriceEntry: ProductPriceEntry): Promise<ProductPriceEntry>;
    fetchLatestPrice(product: Product, counterparty: string): Promise<ProductPriceEntry | null>;
    fetchLatestPrice(product: Product): Promise<ProductPriceEntry | null>;
}

class MockedProductPriceApi implements ProductPriceApi {

    addPriceEntry(product: Product, productPriceEntry: ProductPriceEntry): Promise<ProductPriceEntry> {
        return LocalDB.saveNewPriceEntry(productPriceEntry);
    }

    fetchLatestPrice(product: Product, counterparty?: string): Promise<ProductPriceEntry | null> {
        if (counterparty) {
            return LocalDB.fetchLatestPriceEntryBy(product, counterparty);
        } else {
            return LocalDB.fetchLatestPriceEntry(product);
        }
    }

}

export default new MockedProductPriceApi();
