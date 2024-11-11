import { RoleApi } from '~/apis/role/role';
import { ROLE } from '~/types/Role';
import { useFetch } from './useFetch';
import { useAppSelector } from './useStore';

const useRole = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data: roles } = useFetch(['getAllRole'], RoleApi.getAllRoles);

  const roleItems = roles?.items || [];
  const userRoleId = currentUser?.role?.id;

  const role = roleItems.find((role) => role.id === userRoleId)?.title;
  const isGuest = !roles?.items.length || !Object.keys(currentUser).length;

  const isUser = role === ROLE.USER;
  const isAdmin = role === ROLE.ADMIN;
  const isEmployer = role === ROLE.EMPLOYER;

  return { isGuest, isAdmin, isEmployer, isUser };
};

export default useRole;
