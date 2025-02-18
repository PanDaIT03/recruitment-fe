import { ROLE } from '~/types/Role';
import { useAppSelector } from './useStore';

const useRole = () => {
  const { roles } = useAppSelector((state) => state.role);
  const { currentUser } = useAppSelector((state) => state.auth);

  const userRoleId = currentUser?.role?.id;

  const isGuest = !roles?.items.length || !Object.keys(currentUser).length;
  const roleTitle = roles.items.find((role) => role.id === userRoleId)?.title;

  const isUser = roleTitle === ROLE.USER;
  const isAdmin = roleTitle === ROLE.ADMIN;
  const isEmployer = roleTitle === ROLE.EMPLOYER;

  return { isGuest, isAdmin, isEmployer, isUser };
};

export default useRole;
