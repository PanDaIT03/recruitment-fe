import { Breadcrumb } from 'antd';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import icons from '~/utils/icons';

const { HomeOutlined } = icons;
type BreadcrumbItem = {
  path: string;
  label: string;
};

const useBreadcrumb = (customItems?: BreadcrumbItem[]) => {
  const location = useLocation();

  return useMemo(() => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);

    let breadcrumbItems: React.ReactNode[] = [];

    /* Nếu có customize text or path thì sử dụng như thế này 
       const custom = [ { path: ... , label: ... } ]

       const breadcrumb = useBreadcrumb(custom)

       Nếu không customize thì text default breadcrumb sẽ lấy trên đường dẫn
    */

    if (customItems) {
      breadcrumbItems = customItems.map((item, index) => (
        <Breadcrumb.Item key={item.path}>
          {index === customItems.length - 1 ? (
            item.label
          ) : (
            <Link to={item.path}>{item.label}</Link>
          )}
        </Breadcrumb.Item>
      ));
    } else {
      breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const breadcrumbName = pathSnippets[index]
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <Breadcrumb.Item key={url}>
            {index === pathSnippets.length - 1 ? (
              breadcrumbName
            ) : (
              <Link to={url}>{breadcrumbName}</Link>
            )}
          </Breadcrumb.Item>
        );
      });
    }

    breadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        <Link to="/">
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
    );

    return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
  }, [location.pathname, customItems]);
};

export default useBreadcrumb;
