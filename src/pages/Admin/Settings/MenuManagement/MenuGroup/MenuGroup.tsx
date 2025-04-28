import { Col, Flex, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { MENU_MANAGEMENT_TAB_ITEM_KEY } from '~/enums';
import usePagination from '~/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllMenuViews } from '~/store/thunk/menuView';
import { getAllMenuViewGroups } from '~/store/thunk/menuViewGroup';
import { IMenuViewGroupItem } from '~/types/MenuViewGroup';
import icons from '~/utils/icons';
import FilterMenuGroup from './FilterMenuGroup';

export interface IMenuGroupForm {
  title?: string;
  orderIndex?: number;
  createdDate?: string;
  menuViewIds?: number[];
}

const { EditOutlined, CloseOutlined, PlusOutlined, QuestionCircleOutlined } =
  icons;

const MenuGroup = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm<IMenuGroupForm>();

  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [filterParams, setFilterParams] = useState<IMenuGroupForm>();

  const { menuViewGroup, loading } = useAppSelector(
    (state) => state.menuViewGroup
  );

  const { pageInfo, handlePageChange, hanldeClearURLSearchParams } =
    usePagination({
      items: menuViewGroup.items,
      extraParams: filterParams,
      fetchAction: getAllMenuViewGroups,
      setFilterParams: setFilterParams,
    });

  useEffect(() => {
    dispatch(getAllMenuViews({ type: 'combobox' }));
  }, []);

  const handleEdit = useCallback((record: IMenuViewGroupItem) => {
    console.log(record);
  }, []);

  const handleDelete = useCallback((id: number) => {
    console.log(id);
  }, []);

  const handleCancelFilter = () => {
    setIsOpenFilter(false);
    setFilterParams({});

    hanldeClearURLSearchParams({
      tab: MENU_MANAGEMENT_TAB_ITEM_KEY.MENU_GROUP,
    });
  };

  const handleFinishFilter = useCallback((values: IMenuGroupForm) => {
    setFilterParams(values);
  }, []);

  const columns: ColumnType<IMenuViewGroupItem>[] = useMemo(
    () => [
      {
        width: 50,
        title: 'STT',
        align: 'center',
        render: (_, __, index: number) =>
          index + 1 + pageInfo.pageSize * (pageInfo.page - 1),
      },
      {
        width: 150,
        dataIndex: 'title',
        title: 'Tên menu',
      },
      {
        width: 250,
        dataIndex: 'description',
        title: 'Mô tả',
      },
      {
        width: 250,
        dataIndex: 'menuViews',
        title: 'Menu',
        render: (value: IMenuViewGroupItem['menuViews']) => (
          <p className="line-clamp-2">
            {value?.map((item) => item?.title)?.join(', ')}
          </p>
        ),
      },
      {
        width: 100,
        align: 'center',
        dataIndex: 'orderIndex',
        title: 'Order',
      },
      {
        width: 180,
        title: 'Người tạo',
        dataIndex: ['creator', 'fullName'],
      },
      {
        width: 200,
        title: 'Ngày tạo',
        dataIndex: 'createAt',
        render: (value: string) =>
          value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
      },
      {
        width: 180,
        title: 'Người chỉnh sửa',
        dataIndex: ['updater', 'fullName'],
      },
      {
        width: 200,
        title: 'Ngày chỉnh sửa',
        dataIndex: 'updateAt',
        render: (value: string) =>
          value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
      },
      {
        width: 80,
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (_, record) => {
          return (
            <Flex justify="center">
              <ButtonAction
                tooltipTitle="Chỉnh sửa"
                title={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Popconfirm
                okText="Có"
                cancelText="Không"
                placement="topLeft"
                title="Xoá mục này"
                description="Bạn có chắc chắn muốn xoá mục này?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => handleDelete(record.id)}
              >
                <ButtonAction tooltipTitle="Xóa" title={<CloseOutlined />} />
              </Popconfirm>
            </Flex>
          );
        },
      },
    ],
    [pageInfo]
  );

  return (
    <>
      <Row gutter={[8, 16]} align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className={'bg-white'}
            onClick={() => setIsOpenFilter(!isOpenFilter)}
          />
        </Col>
        <Col>
          <Button
            fill
            title="Tạo"
            iconBefore={<PlusOutlined />}
            // onClick={() => setIsOpenModal(true)}
          />
        </Col>
      </Row>
      <FilterMenuGroup
        form={form}
        isOpen={isOpenFilter}
        onCancel={handleCancelFilter}
        onFinish={handleFinishFilter}
        onPageChange={handlePageChange}
      />
      <Content>
        <Table<IMenuViewGroupItem>
          columns={columns}
          loading={loading}
          dataSource={menuViewGroup.items}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: menuViewGroup?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </>
  );
};

export default MenuGroup;
