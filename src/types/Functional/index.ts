export interface IFunctionalItem {
  id: number;
  title: string;
  code: string;
  createAt: string;
  updateAt: string;
  creator: {
    id: number;
    fullName: string;
  };
  updater: {
    id: number;
    fullName: string;
  };
}

export type IFunctional = IPaginatedData<IFunctionalItem[]>;
