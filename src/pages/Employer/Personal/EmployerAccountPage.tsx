import React from 'react';
import EmployerAccountForm from './EmployerAccountForm';

const EmployerAccountPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <EmployerAccountForm />
      </div>
    </div>
  );
};

export default EmployerAccountPage;
