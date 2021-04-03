
export default class CategoryPersistance {
    readonly id: number;
    readonly name: string;
    readonly productBarcode: string;
    readonly username: string;

    private constructor(id: number, name: string, productBarcode: string, username: string) {
        this.id = id;
        this.name = name;
        this.productBarcode = productBarcode;
        this.username = username;
    }

    public static from(id: number, name: string, productBarcode: string, username: string): CategoryPersistance {
        return new CategoryPersistance(id, name, productBarcode, username);
    }

    public static fromJson(categoryJson: any) {
        return new CategoryPersistance(categoryJson.id, categoryJson.name, categoryJson.productBarcode, categoryJson.username);
    }
}
