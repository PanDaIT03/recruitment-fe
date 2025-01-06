import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useState } from 'react';

import { IPaginationParams } from '~/apis/job';
import { RoleApi } from '~/apis/role/role';
import Content from '~/components/Content/Content';
import FormWrapper from '~/components/Form/FormWrapper';
import Select from '~/components/Select/Select';
import { IRole } from '~/types/Role';

interface IRoleFilterBoxProps {
  open: boolean;
  form: FormInstance<any>;
  onFinish(values: any): void;
  onCancel: () => void;
}

const { Text } = Typography;

const RoleFilterBox = ({
  form,
  open,
  onCancel,
  onFinish,
}: IRoleFilterBoxProps) => {
  const [roleOptions, setRoleOptions] = useState([] as DefaultOptionType[]);

  const { mutate: getAllRolesMutate, isPending: isGetAllRolesMutatePending } =
    useMutation({
      mutationFn: (params: IPaginationParams & Partial<IRole>) =>
        RoleApi.getAllRoles(params),
      onSuccess: (res: any) => {
        if (res?.items)
          setRoleOptions(
            res.items.map(
              (item: any) =>
                ({
                  label: <Text className="capitalize">{item?.title}</Text>,
                  value: item?.id,
                }) as DefaultOptionType
            )
          );
      },
      onError: (error) => {
        message.error(
          `Lỗi khi lấy danh sách chức vụ. ${error?.message ?? error}`
        );
      },
    });

  useEffect(() => {
    getAllRolesMutate({});
  }, []);

  return (
    <Content isOpen={open}>
      <FormWrapper
        form={form}
        cancelTitle="Hủy"
        submitTitle="Tìm kiếm"
        onFinish={onFinish}
        onCancel={onCancel}
      >
        <Row gutter={{ xs: 8, sm: 14 }}>
          <Col span={12}>
            <FormItem label="Chức vụ" name="rolesId">
              <Select
                options={roleOptions}
                placeholder="Chọn chức vụ"
                loading={isGetAllRolesMutatePending}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Chức năng" name="functionalIds">
              <Select
                options={[]}
                loading={false}
                placeholder="Chọn chức năng"
              />
            </FormItem>
          </Col>
        </Row>
      </FormWrapper>
    </Content>
  );
};

export default memo(RoleFilterBox);
