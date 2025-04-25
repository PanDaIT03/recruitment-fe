import { useMutation } from '@tanstack/react-query';
import { Col, Flex, message, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import {
  ICreateMenuView,
  IGetAllMenuView,
  IUpdateMenuView,
  MenuViewAPI,
} from '~/apis/menuView';
import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { ICON_TYPE, MENU_MANAGEMENT_TAB_ITEM_KEY } from '~/enums';
import usePagination from '~/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import HeaderMenuIcon from '~/layouts/Header/menu/HeaderMenuIcon';
import { getAllMenuViews } from '~/store/thunk/menuView';
import { IMenuViewItem } from '~/types/MenuVIews';
import { formatDateToBE } from '~/utils/functions';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import FilterMenu from './FilterMenu';
import ModalMenu from './ModalMenu';

export interface IFilterMenuView {
  title?: string;
  path?: string;
  orderIndex?: number;
  iconType?: string;
  createdDate?: any;
}

export interface IMenuForm {
  title: string;
  path: string;
  orderIndex: number;
  iconPath?: string;
  iconFile?: any;
  functionalIds: number[];
}

export const iconTypeOptions: DefaultOptionType[] = [
  {
    label: <span className="capitalize">{ICON_TYPE.IMAGE}</span>,
    value: ICON_TYPE.IMAGE,
  },
  {
    label: <span className="capitalize">{ICON_TYPE.BUILT_IN}</span>,
    value: ICON_TYPE.BUILT_IN,
  },
];

const { PlusOutlined, EditOutlined, QuestionCircleOutlined, CloseOutlined } =
  icons;

const Menu = () => {
  const dispatch = useAppDispatch();

  const [menuForm] = useForm<IMenuForm>();
  const [filterForm] = useForm<IFilterMenuView>();

  const [editIndex, setEditIndex] = useState(-1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [filterParams, setFilterParams] = useState<IFilterMenuView>();
  const { menuViews, loading } = useAppSelector((state) => state.menuView);

  const { pageInfo, handlePageChange, hanldeClearURLSearchParams } =
    usePagination({
      setFilterParams,
      items: menuViews?.items,
      extraParams: filterParams,
      fetchAction: getAllMenuViews,
    });

  const { mutate: uploadIcon, isPending: isUploadIconPending } = useMutation({
    mutationFn: (params: FormData) => MenuViewAPI.uploadIcon(params),
    onSuccess: (res) => {
      const response = res?.items;
      if (!response?.length) {
        toast.error('Có lỗi xảy ra!');
        return;
      }

      const iconPath = res?.items?.[0]?.url;
      const fieldsValue = menuForm.getFieldsValue();

      handleSaveMenuView(fieldsValue, iconPath);
    },
    onError: (error: any) => {
      message.error(`Upload icon thất bại: ${error?.response?.data?.message}`);
    },
  });

  const { mutate: createMenuView, isPending: isCreateMenuViewPending } =
    useMutation({
      mutationFn: (params: ICreateMenuView) =>
        MenuViewAPI.createMenuView(params),
      onSuccess: (res) => {
        message.success(res?.message || 'Tạo mới thành công');

        handleCancelModal();
        refetchMenuViews({});
      },
      onError: (error: any) => {
        message.error(`Tạo mới thất bại: ${error?.response?.data?.message}`);
      },
    });

  const { mutate: updateMenuView, isPending: isUpdateMenuViewPending } =
    useMutation({
      mutationFn: (params: IUpdateMenuView) =>
        MenuViewAPI.updateMenuView(params),
      onSuccess: (res) => {
        message.success(res?.message || 'Cập nhật thành công');

        handleCancelModal();
        refetchMenuViews({});
      },
      onError: (error: any) => {
        message.error(`Cập nhật thất bại: ${error?.response?.data?.message}`);
      },
    });

  const { mutate: deleteMenuView, isPending: isDeleteMenuViewPending } =
    useMutation({
      mutationFn: (id: number) => MenuViewAPI.deleteMenuView(id),
      onSuccess: (res) => {
        message.success(res?.message || 'Xóa menu thành công');
        refetchMenuViews({});
      },
      onError: (error: any) => {
        message.error(`Xóa thất bại: ${error?.response?.data?.message}`);
      },
    });

  const isModalLoading = useMemo(
    () =>
      isUpdateMenuViewPending ||
      isCreateMenuViewPending ||
      isUploadIconPending ||
      isDeleteMenuViewPending,
    [
      isUploadIconPending,
      isUpdateMenuViewPending,
      isCreateMenuViewPending,
      isDeleteMenuViewPending,
    ]
  );

  const refetchMenuViews = useCallback((params: IGetAllMenuView) => {
    dispatch(getAllMenuViews(params));
  }, []);

  const handleEdit = useCallback((record: IMenuViewItem) => {
    const { orderIndex, title, path, icon, functionals } = record;
    const fieldsValue: IMenuForm = {
      path: path,
      title: title,
      iconPath: icon,
      orderIndex: orderIndex,
      functionalIds: functionals?.map((functional) => functional.id),
    };

    setIsOpenModal(true);
    setEditIndex(record.id);
    menuForm.setFieldsValue(fieldsValue);
  }, []);

  const handleDelete = useCallback((id: number) => {
    deleteMenuView(id);
  }, []);

  const handleCancelFilter = () => {
    setIsOpenFilter(false);
    setFilterParams({});
    hanldeClearURLSearchParams({
      tab: MENU_MANAGEMENT_TAB_ITEM_KEY.MENU,
    });
  };

  const handleFinishFilter = useCallback((values: IFilterMenuView) => {
    const { createdDate, ...rest } = values;
    const formattedParams: IFilterMenuView = {
      ...rest,
      createdDate: formatDateToBE(createdDate),
    };

    setFilterParams(formattedParams);
  }, []);

  const handleCancelModal = useCallback(() => {
    menuForm.resetFields();

    setEditIndex(-1);
    setIsOpenModal(false);
  }, []);

  const handleFinishModal = useCallback(
    (values: IMenuForm) => {
      const formData = new FormData();
      const { iconFile, iconPath } = values;

      if (iconFile && iconFile?.fileList?.length) {
        iconFile?.fileList.forEach((item: any) => {
          if (!item.originFileObj) return;

          formData.append('files', item.originFileObj);
        });

        uploadIcon(formData);
        return;
      }

      handleSaveMenuView(values, iconPath);
    },
    [editIndex]
  );

  const handleSaveMenuView = useCallback(
    (values: IMenuForm, iconURL?: string) => {
      const { iconPath, iconFile, orderIndex, ...rest } = values;
      const iconType = iconFile ? ICON_TYPE.IMAGE : ICON_TYPE.BUILT_IN;

      if (editIndex === -1) {
        const createParams: ICreateMenuView = {
          ...rest,
          iconType,
          icon: iconURL,
          orderIndex: Number(orderIndex),
        };

        createMenuView(createParams);
        return;
      }

      const updateParams: IUpdateMenuView = {
        ...rest,
        id: editIndex,
        iconType,
        icon: iconURL,
        orderIndex: Number(orderIndex),
      };
      updateMenuView(updateParams);
    },
    [editIndex]
  );

  const columns: ColumnType<IMenuViewItem>[] = useMemo(
    () => [
      {
        width: 50,
        title: 'STT',
        align: 'center',
        render: (_, __, index: number) =>
          index + 1 + pageInfo.pageSize * (pageInfo.page - 1),
      },
      {
        width: 200,
        dataIndex: 'title',
        title: 'Tên menu',
      },
      {
        width: 250,
        dataIndex: 'functionals',
        title: 'Chức năng',
        render: (value: IMenuViewItem['functionals']) => (
          <p className="line-clamp-2">
            {value?.map((item) => item?.title)?.join(', ') || '-'}
          </p>
        ),
      },
      {
        width: 200,
        dataIndex: 'path',
        title: 'Path',
      },
      {
        width: 100,
        dataIndex: 'iconType',
        title: 'Loại icon',
      },
      {
        width: 80,
        align: 'center',
        dataIndex: 'icon',
        title: 'Icon',
        render: (_, record) => (
          <HeaderMenuIcon iconType={record.iconType} icon={record.icon} />
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
      <FilterMenu
        form={filterForm}
        isOpen={isOpenFilter}
        onFinish={handleFinishFilter}
        onCancel={handleCancelFilter}
      />
      <Content>
        <Table<IMenuViewItem>
          columns={columns}
          loading={loading}
          dataSource={menuViews.items}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: menuViews?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
      <ModalMenu
        form={menuForm}
        isOpen={isOpenModal}
        cancelText="Hủy"
        title="Chỉnh sửa menu"
        loading={isModalLoading}
        onFinish={handleFinishModal}
        onCancel={handleCancelModal}
      />
    </>
  );
};

export default Menu;
