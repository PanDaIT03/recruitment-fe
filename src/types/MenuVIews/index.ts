import { IFunctionalItem } from '../Functional';

export type IPaginationMenuView = IPaginatedData<IMenuViewItem[]>;

export interface IMenuViewItem {
  id: number;
  title: string;
  iconType: string;
  icon: string;
  path: string;
  orderIndex: number;
  functionals: Functionals[];
  createAt: string;
  updateAt: string;
  creator: {
    id: number;
    fullName: string;
  };
  updater: string;
}

type Functionals = Pick<IFunctionalItem, 'id' | 'title' | 'code'>;
