import { List as AntdList, ListProps, Skeleton } from 'antd';
import { ReactElement } from 'react';

import './List.scss';

interface IProps<T> extends ListProps<T> {
  skeletonCount?: number;
  customSkeleton?: ReactElement;
}

const List = <T,>({
  loading,
  dataSource,
  pagination,
  customSkeleton,
  skeletonCount = 2,
  itemLayout = 'vertical',
  renderItem,
  ...props
}: IProps<T>): JSX.Element => {
  const skeletonCountArr = Array.from({ length: skeletonCount }, () =>
    Math.floor(Math.random() * 100)
  );

  return (
    <AntdList
      itemLayout={itemLayout}
      dataSource={loading ? (skeletonCountArr as unknown as T[]) : dataSource}
      pagination={
        dataSource?.length && typeof pagination !== 'boolean'
          ? { className: 'list-custom', ...pagination }
          : false
      }
      renderItem={(item, index) =>
        loading ? (
          customSkeleton ? (
            <List.Item className="!border-0">{customSkeleton}</List.Item>
          ) : (
            <AntdList.Item
              style={{ borderBlockEnd: 0, padding: '24px' }}
              className="bg-white mt-6 border rounded-2xl"
            >
              <Skeleton avatar active paragraph={{ rows: 3 }} />
            </AntdList.Item>
          )
        ) : (
          renderItem?.(item, index)
        )
      }
      {...props}
    />
  );
};

List.Item = AntdList.Item;

export default List;
