import { Flex, Form, Input, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { memo, useCallback, useEffect } from 'react';

import Button from '~/components/Button/Button';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { SaveOutlined } = icons;

const data = [];

const DetailRoleManagement = () => {
  const [form] = Form.useForm();
  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setTitle('Thêm mới chức vụ');
    setBreadcrumb([
      { title: 'Quản lý' },
      { title: 'Danh sách chức vụ', href: PATH.ADMIN_ROLE_MANAGEMENT },
      { title: 'Thêm mới chức vụ' },
    ]);
  }, []);

  const handleFinish = useCallback((values: any) => {
    console.log(values);
  }, []);

  return (
    <>
      <FormWrapper
        form={form}
        footer={
          <Flex justify="end" gap={12} className="mt-2">
            <Button title="Hủy" className="bg-white" />
            <Button fill iconBefore={<SaveOutlined />} title="Lưu" />
          </Flex>
        }
        onFinish={handleFinish}
      >
        <div className="grid grid-cols-10 gap-4">
          <Content className="col-span-3">
            <h2 className="text-base font-semibold">1. Thông tin chức vụ</h2>
            <Space direction="vertical" className="w-full pt-2 pl-2">
              <FormItem label="Tên chức vụ">
                <Input
                  allowClear
                  placeholder="Ví dụ: Admin"
                  className="w-full min-h-10"
                />
              </FormItem>
              <FormItem label="Mô tả chức vụ">
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
              <Space className="bg-white py-4 px-6 rounded-md w-full">
                <p></p>
              </Space>
            </Space>
          </Content>
        </div>
      </FormWrapper>
    </>
  );
};

export default memo(DetailRoleManagement);
