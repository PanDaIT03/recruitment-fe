import { Table as TableAntD, TablePaginationConfig, TableProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';

interface ITableProps extends TableProps {}

const Table = ({
  dataSource,
  columns,
  loading,
  pagination,
  ...passProps
}: ITableProps) => {
  const paginationParams = pagination as TablePaginationConfig;

  return (
    <TableAntD
      size="middle"
      loading={loading}
      dataSource={dataSource}
      columns={columns}
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
  );
};

export default memo(Table);
