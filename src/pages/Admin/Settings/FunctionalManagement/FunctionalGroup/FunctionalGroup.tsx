import { useMutation } from '@tanstack/react-query';
import { Col, Flex, message, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  FunctionalGroupAPI,
  ICreateFuncGroupParams,
  IGetFuncGroupParams,
  IUpdateFuncGroupParams,
} from '~/apis/functionalGroup';
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
import { FUNCTIONAL_TAB_ITEM_KEY } from '~/enums';
import usePagination from '~/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';
import { getAllFunctionalGroups } from '~/store/thunk/functionalGroup';
import { IFunctionalItem } from '~/types/Functional';
import { IFunctionalGroupItem } from '~/types/FunctionalGroup';
import icons from '~/utils/icons';
import FilterFunctionalGroup from './FilterFunctionalGroup';

interface IFunctionalGroupForm {
  title: string;
  description: string;
  createdDate: string;
  functionalIds: number[];
}

export interface IFilterFunctionalGroupForm {
  title: string;
  createdDate?: string;
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

  const [functionalForm] = useForm<IFunctionalGroupForm>();
  const [filterForm] = useForm<IFilterFunctionalGroupForm>();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [editIndex, setEditIndex] = useState<number>();
  const [filter, setFilter] = useState<Partial<IGetFuncGroupParams>>();

  const { functionalGroups, loading: functionalGroupLoading } = useAppSelector(
    (state) => state.functionalGroup
  );
  const { functionals, loading: functionalLoading } = useAppSelector(
    (state) => state.functional
  );

  const { pageInfo, handlePageChange, hanldeClearURLSearchParams } =
    usePagination({
      extraParams: filter,
      items: functionalGroups?.items,
      fetchAction: getAllFunctionalGroups,
      setFilterParams: setFilter,
    });

  const {
    mutate: createFunctionalGroup,
    isPending: isCreateFunctionalGroupPending,
  } = useMutation({
    mutationFn: (params: ICreateFuncGroupParams) =>
      FunctionalGroupAPI.createFunctionalGroup(params),
    onSuccess: (res) => {
      message.success(res?.message);

      handleCancelModal();
      handleCancelFilter();
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
      setFilter({
        page: 1,
        pageSize: 10,
        ...filter,
      });

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

      setFilter({
        page: 1,
        pageSize: 10,
        ...filter,
      });
      handleCancelModal();
    },
    onError: (error: any) => {
      message.error(`Xóa thất bại: ${error?.response?.data?.message}`);
    },
  });

  useEffect(() => {
    dispatch(getAllFunctionals({ type: 'combobox' }));
  }, []);

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
        title: 'Chức năng',
        render: (value: IFunctionalItem[]) => (
          <p className="line-clamp-2">
            {value?.map((item) => item?.title)?.join(', ')}
          </p>
        ),
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
        width: 80,
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (_, record) => (
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
              title={<span className="text-black">Xoá mục này</span>}
              description={
                <span className="text-black">
                  Bạn có chắc chắn muốn xoá mục này?
                </span>
              }
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => deleteFunctionalGroup(record?.id)}
            >
              <ButtonAction tooltipTitle="Xóa" title={<CloseOutlined />} />
            </Popconfirm>
          </Flex>
        ),
      },
    ] as ColumnsType<IFunctionalGroupItem>;
  }, [pageInfo]);

  const handleEdit = useCallback((record: IFunctionalGroupItem) => {
    setIsOpenModal(true);
    setEditIndex(record?.id);

    functionalForm.setFieldsValue({
      title: record?.title,
      description: record?.description,
      functionalIds: record?.functionals?.map((item) => item.id),
    });
  }, []);

  const handleCancelFilter = useCallback(() => {
    setFilter({});
    setIsOpenFilter(false);

    filterForm.resetFields();
    hanldeClearURLSearchParams({
      tab: FUNCTIONAL_TAB_ITEM_KEY.FUNCTIONAL_GROUP,
    });
  }, []);

  const handleFinishFilter = useCallback(
    (values: IFilterFunctionalGroupForm) => {
      setFilter((prev) => ({ ...prev, ...values }));
    },
    []
  );

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
      <FilterFunctionalGroup
        form={filterForm}
        isOpen={isOpenFilter}
        onCancel={handleCancelFilter}
        onFinish={handleFinishFilter}
        onPageChange={handlePageChange}
      />
      <Content>
        <Table
          columns={columns}
          dataSource={functionalGroups.items}
          loading={functionalGroupLoading || isDeleteFunctionalGroupPending}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: functionalGroups?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
      <Modal
        isOpen={isOpenModal}
        title={editIndex ? 'Chỉnh sửa nhóm chức năng' : 'Tạo nhóm chức năng'}
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
        <FormWrapper form={functionalForm} onFinish={handleFinishModal}>
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
              loading={functionalLoading}
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

export default memo(FunctionalGroup);
