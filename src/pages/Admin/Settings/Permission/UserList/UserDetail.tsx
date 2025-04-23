import { useMutation } from '@tanstack/react-query';
import { Flex, FormItemProps, Image, message, Space } from 'antd';
import { CheckboxOptionType } from 'antd/es/checkbox';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IAdminUpdateUser, UserAdminApi } from '~/apis/userAdmin';
import { AvatarPlaceHolder } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Spin from '~/components/Loading/Spin';
import { RadioGroup } from '~/components/Radio/Radio';
import Select from '~/components/Select/Select';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllStatus } from '~/store/thunk/status';
import { IUserAdminItem } from '~/types/User/userAdmin';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

interface IFormItem {
  form: FormInstance;
  children: Array<{
    items: Array<{ component: ReactElement } & FormItemProps>;
  }>;
}

interface IForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  companyName?: string;
  companyUrl?: string;
  roleId: number;
  statusId: number;
  jobFields: string;
  jobPosition: string;
}

const initialUserInfo = {} as IUserAdminItem;
const { SaveOutlined, CloseOutlined } = icons;

const UserDetail = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [form] = useForm<IForm>();

  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { roles, loading } = useAppSelector((state) => state.role);
  const { status, loading: statusLoading } = useAppSelector(
    (state) => state.status
  );
  const [userInfo, setuserInfo] = useState<IUserAdminItem>(initialUserInfo);

  const isEmployer = useMemo(
    () => userInfo?.role?.title === 'employer',
    [userInfo]
  );

  const statusRadOptions: CheckboxOptionType[] = useMemo(
    () =>
      status?.items?.map((item) => ({
        label: item?.title,
        value: item?.id,
      })),
    [status]
  );

  const { mutate: getUserInformation, isPending: isGetUserInformationPending } =
    useMutation({
      mutationFn: (id: number) => UserAdminApi.getAllUserAdmin({ id }),
      onSuccess: (res) => setuserInfo(res?.items?.[0]),
      onError: (error: any) =>
        message.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`),
    });

  const { mutate: updateUser, isPending: isUpdateUserPending } = useMutation({
    mutationFn: (params: IAdminUpdateUser) => UserAdminApi.updateUser(params),
    onSuccess: (res) => {
      message.success(res?.message || 'Cập nhật thành công');
      navigate(PATH.ADMIN_PERMISSION);
    },
    onError: (error: any) =>
      message.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`),
  });

  const formItems = useMemo(
    () =>
      ({
        form: form,
        children: [
          {
            items: [
              {
                name: 'fullName',
                label: 'Tên người dùng',
                component: <Input disabled />,
              },
              {
                name: 'email',
                label: 'Email',
                component: <Input disabled />,
              },
              {
                name: 'phoneNumber',
                label: 'Số điện thoại',
                component: <Input disabled />,
              },
              {
                name: 'roleId',
                label: 'Vai trò',
                component: (
                  <Select
                    options={roles.items?.map((item) => ({
                      label: item.title,
                      value: item.id,
                    }))}
                  />
                ),
              },
              ...(isEmployer
                ? [
                    {
                      name: 'statusId',
                      label: 'Trạng thái',
                      component: <RadioGroup options={statusRadOptions} />,
                    },
                  ]
                : []),
            ],
          },
          {
            items: [
              {
                name: 'jobFields',
                label: 'Lĩnh vực',
                component: <Input disabled />,
              },
              {
                name: 'jobPosition',
                label: 'Vị trí công việc',
                component: <Input disabled />,
              },
              ...(isEmployer
                ? [
                    {
                      name: 'companyName',
                      label: 'Công ty',
                      component: <Input disabled />,
                    },
                    {
                      name: 'companyUrl',
                      label: 'Website',
                      component: <Input disabled />,
                    },
                  ]
                : [
                    {
                      name: 'statusId',
                      label: 'Trạng thái',
                      component: <RadioGroup options={statusRadOptions} />,
                    },
                  ]),
            ],
          },
        ],
      }) as IFormItem,
    [roles, isEmployer, form, statusRadOptions]
  );

  useEffect(() => {
    setTitle('Thông tin chi tiết người dùng');
    setBreadcrumb([
      { title: 'Cài đặt' },
      { title: 'Phân quyền', href: PATH.ADMIN_PERMISSION },
      { title: 'Thông tin chi tiết người dùng' },
    ]);
  }, []);

  useEffect(() => {
    if (!!status?.items.length) return;
    dispatch(getAllStatus({ type: 'account' }));
  }, [status]);

  useEffect(() => {
    if (!Object.keys(userInfo).length) return;

    const fieldsValue: IForm = {
      fullName: userInfo?.fullName,
      email: userInfo?.email,
      phoneNumber: userInfo?.phoneNumber || '-',
      avatarUrl: userInfo?.avatarUrl,
      companyName: userInfo?.companyName,
      companyUrl: userInfo?.companyUrl,
      roleId: userInfo?.role?.id,
      statusId: userInfo?.status?.id,
      jobPosition: userInfo?.jobPosition?.title || '-',
      jobFields:
        userInfo?.usersJobFields
          ?.map((item) => item?.jobField?.title)
          ?.join(', ') || '-',
    };

    const formattedFieldsValue = Object.entries(fieldsValue).reduce(
      (prevVal, [name, value]) => {
        prevVal[name] = value !== null || value !== undefined ? value : '-';
        return prevVal;
      },
      {} as Record<string, any>
    );
    form.setFieldsValue(formattedFieldsValue);
  }, [form, userInfo]);

  useEffect(() => {
    const userId = location.state?.id;
    if (userId === null || userId === undefined) {
      message.error('Không tìm thấy thông tin người dùng!');
      return;
    }

    getUserInformation(userId);
  }, [location]);

  const handleFinish = useCallback(
    (values: IForm) => {
      const { roleId, statusId } = values;
      const params: IAdminUpdateUser = {
        roleId,
        statusId,
        userId: userInfo.id,
      };

      updateUser(params);
    },
    [userInfo]
  );

  return (
    <Spin spinning={loading || isGetUserInformationPending || statusLoading}>
      <Content>
        <Space direction="vertical" size="middle" className="w-full">
          <Space direction="vertical" align="center" className="w-full">
            <div className="relative w-fit rounded-full border-[3px] border-white">
              <div className="rounded-full bg-white w-[120px] h-[120px]">
                <div className="inline-block aspect-square h-full w-full rounded-full border border-gray-200 overflow-hidden">
                  {userInfo.avatarUrl ? (
                    <Image
                      width={120}
                      height={120}
                      src={userInfo?.avatarUrl}
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarPlaceHolder width={120} height={120} />
                  )}
                </div>
              </div>
            </div>
          </Space>
          <FormWrapper form={formItems.form} onFinish={handleFinish}>
            <div className="grid grid-cols-2 gap-5">
              {formItems.children?.map((formItem, index) => (
                <Space
                  key={index}
                  size="small"
                  direction="vertical"
                  className="w-full"
                >
                  {formItem.items?.map(({ component, ...rest }, itemIndex) => (
                    <FormItem key={itemIndex} {...rest}>
                      {component}
                    </FormItem>
                  ))}
                </Space>
              ))}
            </div>
          </FormWrapper>
          <Flex justify="center" gap={12}>
            <Button
              title="Hủy"
              iconBefore={<CloseOutlined />}
              loading={isUpdateUserPending}
              onClick={() => navigate(PATH.ADMIN_PERMISSION)}
            />
            <Button
              fill
              title="Lưu"
              loading={isUpdateUserPending}
              iconBefore={<SaveOutlined />}
              onClick={() => form.submit()}
            />
          </Flex>
        </Space>
      </Content>
    </Spin>
  );
};

export default UserDetail;
