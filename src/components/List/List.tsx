import { List as AntdList, ListProps, Skeleton } from 'antd';
import { ReactNode } from 'react';

interface IProps<T> extends ListProps<T> {
  skeletonCount?: number;
  skeletonRender?: () => ReactNode;
}

const List = <T,>({
  loading,
  dataSource,
  pagination,
  skeletonCount = 2,
  renderItem,
  skeletonRender,
  ...props
}: IProps<T>): JSX.Element => {
  const skeletonCountArr = Array.from({ length: skeletonCount }, () =>
    Math.floor(Math.random() * 100)
  );

  return (
    <AntdList
      dataSource={loading ? (skeletonCountArr as unknown as T[]) : dataSource}
      pagination={dataSource?.length ? { ...pagination } : false}
      renderItem={(item, index) =>
        loading ? (
          skeletonRender ? (
            skeletonRender()
          ) : (
            <AntdList.Item style={{ marginTop: '24px', borderBlockEnd: 0 }}>
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
