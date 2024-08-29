import PATH from '~/utils/path';
import UserProfile from '~/pages/User/UserProfile';
import ProtectedRoute from '~/routes/ProtectedRoute';

const userRoutes = {
  path: '/user',
  element: <ProtectedRoute allowedRoles={['user']} />,
  children: [
    { index: true, element: <UserProfile /> },
    { path: PATH.USER_PROFILE, element: <UserProfile /> },
  ],
};

export default userRoutes;
