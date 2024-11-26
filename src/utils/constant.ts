import { mockFileList } from '~/mocks/data';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^.{8,}$/;

export const colSpan = 8;
export const defaultImgUrl = mockFileList[0].url;

export enum JOB_STATUS {
  ACTIVE = 5,
  INACTIVE = 6,
  DELETED = 7,
}
