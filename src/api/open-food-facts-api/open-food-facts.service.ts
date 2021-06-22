/* eslint-disable class-methods-use-this */
import openFoodFactsApi from "./open-food-facts.api";

export type ProductDetails = {
    name: string | null;
    barcode: string | null;
    company: string | null;
    imageUrl: string | null;
};

class OpenFoodFactsService {
    async fetchProduct(barcode: string): Promise<ProductDetails | null> {
        const response = await openFoodFactsApi.findProductByBarcode(barcode);

        let productName = null;
        if (response?.productName && response.brand && response.quantity) {
            productName = `${response.productName} ${response.quantity} - ${response.brand}`;
        } else if (response?.productName && response.brand) {
            productName = `${response.productName} - ${response.brand}`;
        } else if (response?.brand && response.quantity) {
            productName = `${response.brand} - ${response.quantity}`;
        }

        return {
            name: productName,
            barcode: response?.productBarcode || null,
            company: response?.brand || null,
            imageUrl: response?.imageUrl || null,
        };
    }
}

export default new OpenFoodFactsService();
