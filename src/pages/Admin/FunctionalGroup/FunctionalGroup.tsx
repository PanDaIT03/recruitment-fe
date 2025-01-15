import { Col, Flex, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterAdmin } from '~/assets/svg';

import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal from '~/components/Modal/Modal';
import Select from '~/components/Select/Select';
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
import FilterFunctionalGroup from './FilterFunctionalGroup';

const {
  EditOutlined,
  CloseOutlined,
  PlusOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
} = icons;

const FunctionalGroup = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const queryParams = useQueryParams();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

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

  const handleCancelModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleFinishModal = useCallback((values: any) => {
    console.log('finish', values);
  }, []);

  return (
    <>
      <Row gutter={[8, 16]} align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className={'bg-white'}
            onClick={() => setIsOpenFilter(true)}
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
      <FilterFunctionalGroup />
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
      <Modal
        isOpen={isOpenModal}
        title="Tạo nhóm chức năng"
        footer={
          <Flex justify="end" gap={16}>
            <Button
              title="Hủy"
              iconBefore={<CloseOutlined />}
              onClick={handleCancelModal}
            />
            <Button fill title="Lưu" iconBefore={<SaveOutlined />} />
          </Flex>
        }
        onCancel={handleCancelModal}
      >
        <FormWrapper form={form} onFinish={handleFinishModal}>
          <FormItem label="Tên nhóm chức năng">
            <Input placeholder="Ví dụ: Quản lý người dùng" />
          </FormItem>
          <FormItem label="Chức năng">
            <Select placeholder="Chọn chức năng" />
          </FormItem>
          <FormItem label="Mô tả">
            <TextArea
              className="!min-h-20 py-1 bg-[#FAFAFA]"
              placeholder="Ví dụ: Quản lý người dùng..."
            />
          </FormItem>
        </FormWrapper>
      </Modal>
    </>
  );
};

export default FunctionalGroup;
