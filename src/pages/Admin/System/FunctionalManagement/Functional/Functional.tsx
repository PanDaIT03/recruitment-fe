import { useMutation } from '@tanstack/react-query';
import { Col, Flex, message, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { memo, useCallback, useMemo, useState } from 'react';

import {
  FunctionalAPI,
  ICreateFunctionalParams,
  IGetAllFunctionalParams,
  IUpdateFunctionalParams,
} from '~/apis/functional';
import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal from '~/components/Modal/Modal';
import Table from '~/components/Table/Table';
import { FUNCTIONAL_TAB_ITEM_KEY } from '~/enums';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';
import { IFunctionalItem } from '~/types/Functional';
import icons from '~/utils/icons';
import FilterFunctional from './FilterFunctional';

export interface IFunctionalForm {
  code: string;
  title: string;
  iconType: string;
  icon: string;
  path: string;
  orderIndex: number;
}

export interface IFilterFunctionalForm {
  code: string;
  title: string;
  createdDate: string;
}

const {
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
} = icons;

const Functional = () => {
  const [form] = useForm<IFunctionalForm>();
  const [filterForm] = useForm<IFilterFunctionalForm>();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [editIndex, setEditIndex] = useState(-1);
  const [filters, setFilters] = useState<IGetAllFunctionalParams>();

  const { functionals, loading } = useAppSelector((state) => state.functional);

  const { pageInfo, handlePageChange, hanldeClearURLSearchParams } =
    usePagination({
      extraParams: filters,
      items: functionals?.items,
      fetchAction: getAllFunctionals,
      setFilterParams: setFilters,
    });

  const { mutate: createFunctional, isPending: isCreateFunctionalPending } =
    useMutation({
      mutationFn: (params: ICreateFunctionalParams) =>
        FunctionalAPI.createFunctional(params),
      onSuccess: (res) => {
        message.success(res?.message || 'Tạo mới thành công');

        handleModalCancel();
        handleCancelFilter();
      },
      onError: (error: any) => {
        message.error(`Tạo mới thất bại: ${error?.response?.data?.message}`);
      },
    });

  const { mutate: updateFunctional, isPending: isUpdateFunctionalPending } =
    useMutation({
      mutationFn: (params: IUpdateFunctionalParams) =>
        FunctionalAPI.updateFunctional(params),
      onSuccess: (res) => {
        message.success(res?.message || 'Cập nhật thành công');

        setFilters({
          page: 1,
          pageSize: 10,
          ...filters,
        });
        handleModalCancel();
      },
      onError: (error: any) => {
        message.error(
          `Cập nhật thông tin thất bại: ${error?.response?.data?.message}`
        );
      },
    });

  const { mutate: deleteFunctional, isPending: isDeleteFunctionalPending } =
    useMutation({
      mutationFn: (id: number) => FunctionalAPI.deleteFunctional(id),
      onSuccess: (res) => {
        message.success(res?.message || 'Xóa thành công');

        setFilters({
          page: 1,
          pageSize: 10,
          ...filters,
        });
      },
      onError: (error: any) => {
        message.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`);
      },
    });

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        align: 'center',
        render: (_, __, index: number) =>
          index + 1 + pageInfo.pageSize * (pageInfo.page - 1),
      },
      {
        width: 250,
        dataIndex: 'title',
        title: 'Tên chức năng',
      },
      {
        width: 50,
        title: 'Mã',
        dataIndex: 'code',
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
    ] as ColumnsType<IFunctionalItem>;
  }, [pageInfo]);

  const handleCancelFilter = useCallback(() => {
    setFilters({});
    setIsOpenFilter(false);

    filterForm.resetFields();
    hanldeClearURLSearchParams({
      tab: FUNCTIONAL_TAB_ITEM_KEY.FUNCTIONAL,
    });
  }, []);

  const handleFinishFilter = useCallback((values: IFilterFunctionalForm) => {
    setFilters(values);
  }, []);

  const handleEdit = useCallback(
    (record: IFunctionalItem) => {
      const { id, ...others } = record;
      form.setFieldsValue({ ...others });

      setEditIndex(id);
      setIsOpenModal(true);
    },
    [form]
  );

  const handleDelete = useCallback((id: number) => {
    if (id === null || id === undefined) {
      message.error('Không tìm thấy thông tin chức năng cần xóa!');
      return;
    }

    deleteFunctional(id);
  }, []);

  const handleModalCancel = useCallback(() => {
    form.resetFields();

    setEditIndex(-1);
    setIsOpenModal(false);
  }, [form]);

  const handleFinish = useCallback(() => {
    if (editIndex === -1) {
      createFunctional(form.getFieldsValue());
      return;
    }

    const params: IUpdateFunctionalParams = {
      id: editIndex,
      ...form.getFieldsValue(),
    };
    updateFunctional(params);
  }, [editIndex]);

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
      <FilterFunctional
        form={filterForm}
        isOpen={isOpenFilter}
        onCancel={handleCancelFilter}
        onFinish={handleFinishFilter}
        onPageChange={handlePageChange}
      />
      <Content>
        <Table<IFunctionalItem>
          columns={columns}
          loading={loading || isDeleteFunctionalPending}
          dataSource={functionals?.items}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: functionals?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
      <Modal
        isOpen={isOpenModal}
        title={editIndex !== -1 ? 'Chỉnh sửa chức năng' : 'Thêm chức năng'}
        footer={
          <Flex justify="end" gap={16}>
            <Button
              title="Hủy"
              iconBefore={<CloseOutlined />}
              loading={isCreateFunctionalPending || isUpdateFunctionalPending}
              onClick={handleModalCancel}
            />
            <Button
              fill
              title="Lưu"
              iconBefore={<SaveOutlined />}
              loading={isCreateFunctionalPending || isUpdateFunctionalPending}
              onClick={() => form.submit()}
            />
          </Flex>
        }
        onCancel={handleModalCancel}
      >
        <FormWrapper footer={<></>} form={form} onFinish={handleFinish}>
          <FormItem
            label="Mã"
            name="code"
            rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
          >
            <Input placeholder="Ví dụ: Tạo công việc ứng tuyển" />
          </FormItem>
          <FormItem
            label="Tên chức năng"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập chức năng' }]}
          >
            <Input placeholder="Ví dụ: create_new_job	" />
          </FormItem>
        </FormWrapper>
      </Modal>
    </>
  );
};

export default memo(Functional);
