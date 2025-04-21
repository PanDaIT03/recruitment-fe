import { useMemo } from 'react';
import { useAppSelector } from './useStore';

interface IProps {
  permissions: string | string[];
}

export const usePermission = ({ permissions }: IProps) => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { functionals } = currentUser;

  const hasPermissions = useMemo((): boolean => {
    if (Array.isArray(permissions) && !permissions.length) return true;

    if (typeof permissions === 'string')
      return functionals?.includes(permissions);

    return permissions?.every((perm) => functionals?.includes(perm));
  }, [permissions, functionals]);

  return { hasPermissions };
};
