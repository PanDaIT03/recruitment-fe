import PATH from '~/utils/path';
import EmployerDashboard from '~/pages/EmployerDashboard/EmployerDashboard';
import ProtectedRoute from '~/routes/ProtectedRoute';

const employerRoutes = {
  path: '/employer',
  element: <ProtectedRoute allowedRoles={['employer']} />,
  children: [
    { index: true, element: <EmployerDashboard /> },
    { path: PATH.EMPLOYER_DASHBOARD, element: <EmployerDashboard /> },
  ],
};

export default employerRoutes;
