type NullableNumber = Nullable<number>;

interface IBaseResponse<T = undefined> {
  data?: T;
  message: string;
  statusCode: number;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface IPaginatedData<T> {
  pageInfo: PageInfo;
  items: T;
}
