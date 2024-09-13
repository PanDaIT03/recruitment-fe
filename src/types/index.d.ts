interface IBaseResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
