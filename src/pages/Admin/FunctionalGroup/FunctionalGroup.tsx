import { useMutation } from '@tanstack/react-query';
import { Col, Flex, message, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterAdmin } from '~/assets/svg';

import { FunctionalAPI, IGetAllFunctionalParams } from '~/apis/functional';
import {
  FunctionalGroupAPI,
  ICreateFuncGroupParams,
  IUpdateFuncGroupParams,
} from '~/apis/functionalGroup';
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

interface IFunctionalGroupForm {
  title: string;
  description: string;
  functionalIds: number[];
}

const {
  EditOutlined,
  CloseOutlined,
  PlusOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
} = icons;

const FunctionalGroup = () => {
  const dispatch = useAppDispatch();
  const queryParams = useQueryParams();

  const [functionalForm] = useForm<IFunctionalGroupForm>();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [editIndex, setEditIndex] = useState<number>();

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

  const {
    data: functionals,
    mutate: getAllFunctionals,
    isPending: isGetAllFunctionalsPending,
  } = useMutation({
    mutationFn: (params: IGetAllFunctionalParams) =>
      FunctionalAPI.getAllFunctionals(params),
    onError: (error: any) => {
      message.error(error?.response?.data?.message);
    },
  });

  const {
    mutate: createFunctionalGroup,
    isPending: isCreateFunctionalGroupPending,
  } = useMutation({
    mutationFn: (params: ICreateFuncGroupParams) =>
      FunctionalGroupAPI.createFunctionalGroup(params),
    onSuccess: (res) => {
      message.success(res?.message);

      refetchFunctionalGroup();
      handleCancelModal();
    },
    onError: (error: any) => {
      message.error(`Tạo mới thất bại: ${error?.response?.data?.message}`);
    },
  });

  const {
    mutate: updateFunctionalGroup,
    isPending: isUpdateFunctionalGroupPending,
  } = useMutation({
    mutationFn: (params: IUpdateFuncGroupParams) =>
      FunctionalGroupAPI.updateFunctionalGroup(params),
    onSuccess: (res) => {
      message.success(res?.message);

      setEditIndex(undefined);
      refetchFunctionalGroup();
      handleCancelModal();
    },
    onError: (error: any) => {
      message.error(`Cập nhật thất bại: ${error?.response?.data?.message}`);
    },
  });

  const {
    mutate: deleteFunctionalGroup,
    isPending: isDeleteFunctionalGroupPending,
  } = useMutation({
    mutationFn: (id: number) => FunctionalGroupAPI.deleteFunctionalGroup(id),
    onSuccess: (res) => {
      message.success(res?.message);

      refetchFunctionalGroup();
      handleCancelModal();
    },
    onError: (error: any) => {
      message.error(`Xóa thất bại: ${error?.response?.data?.message}`);
    },
  });

  useEffect(() => {
    setTitle('Danh sách nhóm chức năng');
    setBreadcrumb([
      { title: 'Quản lý' },
      { title: 'Danh sách nhóm chức năng' },
    ]);
  }, []);

  useEffect(() => {
    if (!isOpenModal) return;

    getAllFunctionals({});
  }, [isOpenModal]);

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
        width: 150,
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
        width: 150,
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
        render: (_, record) => (
          <Flex justify="center">
            <ButtonAction
              tooltipTitle="Chỉnh sửa"
              title={<EditOutlined />}
              disabled={isDeleteFunctionalGroupPending}
              onClick={() => handleEdit(record)}
            />
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
              onConfirm={() => deleteFunctionalGroup(record?.id)}
            >
              <ButtonAction
                tooltipTitle="Xóa"
                title={<CloseOutlined />}
                disabled={isDeleteFunctionalGroupPending}
              />
            </Popconfirm>
          </Flex>
        ),
      },
    ] as ColumnsType<IFunctionalGroupItem>;
  }, [paginationParams, isDeleteFunctionalGroupPending]);

  const refetchFunctionalGroup = useCallback(() => {
    dispatch(getAllFunctionalGroups({}));
  }, []);

  const handleEdit = useCallback((record: IFunctionalGroupItem) => {
    setIsOpenModal(true);
    setEditIndex(record?.id);

    functionalForm.setFieldsValue({
      title: record?.title,
      description: record?.description,
      functionalIds: record?.functionals?.map((item) => item.id),
    });
  }, []);

  const handleCancelModal = useCallback(() => {
    functionalForm.resetFields();
    setIsOpenModal(false);
  }, []);

  const handleFinishModal = useCallback(
    (values: IFunctionalGroupForm) => {
      if (editIndex === undefined || editIndex === null) {
        createFunctionalGroup({
          ...values,
        });
        return;
      }

      const params: IUpdateFuncGroupParams = {
        ...values,
        id: editIndex,
      };
      updateFunctionalGroup(params);
    },
    [editIndex]
  );

  return (
    <>
      <Row gutter={[8, 16]} align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className={'bg-white'}
            disabled={isDeleteFunctionalGroupPending}
            onClick={() => setIsOpenFilter(true)}
          />
        </Col>
        <Col>
          <Button
            fill
            title="Tạo"
            iconBefore={<PlusOutlined />}
            disabled={isDeleteFunctionalGroupPending}
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
              loading={
                isCreateFunctionalGroupPending || isUpdateFunctionalGroupPending
              }
              onClick={handleCancelModal}
            />
            <Button
              fill
              title="Lưu"
              iconBefore={<SaveOutlined />}
              loading={
                isCreateFunctionalGroupPending || isUpdateFunctionalGroupPending
              }
              onClick={() => functionalForm.submit()}
            />
          </Flex>
        }
        onCancel={handleCancelModal}
      >
        <FormWrapper
          footer={<></>}
          form={functionalForm}
          onFinish={handleFinishModal}
        >
          <FormItem
            name="title"
            label="Tên nhóm chức năng"
            rules={[
              { required: true, message: 'Vui lòng nhập tên nhóm chức năng' },
            ]}
          >
            <Input placeholder="Ví dụ: Quản lý người dùng" />
          </FormItem>
          <FormItem
            name="functionalIds"
            label="Chức năng"
            rules={[{ required: true, message: 'Vui lòng chọn chức năng' }]}
          >
            <Select
              allowClear
              mode="multiple"
              placeholder="Chọn chức năng"
              loading={isGetAllFunctionalsPending}
              options={functionals?.items?.map((item: any) => ({
                label: item?.title,
                value: item?.id,
              }))}
            />
          </FormItem>
          <FormItem
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
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
