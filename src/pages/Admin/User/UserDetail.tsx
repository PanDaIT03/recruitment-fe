import { useMutation } from '@tanstack/react-query';
import { Flex, FormItemProps, Image, message, Space, Spin } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
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
import { RadioGroup } from '~/components/Radio/Radio';
import Select from '~/components/Select/Select';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { useAppSelector } from '~/hooks/useStore';
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
  status: boolean;
  roleId: number;
  jobFields: string;
  jobPosition: string;
}

const initialUserInfo = {} as IUserAdminItem;
const { SaveOutlined, CloseOutlined } = icons;

const radOptions: CheckboxGroupProps<boolean>['options'] = [
  {
    label: 'Hoạt động',
    value: true,
  },
  {
    label: 'Ngừng hoạt động',
    value: false,
  },
];

const UserDetail = () => {
  const location = useLocation();
  const [form] = useForm<IForm>();

  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { roles, loading } = useAppSelector((state) => state.role);
  const [userInfo, setuserInfo] = useState<IUserAdminItem>(initialUserInfo);

  const isEmployer = useMemo(
    () => userInfo?.role?.title === 'employer',
    [userInfo]
  );

  const { mutate: getUserInformation, isPending: isGetUserInformationPending } =
    useMutation({
      mutationFn: (id: string) => UserAdminApi.getAllUserAdmin({ id }),
      onSuccess: (res) => setuserInfo(res?.items?.[0]),
      onError: (error: any) =>
        message.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`),
    });

  const { mutate: updateUser, isPending: isUpdateUserPending } = useMutation({
    mutationFn: (params: IAdminUpdateUser) => UserAdminApi.updateUser(params),
    onSuccess: (res) => message.success(res?.message || 'Cập nhật thành công'),
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
                      name: 'status',
                      label: 'Trạng thái',
                      component: <RadioGroup options={radOptions} />,
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
                      name: 'status',
                      label: 'Trạng thái',
                      component: <RadioGroup options={radOptions} />,
                    },
                  ]),
            ],
          },
        ],
      }) as IFormItem,
    [form, isEmployer, radOptions, roles]
  );

  useEffect(() => {
    setTitle('Thông tin chi tiết người dùng');
    setBreadcrumb([
      { title: 'Quản lý', href: PATH.ADMIN_USER_MANAGEMENT },
      { title: 'Danh sách người dùng', href: PATH.ADMIN_USER_MANAGEMENT },
      { title: 'Thông tin chi tiết người dùng' },
    ]);
  }, []);

  useEffect(() => {
    if (!Object.keys(userInfo).length) return;

    const fieldsValue: IForm = {
      fullName: userInfo?.fullName,
      email: userInfo?.email,
      phoneNumber: userInfo?.phoneNumber,
      avatarUrl: userInfo?.avatarUrl,
      companyName: userInfo?.companyName,
      companyUrl: userInfo?.companyUrl,
      status: userInfo?.isActive,
      roleId: userInfo?.role?.id,
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
      const { roleId, status } = values;
      const params: IAdminUpdateUser = {
        roleId,
        status,
        userId: userInfo.id,
      };

      updateUser(params);
    },
    [userInfo]
  );

  return (
    <Spin spinning={loading || isGetUserInformationPending}>
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
              onClick={() => navigate(PATH.ADMIN_USER_MANAGEMENT)}
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
