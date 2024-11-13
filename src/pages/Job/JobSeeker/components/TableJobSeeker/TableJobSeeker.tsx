import { Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

import classNames from 'classnames';
import './TableJobSeeker.scss';

interface IProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
}

const TableJobSeeker = <T extends object>({
  className,
  ...props
}: IProps<T>) => {
  const customClass = classNames(
    'table-job-seeker',
    'overflow-hidden rounded-2xl border border-normal',
    className
  );

  return <Table {...props} className={customClass} />;
};

export default TableJobSeeker;
