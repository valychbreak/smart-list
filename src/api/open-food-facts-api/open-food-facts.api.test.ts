import axios from "axios";
import { mocked } from "ts-jest/utils";
import openFoodFactsApi from "./open-food-facts.api";

jest.mock("axios");

const axiosMocked = mocked(axios, true);

describe("OpenFoodFactsAPI", () => {
    describe("findProductByBarcode", () => {
        it("should call endpoint with barcode and with content-type and user-agent headers", async () => {
            // given
            axiosMocked.get.mockResolvedValue([]);

            // when
            await openFoodFactsApi.findProductByBarcode("5901234567890");

            // then

            const expectedConfig = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent":
                        "SmartList - Web - Version 0.1 - to-be-added.com",
                },
            };

            expect(axios.get).toHaveBeenCalledWith(
                "https://pl.openfoodfacts.org/api/v0/product/5901234567890.json",
                expectedConfig
            );
        });

        it("should parse result", async () => {
            // given
            const responseData = {
                product: {
                    product_name: "Coca-Cola Zero",
                    code: "5000112519945",
                    brands: "Coca Cola",
                    quantity: "330 ml",
                    image_url: "https://image-url.com/",
                },
                status: 1,
                status_verbose: "product found",
            };

            axiosMocked.get.mockResolvedValue({
                status: 200,
                data: responseData,
            });

            // when
            const result = await openFoodFactsApi.findProductByBarcode(
                "5901234567890"
            );

            // then
            const { product } = responseData;
            expect(result?.productName).toBe(product.product_name);
            expect(result?.productBarcode).toBe(product.code);
            expect(result?.brand).toBe(product.brands);
            expect(result?.quantity).toBe(product.quantity);
            expect(result?.imageUrl).toBe(product.image_url);
        });

        it("should return null when product not found", async () => {
            // given
            const responseData = {
                status: 0,
                status_verbose: "product not found",
            };

            axiosMocked.get.mockResolvedValue({
                status: 200,
                data: responseData,
            });

            // when
            const result = await openFoodFactsApi.findProductByBarcode(
                "5901234567890"
            );

            // then
            expect(result).toBe(null);
        });

        it("should return null when server is down", async () => {
            // given
            axiosMocked.get.mockResolvedValue({
                status: 500
            });

            // when
            const result = await openFoodFactsApi.findProductByBarcode(
                "5901234567890"
            );

            // then
            expect(result).toBe(null);
        });
    });
});
