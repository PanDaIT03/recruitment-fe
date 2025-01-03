export interface IFunctionalItem {
  id: number;
  title: string;
  code: string;
}

export type IFunctional = IPaginatedData<IFunctionalItem[]>;
