export type IPaginationMenuViewGroup = IPaginatedData<IMenuViewGroupItem[]>;

export interface IMenuViewGroupItem {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  menuViews: IMenuView[];
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

interface IMenuView {
  id: number;
  title: string;
  iconType: string;
  icon: string;
  path: string;
  orderIndex: number;
}
