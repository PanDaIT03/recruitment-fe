// export interface IFunctionalItem {
//   id: number;
//   title: string;
//   code: string;
// }

export interface IFunctionalItem {
  id: number;
  title: string;
  code: string;
  iconType: string;
  icon: string;
  path: string;
  orderIndex: number;
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
