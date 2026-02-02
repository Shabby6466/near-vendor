export interface UserPayload {
    id: string;
    email?: string;
}
export declare enum MailSubjects {
}
export type Sort = "asc" | "desc";
export declare enum SortType {
    ASC = "asc",
    DESC = "desc"
}
export declare enum SortByType {
    CREATED_AT = "createdAt",
    POPULARITY = "popularity"
}
export interface ApiQueryFilters<SortBy = string> {
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    sort?: Sort;
    count?: number;
    data?: any;
    filterBy?: string | string[] | string[][];
    filter?: string;
}
