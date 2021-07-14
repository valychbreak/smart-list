/* eslint-disable class-methods-use-this */
import Category from "../entity/category";
import Product from "../entity/Product";
import CategoryLocalDB from "./persistance/local-db-category";

interface UserCategoryAPI {
    fetchProductCategory(product: Product): Promise<Category | null>;
    fetchCategoriesBy(name: string): Promise<Category[]>;
}

class MockedUserCategoryAPI implements UserCategoryAPI {
    async fetchProductCategory(product: Product): Promise<Category | null> {
        const persistedCategory = await CategoryLocalDB.findCategoryFor(product);
        if (persistedCategory === null) {
            return null;
        }

        return new Category(persistedCategory.id, persistedCategory.name);
    }

    fetchCategoriesBy(name: string): Promise<Category[]> {
        return CategoryLocalDB.findCategoriesBy(name);
    }
}

export default new MockedUserCategoryAPI();
