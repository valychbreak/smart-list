/* eslint-disable class-methods-use-this */
import axios from "axios";

type OpenFoodFactsResponse = {
    productName: string;
    productBarcode: string;
    brand: string;
    quantity: string;
    imageUrl: string;
};

class OpenFoodFactsApi {
    async findProductByBarcode(barcode: string): Promise<OpenFoodFactsResponse | null> {
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "SmartList - Web - Version 0.1 - to-be-added.com"
            }
        };

        let url = `https://pl.openfoodfacts.org/api/v0/product/${barcode}.json`;
        if (process.env.REACT_APP_FAKE_OPEN_FOOD_FACTS_API === "true") {
            url = "openfoodfacts_response_pringles.json";
        }

        const response = await axios.get(url, config);
        if (response.status === 200) {
            if (response.data.status_verbose === "product found") {
                const { product } = response.data;
                return {
                    productName: product.product_name,
                    productBarcode: product.code,
                    brand: product.brands,
                    quantity: product.quantity,
                    imageUrl: product.image_url
                };
            }
        }
        return null;
    }
}

export default new OpenFoodFactsApi();
