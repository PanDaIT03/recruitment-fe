interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface Role {
  id: number;
  title: string;
}

interface JobField {
  id: number;
  createBy: number | null;
  createAt: string | null;
  updateBy: number | null;
  updateAt: string | null;
  title: string;
}

interface UserJobField {
  createBy: number | null;
  createAt: string | null;
  updateBy: number | null;
  updateAt: string | null;
  usersId: number;
  jobFieldsId: number;
  jobField: JobField;
}

interface JobPosition {
  id: number;
  title: string;
}

interface UserItem {
  id: number;
  fullName: string;
  phoneNumber: string | null;
  email: string;
  avatarUrl: string | null;
  companyName: string | null;
  companyUrl: string | null;
  isActive: boolean;
  role: Role;
  usersJobFields: UserJobField[];
  jobPosition: JobPosition | null;
}

export interface UserListResponse {
  pageInfo: PageInfo;
  items: UserItem[];
}
