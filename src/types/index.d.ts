interface IBaseResponse<T = undefined> {
  data?: T;
  message: string;
  statusCode: number;
}

interface IPaginatedData<T> {
  pageInfo: PageInfo
  items: T;
}