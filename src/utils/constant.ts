export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^.{8,}$/;

export const token = localStorage.getItem('token2');

export enum JOB_STATUS {
  ACTIVE = 'Đang tuyển',
  INACTIVE = 'Ngừng đăng tin',
  DELETED = 'Đã xóa',
}
