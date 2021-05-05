import TodoItem from "./types";

describe("Class & Types tests", () => {
    describe("TodoItem", () => {
        it("should convert from JSON", () => {
            const json: any = "{\"id\":1618351366915,\"generalName\":\"Bread\",\"quantity\":3,\"targetProduct\":{\"id\":1,\"productGeneralName\":\"Bread\",\"productBarcode\":\"5900864782829\",\"productBarcodeType\":\"ean_13\",\"productFullName\":\"Chleb PANO Tost PELNOZIARNISTY\",\"image\":null,\"category\":{\"id\":1617823031644,\"name\":\"groceries\"}},\"isBought\":true}";
            const todoItem = TodoItem.from(JSON.parse(json));

            expect(todoItem.generalName).toEqual("Bread");
            expect(todoItem.quantity).toEqual(3);
            expect(todoItem.targetProduct).not.toBeNull();
        });

        it("should convert from JSON without product", () => {
            const json: any = "{\"id\":1618351366915,\"generalName\":\"Bread\",\"quantity\":3,\"isBought\":true}";
            const todoItem = TodoItem.from(JSON.parse(json));

            expect(todoItem.generalName).toEqual("Bread");
            expect(todoItem.quantity).toEqual(3);
            expect(todoItem.targetProduct).not.toBeNull();
        });
    });
});
