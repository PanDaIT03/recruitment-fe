import { useMutation } from '@tanstack/react-query';
import { Col, Flex, message, Row, Space, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IAdminUpdateUser,
  IGetAllUserAdmin,
  UserAdminApi,
} from '~/apis/userAdmin';
import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import SwitchButton from '~/components/Button/SwitchButton';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal from '~/components/Modal/Modal';
import { RadioGroup } from '~/components/Radio/Radio';
import Select from '~/components/Select/Select';
import Table from '~/components/Table/Table';
import { PERMISSION_TAB_ITEM_KEY } from '~/enums';
import usePagination from '~/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllStatus } from '~/store/thunk/status';
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
  statusId: number;
}

export type IFormFilter = Partial<{
  email: string;
  roleId: number;
  statusId: number;
  jobFieldsId: number[];
}>;

const { EditOutlined, EyeOutlined, CloseOutlined, SaveOutlined } = icons;

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formFilter] = useForm<IFormFilter>();
  const [formUserAdmin] = useForm<IUserAdminForm>();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [filterParams, setFilterParams] = useState<IFormFilter>();

  const { userAdmin, loading } = useAppSelector((state) => state.userAdmin);
  const { roles, loading: roleLoading } = useAppSelector((state) => state.role);
  const { status, loading: statusLoading } = useAppSelector(
    (state) => state.status
  );

  const isTableLoading = useMemo(
    () => loading || statusLoading || roleLoading,
    [loading, statusLoading, roleLoading]
  );

  const { pageInfo, handlePageChange, hanldeClearURLSearchParams } =
    usePagination({
      items: userAdmin.items,
      extraParams: filterParams,
      fetchAction: getAllUserAdmin,
      setFilterParams: setFilterParams,
    });

  const { mutate: updateUser, isPending: isUpdateUserPending } = useMutation({
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
    dispatch(getAllStatus({ type: 'account' }));
  }, []);

  const refetchUserAdmin = useCallback((params?: IGetAllUserAdmin) => {
    const formattedParams = params || {};
    dispatch(getAllUserAdmin(formattedParams));
  }, []);

  const handleEdit = useCallback((record: IUserAdminItem) => {
    formUserAdmin.setFieldsValue({
      userId: record.id,
      email: record?.email,
      role: record?.role?.id,
      fullName: record?.fullName,
      statusId: record?.status?.id,
    });

    setIsOpenModal(true);
  }, []);

  const handleCancelModal = useCallback(() => {
    formUserAdmin.resetFields();
    setIsOpenModal(false);
  }, []);

  const handleFinishEditUser = useCallback(
    (values: IUserAdminForm) => {
      const { role, statusId } = values;
      const userId = formUserAdmin.getFieldValue('userId');

      updateUser({
        userId,
        statusId,
        roleId: role,
      });
    },
    [formUserAdmin]
  );

  const handleFilter = useCallback((values: any) => {
    setFilterParams(values);
  }, []);

  const handleCancelFilter = useCallback(() => {
    setFilterParams({});
    setIsOpenFilter(false);
    hanldeClearURLSearchParams({
      tab: PERMISSION_TAB_ITEM_KEY.USER,
    });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        dataIndex: 'id',
        render: (_: any, __: any, index: number) =>
          index + 1 + pageInfo.pageSize * (pageInfo.page - 1),
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
        title: 'Vai trò',
        dataIndex: ['role', 'title'],
        className: 'capitalize',
      },
      {
        width: 250,
        title: 'Lĩnh vực',
        dataIndex: '',
        render: () => '-',
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
                navigate(PATH.ADMIN_PERMISSION_USER_DETAIL, { state: record })
              }
            />
            <SwitchButton
              checked={record?.isActive}
              onChange={() => {
                const newStatusId = status?.items?.filter(
                  (status) => status?.code !== record?.status?.code
                )?.[0]?.id;

                updateUser({
                  userId: record.id,
                  statusId: newStatusId,
                });
              }}
            />
          </Space>
        ),
      },
    ] as ColumnsType<IUserAdminItem>;
  }, [userAdmin, status, pageInfo]);

  return (
    <>
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
        setFilterParams={setFilterParams}
      />
      <Content>
        <Table<IUserAdminItem>
          columns={columns}
          loading={isTableLoading}
          dataSource={userAdmin.items}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo.pageSize,
            total: userAdmin?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
      <Modal
        isOpen={isOpenModal}
        title="Chỉnh sửa người dùng"
        footer={
          <Flex justify="end" gap={16}>
            <Button
              title="Hủy"
              iconBefore={<CloseOutlined />}
              loading={isUpdateUserPending}
              onClick={handleCancelModal}
            />
            <Button
              fill
              title="Lưu"
              iconBefore={<SaveOutlined />}
              loading={isUpdateUserPending}
              onClick={() => formUserAdmin.submit()}
            />
          </Flex>
        }
        onCancel={handleCancelModal}
      >
        <FormWrapper form={formUserAdmin} onFinish={handleFinishEditUser}>
          <FormItem label="Tên" name="fullName">
            <Input disabled placeholder="Ví dụ: Nguyễn Văn A" />
          </FormItem>
          <FormItem label="Email" name="email">
            <Input disabled placeholder="Ví dụ: abc@gmail.com" />
          </FormItem>
          <FormItem
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select
              loading={roleLoading}
              placeholder="Chọn vai trò"
              options={roles?.items?.map((item) => ({
                label: item?.title,
                value: item?.id,
              }))}
            />
          </FormItem>
          <FormItem
            label="Trạng thái"
            name="statusId"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <RadioGroup
              options={status?.items?.map((item) => ({
                label: item?.title,
                value: item?.id,
              }))}
            />
          </FormItem>
        </FormWrapper>
      </Modal>
    </>
  );
};

export default memo(UserList);
