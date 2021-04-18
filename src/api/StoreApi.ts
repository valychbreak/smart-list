import { Store } from "../components/todo-item-list/types";


interface StoreApi {
    fetchStores(): Promise<Store[]>;
}


const storeNamesList = [
    "Auchan",
    "Lidl",
    "Biedronka",
    "Carrefour",
    "Lewiatan",
    "Zabka",
    "Groszek",
    "Piotr i Paweł",
    "Spar"
];

const defaultStores = storeNamesList.map((storeName, index) => new Store(index, storeName));

class MockedStoreApi implements StoreApi {
    fetchStores(): Promise<Store[]> {
        return Promise.resolve(defaultStores);
    }
}

export default new MockedStoreApi();