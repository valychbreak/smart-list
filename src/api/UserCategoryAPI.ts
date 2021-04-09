import Category from "../entity/category";
import Product from "../entity/Product";
import CategoryLocalDB from "./persistance/local-db-category"

interface UserCategoryAPI {
    changeCategory(product: Product, category: Category): Promise<void>;
    fetchProductCategory(product: Product): Promise<Category | null>;
    fetchCategoriesBy(name: string): Promise<Category[]>;
}

class MockedUserCategoryAPI implements UserCategoryAPI {
    changeCategory(product: Product, category: Category): Promise<void> {
        return CategoryLocalDB.changeCategory(product, category);
    }

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

export default new MockedUserCategoryAPI;