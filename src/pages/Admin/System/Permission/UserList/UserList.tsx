import { useMutation } from '@tanstack/react-query';
import { Col, Image, message, Row, Space, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  IAdminUpdateUser,
  IGetAllUserAdmin,
  UserAdminApi,
} from '~/apis/userAdmin';
import { AvatarPlaceHolder, FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import SwitchButton from '~/components/Button/SwitchButton';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { PERMISSION_TAB_ITEM_KEY } from '~/enums';
import usePagination from '~/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllStatus } from '~/store/thunk/status';
import { getAllUserAdmin } from '~/store/thunk/userAdmin';
import { IUserAdminItem } from '~/types/User/userAdmin';
import icons from '~/utils/icons';
import ModalUser from './ModalUser';
import UserFilter from './UserFilter';

export interface IUserAdminForm {
  userId: number;
  fullName: string;
  email: string;
  role: number;
  statusId: number;
  jobPosition: string;
  jobFields: string;
  phoneNumber: string;
  companyUrl: string;
}

export type IFormFilter = Partial<{
  email: string;
  roleId: number;
  statusId: number;
  createdDate: string;
  jobFieldsId: number[];
}>;

const { EditOutlined } = icons;

const UserList = () => {
  const dispatch = useAppDispatch();

  const [formFilter] = useForm<IFormFilter>();
  const [formUserAdmin] = useForm<IUserAdminForm>();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [filterParams, setFilterParams] = useState<IFormFilter>();

  const { userAdmin, loading } = useAppSelector((state) => state.userAdmin);
  const { status, loading: statusLoading } = useAppSelector(
    (state) => state.status
  );

  const isTableLoading = useMemo(
    () => loading || statusLoading,
    [loading, statusLoading]
  );

  const { pageInfo, handlePageChange, handleClearURLSearchParams } =
    usePagination({
      extraParams: filterParams,
      setFilterParams: setFilterParams,
      fetchFn: (params: IGetAllUserAdmin) => dispatch(getAllUserAdmin(params)),
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

  const refetchUserAdmin = useCallback(() => {
    const params: IGetAllUserAdmin = {
      ...filterParams,
    };

    dispatch(getAllUserAdmin(params));
  }, [filterParams]);

  const handleEdit = useCallback((record: IUserAdminItem) => {
    const { role, jobPosition, usersJobFields, status } = record;
    const fieldsValue: IUserAdminForm = {
      userId: record.id,
      ...record,
      role: role.id,
      statusId: status.id,
      jobPosition: jobPosition?.title,
      jobFields: usersJobFields
        ?.map((item) => item?.jobField?.title)
        ?.join(', '),
    };

    const formattedValues = Object.entries(fieldsValue).reduce(
      (prevVal, currentVal) => {
        const [key, value] = currentVal;
        value ? (prevVal[key] = value) : (prevVal[key] = '-');

        return prevVal;
      },
      {} as Record<string, any>
    );

    formUserAdmin.setFieldsValue(formattedValues);
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

  const handleFilter = useCallback((values: IFormFilter) => {
    setFilterParams(values);
  }, []);

  const handleCancelFilter = useCallback(() => {
    setFilterParams({});
    setIsOpenFilter(false);
    handleClearURLSearchParams({
      tab: PERMISSION_TAB_ITEM_KEY.USER,
    });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        align: 'center',
        dataIndex: 'id',
        render: (_: any, __: any, index: number) =>
          index + 1 + pageInfo.pageSize * (pageInfo.page - 1),
      },
      {
        width: 70,
        align: 'center',
        title: 'Avatar',
        dataIndex: 'avatarUrl',
        render: (value) => (
          <div className="flex items-center justify-center">
            {value ? (
              <Image
                width={40}
                height={40}
                src={value}
                preview={false}
                className="rounded-full"
              />
            ) : (
              <AvatarPlaceHolder />
            )}
          </div>
        ),
      },
      {
        width: 180,
        dataIndex: 'fullName',
        title: 'Tên',
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
        onPageChange={handlePageChange}
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
      <ModalUser
        isOpen={isOpenModal}
        form={formUserAdmin}
        loading={isUpdateUserPending}
        onCancel={handleCancelModal}
        onFinish={handleFinishEditUser}
      />
    </>
  );
};

export default memo(UserList);
