import {
  ConfigProvider,
  Empty,
  Table as TableAntD,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

import { NoData } from '~/assets/svg';
import './index.scss';

const CustomerEmptyData = () => {
  return (
    <Empty
      description={<span className="text-admin-primary">Không có dữ liệu</span>}
      image={<NoData />}
      imageStyle={{ height: '70px' }}
    />
  );
};

const Table = <T extends object>({
  dataSource,
  columns,
  loading,
  pagination,
  className,
  ...passProps
}: TableProps<T>) => {
  const paginationParams = pagination as TablePaginationConfig;
  const tableClasses = classNames('admin-custom-table', className);

  const formattedColumns = columns?.map((col) => ({
    ...col,
    render: (value, record, index) => {
      const valueIsNotValid = !value || value == null;

      return col.render
        ? valueIsNotValid
          ? '-'
          : col.render(value, record, index)
        : valueIsNotValid
          ? '-'
          : value;
    },
  })) as ColumnsType<any>;

  return (
    <ConfigProvider
      theme={{
        // token: {
        // colorText: 'white',
        // colorBorder: '#ffac69',
        // colorBgTextHover: '#ffac69',
        // colorBgContainer: '#2f2f41b3',
        // colorIcon: 'white',
        // colorTextDisabled: '#d3d3d3',
        // colorIconHover: '#ffac69',
        // },
        components: {
          Table: {
            colorText: '#ff0000',
            colorIcon: '#ff0000',
          },
        },
      }}
      renderEmpty={CustomerEmptyData}
    >
      <TableAntD
        size="middle"
        loading={loading}
        dataSource={dataSource}
        className={tableClasses}
        columns={formattedColumns}
        scroll={{ x: 'max-content' }}
        rowKey={(_, index) => index ?? 'id'}
        rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
        {...passProps}
        pagination={{
          current: paginationParams?.current ?? 1,
          pageSize: paginationParams?.pageSize ?? 10,
          ...(paginationParams?.onChange && {
            onChange: paginationParams.onChange,
          }),
          pageSizeOptions: [1, 10, 20],
          showSizeChanger: true,
          className: classNames(
            '!mb-0 !mt-5 [&>li]:!mr-[8px]',
            paginationParams?.className
          ),
          ...paginationParams,
        }}
      />
    </ConfigProvider>
  );
};

export default Table;
