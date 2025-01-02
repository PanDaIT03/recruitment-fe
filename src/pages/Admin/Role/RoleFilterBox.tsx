import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useState } from 'react';

// import { IPaginationParms } from '~/apis/job';
import { IPaginationParams } from '~/apis/job';
import { RoleApi } from '~/apis/role/role';
import FilterBox from '~/components/FilterBox/FilterBox';
import CustomSelect from '~/components/Select/CustomSelect';
import { IRole } from '~/types/Role';
import { SELECT_PROPS } from '~/utils/constant';

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
    <FilterBox open={open} form={form} onFinish={onFinish} onCancel={onCancel}>
      <Row gutter={{ xs: 8, sm: 14 }}>
        <Col span={12}>
          <FormItem label="Chức vụ" name="rolesId">
            <CustomSelect
              placeholder="Chọn chức vụ"
              options={roleOptions}
              loading={isGetAllRolesMutatePending}
              {...SELECT_PROPS}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Chức năng" name="functionalIds">
            <CustomSelect
              placeholder="Chọn chức năng"
              options={[]}
              loading={false}
              {...SELECT_PROPS}
            />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(RoleFilterBox);
