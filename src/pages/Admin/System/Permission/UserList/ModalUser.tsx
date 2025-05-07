import {
  Col,
  Divider,
  Flex,
  Image,
  message,
  Row,
  Space,
  Typography,
} from 'antd';
import { FormInstance } from 'antd/lib';
import { memo, ReactNode, useEffect, useMemo, useState } from 'react';

import { AvatarPlaceHolder, Link } from '~/assets/svg';
import Button from '~/components/Button/Button';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import { RadioGroup } from '~/components/Radio/Radio';
import Select from '~/components/Select/Select';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import { IUserAdminForm } from './UserList';
import { IUserAdminItem } from '~/types/User/userAdmin';
import { useMutation } from '@tanstack/react-query';
import { UserAdminApi } from '~/apis/userAdmin';

interface IProps extends IModalProps {
  form: FormInstance<IUserAdminForm>;
  onFinish: (values: IUserAdminForm) => void;
}

interface IFormItem {
  name: string;
  label?: string;
  order: number;
  labelBold?: boolean;
  children: ReactNode;
}

interface IFormGroup {
  title?: string;
  items: IFormItem[];
}

const { Title } = Typography;
const { CloseOutlined, SaveOutlined } = icons;

const ModalUser = ({ form, loading, onCancel, onFinish, ...props }: IProps) => {
  const { avatarUrl, fullName, email, companyUrl } = form.getFieldsValue(true);

  const { status } = useAppSelector((state) => state.status);
  const { roles, loading: roleLoading } = useAppSelector((state) => state.role);

  const formGroup: IFormGroup[] = useMemo(
    () => [
      {
        title: 'Thông tin cơ bản',
        items: [
          {
            order: 1,
            label: 'Tên',
            name: 'fullName',
            children: <Input readOnly />,
          },
          {
            order: 1,
            label: 'Vị trí công việc',
            name: 'jobPosition',
            children: <Input readOnly />,
          },
          {
            order: 2,
            label: 'Lĩnh vực',
            name: 'jobFields',
            children: <Input readOnly />,
          },
          {
            order: 2,
            label: 'Vai trò',
            name: 'role',
            children: (
              <Select
                loading={roleLoading}
                placeholder="Chọn vai trò"
                options={roles?.items?.map((item) => ({
                  label: <span className="capitalize">{item?.title}</span>,
                  value: item?.id,
                }))}
              />
            ),
          },
        ],
      },
      {
        title: 'Liên lạc',
        items: [
          {
            order: 1,
            label: 'Email',
            name: 'email',
            children: <Input readOnly />,
          },
          {
            order: 2,
            label: 'Số điện thoại',
            name: 'phoneNumber',
            children: <Input readOnly />,
          },
          {
            order: 1,
            label: 'Công ty',
            name: 'companyName',
            children: <Input readOnly />,
          },
          {
            order: 2,
            label: 'Website',
            name: 'companyUrl',
            children: <Input readOnly />,
          },
        ],
      },
      {
        title: 'Trạng thái',
        items: [
          {
            order: 1,
            name: 'statusId',
            children: (
              <RadioGroup
                options={status?.items?.map((item) => ({
                  label: item?.title,
                  value: item?.id,
                }))}
              />
            ),
          },
        ],
      },
    ],
    [roles, status, roleLoading]
  );

  return (
    <Modal
      centered
      width={700}
      closable={false}
      className="rounded-2xl overflow-hidden"
      classNames={{
        body: '!p-0',
        header: '!p-0 overflow-hidden',
        footer: '!p-4 !mt-0 !rounded-2xl',
      }}
      footer={
        <Flex justify="end" gap={16}>
          <Button
            title="Hủy"
            iconBefore={<CloseOutlined />}
            loading={loading}
            onClick={onCancel}
          />
          <Button
            fill
            title="Lưu"
            iconBefore={<SaveOutlined />}
            loading={loading}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onCancel={onCancel}
      {...props}
    >
      <div className="h-20 bg-[#f6f6f6] p-4 relative">
        <div className="w-max absolute bottom-0 translate-y-[50%]">
          <Flex
            align="center"
            justify="center"
            className="p-1 bg-white rounded-full border"
          >
            {avatarUrl && avatarUrl !== '-' ? (
              <Image
                src={avatarUrl}
                preview={false}
                className="max-w-20 max-h-20 rounded-full"
              />
            ) : (
              <AvatarPlaceHolder width={80} height={80} />
            )}
          </Flex>
        </div>
      </div>
      <Space
        direction="vertical"
        className="w-full p-4"
        classNames={{ item: 'w-full' }}
      >
        <Flex justify="end">
          <Button
            title="Sao chép"
            iconBefore={<Link />}
            className="px-2 py-1"
            onClick={() =>
              navigator.clipboard.writeText(
                companyUrl !== '-' ? companyUrl : ''
              )
            }
          />
        </Flex>
        <Flex vertical>
          <p className="font-bold text-xl">{fullName}</p>
          <p className="text-[#6b6b6b]">{email}</p>
        </Flex>
        <Divider className="m-0" />
        <FormWrapper form={form} onFinish={onFinish}>
          {formGroup.map(({ title, items }, index) => (
            <div key={index}>
              {title && <Title level={5}>{title}</Title>}
              <Row gutter={[16, 8]} className="px-2">
                <Col span={12}>
                  {items.map(
                    ({ order, children, labelBold = false, ...item }, index) =>
                      order === 1 && (
                        <FormItem
                          key={index}
                          className="mb-1"
                          labelBold={labelBold}
                          {...item}
                        >
                          {children}
                        </FormItem>
                      )
                  )}
                </Col>
                <Col span={12}>
                  {items.map(
                    ({ order, children, labelBold = false, ...item }, index) =>
                      order === 2 && (
                        <FormItem
                          key={index}
                          className="mb-1"
                          labelBold={labelBold}
                          {...item}
                        >
                          {children}
                        </FormItem>
                      )
                  )}
                </Col>
              </Row>
            </div>
          ))}
        </FormWrapper>
      </Space>
    </Modal>
  );
};

export default memo(ModalUser);
