import {
  ConfigProvider,
  Empty,
  Table as TableAntD,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';
import { memo } from 'react';

import { NoData } from '~/assets/svg';
import './index.scss';

interface ITableProps extends TableProps {}

const CustomerEmptyData = () => {
  return (
    <Empty
      description={<span className="text-admin-primary">Không có dữ liệu</span>}
      image={<NoData />}
      imageStyle={{ height: '70px' }}
    />
  );
};

const Table = ({
  dataSource,
  columns,
  loading,
  pagination,
  className,
  ...passProps
}: ITableProps) => {
  const paginationParams = pagination as TablePaginationConfig;
  const tableClasses = classNames(className, '');
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
        token: {
          colorText: 'white',
          colorBorder: '#ffac69',
          colorBgTextHover: '#ffac69',
          colorBgContainer: '#2f2f41b3',
          colorIcon: 'white',
          colorTextDisabled: '#d3d3d3',
          colorIconHover: '#ffac69',
        },
        components: {
          Table: {
            colorText: '#ff0000', // Màu cho text
            colorIcon: '#ff0000', // Màu cho icon
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
        rowKey={(record) => record?.id ?? 'id'}
        scroll={{ x: 'max-content' }}
        rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
        {...passProps}
        pagination={{
          current: paginationParams.current,
          pageSize: paginationParams.pageSize,
          onChange: paginationParams.onChange,
          pageSizeOptions: [1, 10, 20],
          showSizeChanger: true,
          className: classNames(
            '!mb-0 !mt-5 [&>li]:!mr-[8px]',
            paginationParams.className
          ),
          ...paginationParams,
        }}
      />
    </ConfigProvider>
  );
};

export default memo(Table);
