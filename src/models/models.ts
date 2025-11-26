export interface UserPayload {
  id: string;
  email?: string;
}

// declare module "jsonwebtoken" {
//   interface JwtPayload {
//     user: UserPayload;
//   }
// }

export enum MailSubjects {}

export type Sort = "asc" | "desc";

export enum SortType {
  ASC = "asc",
  DESC = "desc",
}

export enum SortByType {
  CREATED_AT = "createdAt",
  POPULARITY = "popularity",
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
