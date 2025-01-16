import { Checkbox, Divider, Flex, Form, Input, Space, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import List from '~/components/List/List';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllFunctionalGroups } from '~/store/thunk/functionalGroup';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

interface IFunctionalForm {
  roleName: string;
  description: string;
  functionalsId: number[];
}

const { SaveOutlined } = icons;

const DetailRoleManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [functionalForm] = Form.useForm<IFunctionalForm>();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { functionalGroups, loading } = useAppSelector(
    (state) => state.functionalGroup
  );

  const refetchFunctionalGroup = useCallback(() => {
    dispatch(getAllFunctionalGroups({}));
  }, []);

  useEffect(() => {
    setTitle('Thêm mới chức vụ');
    setBreadcrumb([
      { title: 'Quản lý' },
      { title: 'Danh sách chức vụ', href: PATH.ADMIN_ROLE_MANAGEMENT },
      { title: 'Thêm mới chức vụ' },
    ]);
  }, []);

  useEffect(() => {
    refetchFunctionalGroup();
  }, [refetchFunctionalGroup]);

  const handleCancel = useCallback(() => {
    functionalForm.resetFields();
    navigate(PATH.ADMIN_ROLE_MANAGEMENT);
  }, []);

  const handleFinish = useCallback((values: IFunctionalForm) => {
    console.log(values);
  }, []);

  return (
    <>
      <Spin spinning={loading}>
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
                  name="roleName"
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
                    <li className="min-w-[266px] pl-6">Chức năng</li>
                    <li className="min-w-[250px]">Mã chức năng</li>
                  </ul>
                  <FormItem name="functionalsId">
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
                                    record?.functionals?.map((functional) => (
                                      <Checkbox
                                        value={functional.id}
                                        className="min-w-[50px]"
                                      >
                                        <Flex>
                                          <p className="min-w-[242px]">
                                            {functional?.title}
                                          </p>
                                          <p className="min-w-[250px]">
                                            {functional?.code}
                                          </p>
                                        </Flex>
                                      </Checkbox>
                                    ))
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

export default memo(DetailRoleManagement);
