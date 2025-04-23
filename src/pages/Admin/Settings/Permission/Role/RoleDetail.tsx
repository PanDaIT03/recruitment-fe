import { useMutation } from '@tanstack/react-query';
import { Checkbox, Divider, Flex, Form, Input, message, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICreateRoleParam, IUpdateRoleParam, RoleApi } from '~/apis/role/role';

import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import List from '~/components/List/List';
import Spin from '~/components/Loading/Spin';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { PERMISSION_TAB_ITEM_KEY } from '~/enums';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionalGroups } from '~/store/thunk/functionalGroup';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

interface IFunctionalForm {
  title: string;
  description: string;
  functionalIds: number[];
}

const { SaveOutlined } = icons;

const RoleDetail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { queryParams } = useQueryParams();

  const roleId = queryParams.get('id');
  const [functionalForm] = Form.useForm<IFunctionalForm>();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { functionalGroups, loading } = useAppSelector(
    (state) => state.functionalGroup
  );

  const { mutate: createRole, isPending: isCreateRolePending } = useMutation({
    mutationFn: (params: ICreateRoleParam) => RoleApi.createRole(params),
    onSuccess: (res) => {
      message.success(res?.message);
      handleNavigate();
    },
    onError: (error: any) => {
      message.error(`Tạo mới thất bại: ${error?.response?.data?.message}`);
    },
  });

  const { mutate: getRoleById, isPending: isGetRoleByIdPending } = useMutation({
    mutationFn: (id: number) => RoleApi.getAllRoles({ id: id }),
    onSuccess: (res) => {
      const item = res?.items?.[0];

      functionalForm.setFieldsValue({
        title: item?.title,
        description: item?.description,
        functionalIds: item?.rolesFunctionals?.map(
          (item) => item?.functionalsId
        ),
      });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message);
    },
  });

  const { mutate: updateRole, isPending: isUpdateRolePending } = useMutation({
    mutationFn: (params: IUpdateRoleParam) => RoleApi.updateRole(params),
    onSuccess: (res) => {
      message.success(res?.message);
      handleNavigate();
    },
    onError: (error: any) => {
      message.error(`Cập nhật thất bại: ${error?.response?.data?.message}`);
    },
  });

  const isSpinning = useMemo(
    () =>
      loading ||
      isCreateRolePending ||
      isGetRoleByIdPending ||
      isUpdateRolePending,
    [loading, isCreateRolePending, isGetRoleByIdPending, isUpdateRolePending]
  );

  const refetchFunctionalGroup = useCallback(() => {
    dispatch(getAllFunctionalGroups({}));
  }, []);

  const handleNavigate = useCallback(() => {
    navigate(`${PATH.ADMIN_PERMISSION}?tab=${PERMISSION_TAB_ITEM_KEY.ROLE}`);
  }, []);

  useEffect(() => {
    let title = '';
    if (roleId === null || roleId === undefined) title = 'Thêm mới chức vụ';
    else title = 'Chỉnh sửa chức vụ';

    setTitle(title);
    setBreadcrumb([
      { title: 'Cài đặt' },
      { title: 'Phân quyền', href: PATH.ADMIN_PERMISSION },
      { title: title },
    ]);
  }, [roleId]);

  useEffect(() => {
    if (roleId === null || roleId === undefined) return;
    getRoleById(+roleId);
  }, [roleId]);

  useEffect(() => {
    refetchFunctionalGroup();
  }, [refetchFunctionalGroup]);

  const handleCancel = useCallback(() => {
    functionalForm.resetFields();
    handleNavigate();
  }, []);

  const handleFinish = useCallback(
    (values: IFunctionalForm) => {
      const { title, description, functionalIds } = values;

      if (roleId) {
        const params: IUpdateRoleParam = {
          id: +roleId,
          functionalIds,
          title: title?.trim(),
          description: description?.trim(),
        };

        updateRole(params);
        return;
      }

      createRole({
        functionalIds,
        title: title?.trim(),
        description: description?.trim(),
      });
    },
    [roleId]
  );

  return (
    <>
      <Spin fullHeight={false} spinning={isSpinning}>
        <FormWrapper
          form={functionalForm}
          footer={
            <Flex justify="end" gap={12} className="mt-2">
              <Button title="Hủy" className="bg-white" onClick={handleCancel} />
              <Button
                fill
                title="Lưu"
                iconBefore={<SaveOutlined />}
                onClick={() => functionalForm.submit()}
              />
            </Flex>
          }
          onFinish={handleFinish}
        >
          <div className="grid grid-cols-10 gap-4">
            <Content className="col-span-3">
              <h2 className="text-base font-semibold">1. Thông tin chức vụ</h2>
              <Space direction="vertical" className="w-full pt-2 pl-2">
                <FormItem
                  name="title"
                  label="Tên chức vụ"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên chức vụ' },
                  ]}
                >
                  <Input
                    allowClear
                    placeholder="Ví dụ: Admin"
                    className="w-full min-h-10"
                  />
                </FormItem>
                <FormItem name="description" label="Mô tả chức vụ">
                  <TextArea
                    allowClear
                    placeholder="Ví dụ: Quản lý..."
                    className="w-full !min-h-32"
                  />
                </FormItem>
              </Space>
            </Content>
            <Content className="col-span-7">
              <Space direction="vertical" className="w-full">
                <h2 className="text-base font-semibold">
                  2. Phân quyền chức năng
                </h2>
                <div className="bg-white py-2 px-4 rounded-md w-full overflow-auto">
                  <ul className="flex text-[#F15227] font-medium mb-2">
                    <li className="min-w-[200px]">Tên nhóm chức năng</li>
                    <li className="min-w-[336px]">Chức năng</li>
                    <li className="min-w-[150px]">Mã chức năng</li>
                  </ul>
                  <FormItem name="functionalIds">
                    <Checkbox.Group className="w-full">
                      <List
                        className="w-full"
                        pagination={false}
                        dataSource={functionalGroups?.items}
                        renderItem={(record, index) => {
                          const gap = 8;
                          const itemsHeight =
                            22 * record?.functionals?.length +
                            (gap * record?.functionals?.length - gap);

                          return (
                            <>
                              <Flex key={index}>
                                <p
                                  style={{
                                    minWidth: '200px',
                                    height: `${itemsHeight}px`,
                                    lineHeight: `${itemsHeight}px`,
                                  }}
                                >
                                  {record?.title}
                                </p>
                                <Flex vertical gap={gap}>
                                  {record?.functionals?.length ? (
                                    record?.functionals?.map(
                                      (functional, index) => (
                                        <Checkbox
                                          key={index}
                                          value={functional.id}
                                          className="min-w-[50px]"
                                        >
                                          <Flex>
                                            <p className="min-w-[312px]">
                                              {functional?.title}
                                            </p>
                                            <p className="min-w-[250px]">
                                              {functional?.code}
                                            </p>
                                          </Flex>
                                        </Checkbox>
                                      )
                                    )
                                  ) : (
                                    <Flex className="">
                                      <p className="min-w-[266px]">-</p>
                                      <p className="min-w-[250px]">-</p>
                                    </Flex>
                                  )}
                                </Flex>
                              </Flex>
                              <Divider className="!my-3" />
                            </>
                          );
                        }}
                      />
                    </Checkbox.Group>
                  </FormItem>
                </div>
              </Space>
            </Content>
          </div>
        </FormWrapper>
      </Spin>
    </>
  );
};

export default memo(RoleDetail);
