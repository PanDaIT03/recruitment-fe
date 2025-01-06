import { Flex, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';

import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import usePagination from '~/hooks/usePagination';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionalGroups } from '~/store/thunk/functionalGroup';
import { IFunctionalItem } from '~/types/Functional';
import { IFunctionalGroupItem } from '~/types/FunctionalGroup';
import icons from '~/utils/icons';

const { EditOutlined, CloseOutlined, QuestionCircleOutlined } = icons;

const FunctionalGroup = () => {
  const dispatch = useAppDispatch();
  const queryParams = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { functionalGroups, loading } = useAppSelector(
    (state) => state.functionalGroup
  );

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const { currentPage, itemsPerPage, handlePageChange } = usePagination({
    // extraParams: filters,
    items: functionalGroups?.items,
    fetchAction: getAllFunctionalGroups,
    pageInfo: {
      currentPage: paginationParams.page,
      itemsPerPage: paginationParams.pageSize,
      totalItems: functionalGroups?.pageInfo?.totalItems || 0,
    },
  });

  useEffect(() => {
    setTitle('Danh sách nhóm chức năng');
    setBreadcrumb([
      { title: 'Quản lý' },
      { title: 'Danh sách nhóm chức năng' },
    ]);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        align: 'center',
        render: (_, __, index: number) =>
          index + 1 + paginationParams.pageSize * (paginationParams.page - 1),
      },
      {
        width: 200,
        dataIndex: 'title',
        title: 'Tên nhóm chức năng',
      },
      {
        width: 350,
        dataIndex: 'description',
        title: 'Mô tả',
      },
      {
        width: 350,
        dataIndex: 'functionals',
        title: 'Nhóm chức năng',
        render: (value: IFunctionalItem[]) =>
          value?.map((item) => item?.title)?.join(', '),
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
        width: 50,
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (_, record) => {
          console.log(record);

          return (
            <Flex justify="center">
              <ButtonAction tooltipTitle="Chỉnh sửa" title={<EditOutlined />} />
              <Popconfirm
                okText="Có"
                cancelText="Không"
                placement="topLeft"
                title={<span className="text-black">Xoá mục này</span>}
                description={
                  <span className="text-black">
                    Bạn có chắc chắn muốn xoá mục này?
                  </span>
                }
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                <ButtonAction
                  tooltipTitle="Xóa"
                  title={<CloseOutlined style={{ color: 'red' }} />}
                />
              </Popconfirm>
            </Flex>
          );
        },
      },
    ] as ColumnsType<IFunctionalGroupItem>;
  }, [paginationParams]);

  return (
    <>
      <Content>
        <Table
          loading={loading}
          columns={columns}
          dataSource={functionalGroups.items}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: functionalGroups?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </>
  );
};

export default FunctionalGroup;
