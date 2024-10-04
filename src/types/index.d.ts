interface IBaseResponse<T = undefined> {
  data?: T;
  message: string;
  statusCode: number;
}
