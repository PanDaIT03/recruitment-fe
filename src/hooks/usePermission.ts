import { useCallback, useMemo } from 'react';
import { useAppSelector } from './useStore';

const isPermitted = (
  functionals: string[],
  permissions?: string | string[]
): boolean => {
  if (!permissions || (Array.isArray(permissions) && !permissions.length))
    return true;

  if (typeof permissions === 'string')
    return functionals?.includes(permissions);

  return permissions?.every((perm) => functionals?.includes(perm));
};

export const usePermission = (permissions?: string | string[]) => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { functionals } = currentUser;

  const hasPermissions = useMemo(
    () => isPermitted(functionals, permissions),
    [permissions, functionals]
  );

  const checkPermissions = useCallback(
    (perms?: string | string[]): boolean => isPermitted(functionals, perms),
    [permissions, functionals]
  );

  return { hasPermissions, checkPermissions };
};
