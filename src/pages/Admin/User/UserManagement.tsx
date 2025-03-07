import { useMutation } from '@tanstack/react-query';
import { Col, Flex, message, Row, Space, Spin, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IAdminUpdateUser, UserAdminApi } from '~/apis/userAdmin';
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
import { getAllUserAdmin } from '~/store/thunk/userAdmin';
import { IUserAdminItem } from '~/types/User/userAdmin';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import UserFilter from './UserFilter';

interface IUserAdminForm {
  userId: number;
  fullName: string;
  email: string;
  role: number;
  status: string;
}

const { EyeOutlined, EditOutlined, CloseOutlined, SaveOutlined } = icons;

const statusOptions: DefaultOptionType[] = [
  { label: 'Hoạt động', value: 'true' },
  { label: 'Ngừng hoạt động', value: 'false' },
];

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const dispatch = useAppDispatch();
  const queryParams = useQueryParams();
  const { setBreadcrumb } = useBreadcrumb();

  const [formFilter] = useForm();
  const [formUserAdmin] = useForm<IUserAdminForm>();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const { userAdmin, loading } = useAppSelector((state) => state.userAdmin);
  const { roles, loading: roleLoading } = useAppSelector((state) => state.role);

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const { currentPage, itemsPerPage, handlePageChange } = usePagination({
    items: userAdmin.items,
    fetchAction: getAllUserAdmin,
    pageInfo: {
      currentPage: paginationParams.page,
      itemsPerPage: paginationParams.pageSize,
      totalItems: userAdmin.pageInfo.totalItems,
    },
  });

  const { mutate: updateUserRole, isPending: isUpdateUserRolePending } =
    useMutation({
      mutationFn: (params: IAdminUpdateUser) => UserAdminApi.updateUser(params),
      onSuccess: (res) => {
        message.success(res?.message || 'Cập nhật thành công');

        handleCancelModal();
        refetchUserAdmin();
      },
      onError: (error: any) =>
        message.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`),
    });

  useEffect(() => {
    setTitle('Danh sách người dùng');
    setBreadcrumb([{ title: 'Quản lý' }, { title: 'Danh sách người dùng' }]);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        dataIndex: 'id',
        render: (_: any, __: any, index: number) =>
          index + 1 + paginationParams.pageSize * (paginationParams.page - 1),
      },
      {
        width: 180,
        dataIndex: 'fullName',
        title: 'Tên người dùng',
      },
      {
        width: 200,
        title: 'Email',
        dataIndex: 'email',
      },
      {
        width: 100,
        title: 'Quyền',
        dataIndex: ['role', 'title'],
        className: 'capitalize',
      },
      {
        width: 150,
        title: 'Trạng thái',
        dataIndex: 'isActive',
        render: (isActive: boolean) =>
          isActive ? (
            <Tag color="green">Hoạt động</Tag>
          ) : (
            <Tag color="red">Ngừng hoạt động</Tag>
          ),
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
        width: 100,
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (_, record) => (
          <Space>
            <ButtonAction
              title={<EditOutlined />}
              tooltipTitle="Chỉnh sửa"
              onClick={() => handleEdit(record)}
            />
            <ButtonAction
              title={<EyeOutlined />}
              tooltipTitle="Xem chi tiết"
              onClick={() =>
                navigate(PATH.ADMIN_USER_DETAIL, { state: record })
              }
            />
          </Space>
        ),
      },
    ] as ColumnsType<IUserAdminItem>;
  }, [paginationParams]);

  const refetchUserAdmin = useCallback(() => {
    dispatch(getAllUserAdmin());
  }, []);

  const handleEdit = useCallback((record: IUserAdminItem) => {
    formUserAdmin.setFieldsValue({
      userId: record.id,
      email: record?.email,
      role: record?.role?.id,
      fullName: record?.fullName,
      status: record?.isActive?.toString(),
    });

    setIsOpenModal(true);
  }, []);

  const handleFilter = useCallback((values: any) => {
    console.log('filter', values);
  }, []);

  const handleCancelFilter = useCallback(() => {
    console.log('cancel');
    setIsOpenFilter(false);
  }, []);

  const handleFinishEditUser = useCallback(
    (values: IUserAdminForm) => {
      const { role, status } = values;
      const userId = formUserAdmin.getFieldValue('userId');

      const params: IAdminUpdateUser = {
        userId,
        roleId: role,
        status: status === 'true' ? true : false,
      };
      updateUserRole(params);
    },
    [formUserAdmin]
  );

  const handleCancelModal = useCallback(() => {
    formUserAdmin.resetFields();
    setIsOpenModal(false);
  }, []);

  return (
    <Spin spinning={loading || roleLoading}>
      <Row align="middle" justify="end">
        <Col>
          <Button
            title={<FilterAdmin />}
            className="bg-white"
            onClick={() => setIsOpenFilter((prev) => !prev)}
          />
        </Col>
      </Row>
      <UserFilter
        form={formFilter}
        open={isOpenFilter}
        onFinish={handleFilter}
        onCancel={handleCancelFilter}
      />
      <Content>
        <Table<IUserAdminItem>
          columns={columns}
          dataSource={userAdmin.items}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: userAdmin?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
      <Modal
        isOpen={isOpenModal}
        title="Chỉnh sửa quyền cho người dùng"
        footer={
          <Flex justify="end" gap={16}>
            <Button
              title="Hủy"
              iconBefore={<CloseOutlined />}
              loading={isUpdateUserRolePending}
              onClick={handleCancelModal}
            />
            <Button
              fill
              title="Lưu"
              iconBefore={<SaveOutlined />}
              loading={isUpdateUserRolePending}
              onClick={() => formUserAdmin.submit()}
            />
          </Flex>
        }
        onCancel={handleCancelModal}
      >
        <FormWrapper form={formUserAdmin} onFinish={handleFinishEditUser}>
          <FormItem label="Tên" name="fullName">
            <Input readOnly placeholder="Ví dụ: Nguyễn Văn A" />
          </FormItem>
          <FormItem label="Email" name="email">
            <Input readOnly placeholder="Ví dụ: abc@gmail.com" />
          </FormItem>
          <FormItem
            label="Quyền"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn quyền' }]}
          >
            <Select
              loading={roleLoading}
              placeholder="Chọn quyền"
              options={roles?.items?.map((item) => ({
                label: item?.title,
                value: item?.id,
              }))}
            />
          </FormItem>
          <FormItem
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              loading={roleLoading}
              options={statusOptions}
              placeholder="Chọn trạng thái"
            />
          </FormItem>
        </FormWrapper>
      </Modal>
    </Spin>
  );
};

export default UserManagement;
