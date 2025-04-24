export type IPaginationMenuView = IPaginatedData<IMenuViewItem[]>;

export interface IMenuViewItem {
  id: number;
  title: string;
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
  updater: string;
}
