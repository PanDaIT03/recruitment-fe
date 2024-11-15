import { Breadcrumb } from 'antd';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { HomeOutlined } = icons;

type BreadcrumbItem = {
  path: string;
  label: string;
};

const useBreadcrumb = (
  customItems?: BreadcrumbItem[],
  customClass?: string
) => {
  const location = useLocation();

  return useMemo(() => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);

    let breadcrumbItems: any[] = [];
    /* Nếu có customize text or path thì sử dụng như thế này 
       const custom = [ { path: ... , label: ... } ]

       const breadcrumb = useBreadcrumb(custom)

       Nếu không customize thì text default breadcrumb sẽ lấy trên đường dẫn
    */

    if (customItems) {
      breadcrumbItems = customItems.map((item, index) => ({
        key: item.path,
        title:
          index === customItems.length - 1 ? (
            <span className={`!${customClass} font-medium`}>{item.label}</span>
          ) : (
            <Link to={item.path} className={`!${customClass} font-medium`}>
              {item.label}
            </Link>
          ),
      }));
    } else {
      breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const breadcrumbName = pathSnippets[index]
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          key: url,
          title:
            index === pathSnippets.length - 1 ? (
              breadcrumbName
            ) : (
              <Link to={url} className={`!${customClass} font-medium`}>
                {breadcrumbName}
              </Link>
            ),
        };
      });
    }

    breadcrumbItems.unshift({
      key: 'home',
      title: (
        <Link to={PATH.ROOT}>
          {customClass ? (
            <HomeOutlined style={{ color: '#fff', fontWeight: '500' }} />
          ) : (
            <HomeOutlined />
          )}
        </Link>
      ),
    });

    return (
      <Breadcrumb
        items={breadcrumbItems}
        separator={
          <>
            <span className={`${customClass ? '!text-white' : ''} `}>/</span>
          </>
        }
      />
    );
  }, [location.pathname, customItems]);
};

export default useBreadcrumb;
