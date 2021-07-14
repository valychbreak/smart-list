/* eslint-disable class-methods-use-this */
import Category from "../../entity/category";
import Product from "../../entity/Product";
import CategoryPersistance from "./category-persistance";
import localDbUsername from "./local-db-username";

const CATEGORIES_KEY = "productCategories";

class CategoryLocalDB {
    private categoriesCache: CategoryPersistance[] = [];

    async findCategoriesBy(name: string): Promise<Category[]> {
        await this.initCategoriesCacheIfNeeded();

        const username = this.getUsername();
        const foundCategories = this.categoriesCache.filter((category) => (
            category.name.toLowerCase().includes(name.toLowerCase())
                && category.username === username
        ));
        const withoutDuplicates: Category[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const category of foundCategories) {
            const isAdded = withoutDuplicates.find((addedCategory) => (
                addedCategory.name === category.name
            ));

            if (!isAdded) {
                withoutDuplicates.push(category);
            }
        }

        return withoutDuplicates;
    }

    async changeCategory(product: Product, category: Category): Promise<void> {
        await this.initCategoriesCacheIfNeeded();

        const username = this.getUsername();
        const existingCategory = this.findCategory(product);

        if (existingCategory) {
            this.categoriesCache = this.categoriesCache.map((categoryPeristance) => {
                if (categoryPeristance.id === existingCategory.id) {
                    return CategoryPersistance.from(
                        existingCategory.id,
                        category.name,
                        existingCategory.productBarcode,
                        existingCategory.username,
                    );
                }
                return categoryPeristance;
            });
        } else {
            const newCategory = CategoryPersistance.from(
                Date.now(),
                category.name,
                product.productBarcode, username,
            );
            this.categoriesCache.push(newCategory);
        }

        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this.categoriesCache));
    }

    async removeCategory(product: Product) {
        await this.initCategoriesCacheIfNeeded();

        const existingCategory = this.findCategory(product);
        if (!existingCategory) {
            return;
        }

        this.categoriesCache = this.categoriesCache.filter((category) => (
            category.id !== existingCategory.id
        ));

        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this.categoriesCache));
    }

    async findCategoryFor(product: Product): Promise<CategoryPersistance | null> {
        await this.initCategoriesCacheIfNeeded();

        const existingCategory = this.findCategory(product);
        return existingCategory || null;
    }

    private findCategory(product: Product) {
        const username = this.getUsername();
        const existingCategory = this.categoriesCache.find(
            (categoryPersistance) => categoryPersistance.productBarcode === product.productBarcode
                && categoryPersistance.username === username,
        );
        return existingCategory;
    }

    private getUsername(): string {
        return localDbUsername.getUsername();
    }

    private async initCategoriesCacheIfNeeded() {
        if (this.categoriesCache.length === 0) {
            const storedCategories = localStorage.getItem(CATEGORIES_KEY);
            if (storedCategories !== null) {
                try {
                    this.categoriesCache = JSON.parse(storedCategories)
                        .map((categoryJson: any) => CategoryPersistance.fromJson(categoryJson));
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(error);
                }
            }
        }
    }
}

export default new CategoryLocalDB();
