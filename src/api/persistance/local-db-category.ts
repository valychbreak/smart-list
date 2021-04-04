import Category from "../../entity/category";
import Product from "../../entity/Product";
import CategoryPersistance from "./category-persistance";


const CATEGORIES_KEY = 'productCategories';

class CategoryLocalDB {
    private _categoriesCache: CategoryPersistance[] = [];

    async findCategoriesBy(name: string): Promise<Category[]> {
        await this.initCategoriesCacheIfNeeded();

        const foundCategories = this._categoriesCache.filter(category => category.name.toLowerCase().includes(name.toLowerCase()));
        return foundCategories.filter((category, idx) => foundCategories.indexOf(category) === idx);
    }

    async changeCategory(product: Product, category: Category): Promise<void> {
        await this.initCategoriesCacheIfNeeded();

        const username = this.getUsername();
        const existingCategory = this.findCategory(product);

        if (existingCategory) {
            this._categoriesCache = this._categoriesCache.map(categoryPeristance => {
                if (categoryPeristance.id === existingCategory.id) {
                    return CategoryPersistance.from(existingCategory.id, category.name, existingCategory.productBarcode, existingCategory.username)
                } else {
                    return categoryPeristance;
                }
            });
        } else {
            const newCategory = CategoryPersistance.from(Date.now(), category.name, product.productBarcode, username);
            this._categoriesCache.push(newCategory);
        }

        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this._categoriesCache));
    }

    async findCategoryFor(product: Product): Promise<CategoryPersistance | null> {
        await this.initCategoriesCacheIfNeeded();

        const existingCategory = this.findCategory(product);
        return existingCategory ? existingCategory : null;
    }

    private findCategory(product: Product) {
        const username = this.getUsername();
        const existingCategory = this._categoriesCache.find(categoryPersistance => {
            return categoryPersistance.productBarcode === product.productBarcode
                && categoryPersistance.username === username;
        });
        return existingCategory;
    }

    private getUsername(): string {
        throw new Error("Not implemented");
        //return "test";
    }

    private async initCategoriesCacheIfNeeded() {
        if (this._categoriesCache.length === 0) {
            let storedCategories = localStorage.getItem(CATEGORIES_KEY);
            if (storedCategories !== null) {
                try {
                    for (let categoryJson of JSON.parse(storedCategories)) {
                        let parsedCategory = CategoryPersistance.fromJson(categoryJson);
                        this._categoriesCache.push(parsedCategory);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            
        }
    }
}

export default new CategoryLocalDB();
