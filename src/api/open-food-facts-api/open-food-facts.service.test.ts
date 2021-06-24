import { mocked } from "ts-jest/utils";
import OpenFoodFactsApi from "./open-food-facts.api";
import openFoodFactsService from "./open-food-facts.service";

jest.mock("./open-food-facts.api");

const OpenFoodFactsApiMocked = mocked(OpenFoodFactsApi, true);

const barcode = "5901234567890";

function mockApiResponse(
    productName: string,
    brand: string,
    quantity: string,
    imageUrl: string
) {
    OpenFoodFactsApiMocked.findProductByBarcode.mockResolvedValue({
        productName,
        brand,
        quantity,
        productBarcode: barcode,
        imageUrl,
    });
}

describe("OpenFoodFactsService", () => {
    describe("fetchProduct", () => {
        it.each`
            productName      | brand          | quantity | expectedName
            ${"Coca-cola"}   | ${"Coca Cola"} | ${"1L"}  | ${"Coca-cola 1L - Coca Cola"}
            ${"Coca-cola"}   | ${"Coca Cola"} | ${""}  | ${"Coca-cola - Coca Cola"}
            ${""}            | ${"Coca Cola"} | ${"1L"}  | ${"Coca Cola - 1L"}
            ${""}            | ${""}          | ${"1L"}  | ${null}
            ${""}            | ${""}          | ${""}    | ${null}
        `("should build name from product name, quantity and brand ($productName, $brand, $quantity)", async ({ productName, brand, quantity, expectedName }) => {
            // given
            mockApiResponse(productName, brand, quantity, "image-url");

            // when
            const productDetails = await openFoodFactsService.fetchProduct(barcode);

            // then
            expect(productDetails?.name).toBe(expectedName);
        });

        it("should populate company name, image url and barcode", async () => {
            // given
            mockApiResponse("Milk Natural 1L", "Milky Way", "1L", "https://image-url.com");

            // when
            const productDetails = await openFoodFactsService.fetchProduct(barcode);

            // then
            expect(productDetails?.barcode).toBe(barcode);
            expect(productDetails?.company).toBe("Milky Way");
            expect(productDetails?.imageUrl).toBe("https://image-url.com");
        });

        it.each`
            brand        | imageUrl 
            ${""}        | ${""}
            ${undefined} | ${undefined}
            
        `("should set company name and image url to null when empty", async ({ brand, imageUrl }) => {
            // given
            mockApiResponse("Product name", brand, "1L", imageUrl);

            // when
            const productDetails = await openFoodFactsService.fetchProduct(barcode);

            // then
            expect(productDetails?.company).toBe(null);
            expect(productDetails?.imageUrl).toBe(null);
        });
    });
});
