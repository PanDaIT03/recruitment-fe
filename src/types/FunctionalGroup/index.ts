import { IFunctionalItem } from '../Functional';

export interface IFunctionalGroupItem {
  id: number;
  createBy: number;
  createAt: string;
  updateBy: number;
  updateAt: string;
  title: string;
  description: string;
  functionals: IFunctionalItem[];
}

export type IPaginationFunctionalGroup = IPaginatedData<IFunctionalGroupItem[]>;
