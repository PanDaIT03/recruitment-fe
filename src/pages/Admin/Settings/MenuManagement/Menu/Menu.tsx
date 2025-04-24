import { Col, Flex, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

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

  const [modalForm] = useForm();
  const [filterForm] = useForm<IFilterMenuView>();

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

  const handleEdit = useCallback((record: IMenuViewItem) => {
    console.log(record);
    setIsOpenModal(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    console.log(id);
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
    setIsOpenModal(false);
  }, []);

  const handleFinishModal = useCallback((values: any) => {
    console.log(values);
  }, []);

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
          <Button fill title="Tạo" iconBefore={<PlusOutlined />} />
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
        form={modalForm}
        isOpen={isOpenModal}
        title="Chỉnh sửa menu"
        onFinish={handleFinishModal}
        onCancel={handleCancelModal}
      />
    </>
  );
};

export default Menu;
