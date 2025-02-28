import { Table as TableAntD, TablePaginationConfig, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

interface IBaseTWithID {
  id: number | string;
}

const Table = <T extends IBaseTWithID>({
  columns,
  pagination,
  ...passProps
}: TableProps<T>) => {
  const paginationParams = pagination as TablePaginationConfig;

  const formattedColumns = columns?.map((col) => ({
    ...col,
    render: (value, record, index) => {
      const valueIsNotValid = value === undefined || value === null;

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
    <TableAntD
      size="middle"
      columns={formattedColumns}
      scroll={{ x: 'max-content' }}
      rowKey={(record) => record?.id ?? 'id'}
      rowClassName={(_, index) => (index % 2 !== 0 ? 'even-row' : '')}
      pagination={
        paginationParams && {
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
        }
      }
      {...passProps}
    />
  );
};

export default Table;
