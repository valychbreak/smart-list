class Page<T> {
    readonly items: T[];

    readonly itemsPerPage: number;

    readonly totalPages: number;

    readonly totalResults: number;

    constructor(items: T[], itemsPerPage: number, totalPages: number, totalResults: number) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
    }
}

export default Page;
