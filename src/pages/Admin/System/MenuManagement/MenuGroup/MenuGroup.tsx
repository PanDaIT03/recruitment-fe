import { useMutation } from '@tanstack/react-query';
import { Col, Flex, message, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ICreateMenuViewGroupParams,
  IGetAllMenuViewGroupParams,
  IUpdateMenuViewGroupParams,
  MenuViewGroupAPI,
} from '~/apis/menuViewGroup';
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
import ModalMenuGroup from './ModalMenuGroup';

export interface IMenuGroupFilterForm {
  title?: string;
  orderIndex?: number;
  createdDate?: string;
  menuViewIds?: number[];
}

export interface IMenuGroupModalForm {
  title: string;
  orderIndex: number;
  description: string;
  menuViewIds: number[];
}

const { EditOutlined, CloseOutlined, PlusOutlined, QuestionCircleOutlined } =
  icons;

const MenuGroup = () => {
  const dispatch = useAppDispatch();

  const [filterForm] = useForm<IMenuGroupFilterForm>();
  const [menuGroupForm] = useForm<IMenuGroupModalForm>();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [editIndex, setEditIndex] = useState(-1);
  const [filterParams, setFilterParams] =
    useState<IGetAllMenuViewGroupParams>();

  const { menuViewGroup, loading } = useAppSelector(
    (state) => state.menuViewGroup
  );

  const { pageInfo, handlePageChange, handleClearURLSearchParams } =
    usePagination({
      extraParams: filterParams,
      setFilterParams: setFilterParams,
      fetchFn: (params: IGetAllMenuViewGroupParams) =>
        dispatch(getAllMenuViewGroups(params)),
    });

  const {
    mutate: createMenuViewGroup,
    isPending: isCreateMenuViewGroupPending,
  } = useMutation({
    mutationFn: (params: ICreateMenuViewGroupParams) =>
      MenuViewGroupAPI.createMenuViewGroup(params),
    onSuccess: (res) => {
      message.success(res?.message || 'Tạo mới thành công');

      handleCancelModal();
      handleCancelFilter();
    },
    onError: (error: any) => {
      message.error(`Tạo mới thất bại: ${error?.response?.data?.message}`);
    },
  });

  const {
    mutate: updateMenuViewGroup,
    isPending: isUpdateMenuViewGroupPending,
  } = useMutation({
    mutationFn: (params: IUpdateMenuViewGroupParams) =>
      MenuViewGroupAPI.updateMenuViewGroup(params),
    onSuccess: (res) => {
      message.success(res?.message || 'Chỉnh sửa thành công');

      handleCancelModal();
      setFilterParams({
        page: 1,
        pageSize: 10,
        ...filterParams,
      });
    },
    onError: (error: any) => {
      message.error(`Chỉnh sửa thất bại: ${error?.response?.data?.message}`);
    },
  });

  const {
    mutate: deleteMenuViewGroup,
    isPending: isDeleteMenuViewGroupPending,
  } = useMutation({
    mutationFn: (id: number) => MenuViewGroupAPI.deleteMenuViewGroup(id),
    onSuccess: (res) => {
      message.success(res?.message || 'Xóa thành công');

      handleCancelModal();
      setFilterParams({
        page: 1,
        pageSize: 10,
        ...filterParams,
      });
    },
    onError: (error: any) => {
      message.error(`Xóa thất bại: ${error?.response?.data?.message}`);
    },
  });

  useEffect(() => {
    dispatch(getAllMenuViews({ type: 'combobox' }));
  }, []);

  const handleEdit = useCallback((record: IMenuViewGroupItem) => {
    const { menuViews, ...rest } = record;
    const fieldsValue: IMenuGroupModalForm = {
      ...rest,
      menuViewIds: menuViews?.map((menuView) => menuView?.id),
    };

    setIsOpenModal(true);
    setEditIndex(record.id);
    menuGroupForm.setFieldsValue(fieldsValue);
  }, []);

  const handleDelete = useCallback((id: number) => {
    deleteMenuViewGroup(id);
  }, []);

  const handleCancelFilter = () => {
    setIsOpenFilter(false);
    setFilterParams({});

    filterForm.resetFields();
    handleClearURLSearchParams({
      tab: MENU_MANAGEMENT_TAB_ITEM_KEY.MENU_GROUP,
    });
  };

  const handleFinishFilter = useCallback((values: IMenuGroupFilterForm) => {
    setFilterParams(values);
  }, []);

  const handleFinishModal = useCallback(
    (values: IMenuGroupModalForm) => {
      const { orderIndex, ...rest } = values;
      const params: ICreateMenuViewGroupParams = {
        ...rest,
        orderIndex: Number(orderIndex),
      };

      if (editIndex === -1) {
        createMenuViewGroup(params);
        return;
      }

      updateMenuViewGroup({ ...params, id: editIndex });
    },
    [editIndex]
  );

  const handleCancelModal = useCallback(() => {
    menuGroupForm.resetFields();

    setEditIndex(-1);
    setIsOpenModal(false);
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
        title: 'Tên nhóm menu',
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
            onClick={() => setIsOpenModal(true)}
          />
        </Col>
      </Row>
      <FilterMenuGroup
        form={filterForm}
        isOpen={isOpenFilter}
        onCancel={handleCancelFilter}
        onFinish={handleFinishFilter}
        onPageChange={handlePageChange}
      />
      <Content>
        <Table<IMenuViewGroupItem>
          columns={columns}
          dataSource={menuViewGroup.items}
          loading={loading || isDeleteMenuViewGroupPending}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: menuViewGroup?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
      <ModalMenuGroup
        isOpen={isOpenModal}
        form={menuGroupForm}
        title={editIndex !== -1 ? 'Chỉnh sửa nhóm menu' : 'Tạo mới nhóm menu'}
        loading={isUpdateMenuViewGroupPending || isCreateMenuViewGroupPending}
        onFinish={handleFinishModal}
        onCancel={handleCancelModal}
      />
    </>
  );
};

export default MenuGroup;
