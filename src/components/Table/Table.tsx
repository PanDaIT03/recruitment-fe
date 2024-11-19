import { Table as TableAntD, TableProps } from 'antd';
import { memo } from 'react';

interface ITableProps extends TableProps {}

const Table = ({ dataSource, columns, loading, ...passProps }: ITableProps) => {
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
    />
  );
};

export default memo(Table);
