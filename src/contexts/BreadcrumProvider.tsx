import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import React, { useState } from 'react';

interface IBreadcrumbContext {
  breadcrumb: BreadcrumbItemType[];
  setBreadcrumb: React.Dispatch<BreadcrumbItemType[]>;
}

const BreadcrumbContext = React.createContext<IBreadcrumbContext>(
  undefined as any
);
const useBreadcrumb = () => React.useContext(BreadcrumbContext);

const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const [breadcrumb, setBreadcrumb] = useState([] as BreadcrumbItemType[]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export { BreadcrumbProvider, useBreadcrumb };
