import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row } from 'antd';
import { Dispatch, memo, SetStateAction, useCallback, useEffect } from 'react';

import { JobsAPI } from '~/apis/job';
import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppSelector } from '~/hooks/useStore';
import { IFormFilter } from './UserList';

interface IProps {
  open: boolean;
  form: FormInstance<IFormFilter>;
  onCancel: () => void;
  onFinish: (values: any) => void;
  setFilterParams: Dispatch<SetStateAction<any>>;
}

const UserFilter = ({ open, form, onCancel, onFinish }: IProps) => {
  const { roles, loading } = useAppSelector((state) => state.role);
  const { status, loading: statusLoading } = useAppSelector(
    (state) => state.status
  );

  const {
    data: jobFields,
    mutate: getAllJobFields,
    isPending: isGetAllJobFieldsPending,
  } = useMutation({
    mutationFn: () => JobsAPI.getAllJobFields(),
    onError: (error: any) => {
      message.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    getAllJobFields();
  }, []);

  const handleSetFormValues = useCallback(
    (form: FormInstance<IFormFilter>, filterParams: any) => {
      const params = Object.entries(filterParams).reduce(
        (prevVal, currentVal) => {
          const [key, value] = currentVal;
          if (value)
            key.includes('email')
              ? (prevVal[key] = value)
              : (prevVal[key] = Number(value));

          return prevVal;
        },
        {} as Record<string, any>
      );

      form.setFieldsValue(params);
    },
    []
  );

  return (
    <FilterBox
      open={open}
      form={form}
      onFinish={onFinish}
      onCancel={onCancel}
      onSetFormValues={handleSetFormValues}
    >
      <Row gutter={[8, 16]} align="top">
        <Col span={24}>
          <FormItem name="email" label="Email">
            <Input allowClear placeholder="Ví dụ: abc@gmail.com" />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem name="jobFieldsId" label="Lĩnh vực công việc">
            <Select
              allowClear
              mode="multiple"
              placeholder="Chọn lĩnh vực"
              loading={isGetAllJobFieldsPending}
              options={jobFields?.items?.map((item) => ({
                label: item?.title,
                value: item?.id,
              }))}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem name="roleId" label="Quyền">
            <Select
              allowClear
              loading={loading}
              placeholder="Chọn quyền"
              options={roles?.items?.map((item) => ({
                label: <span className="capitalize">{item?.title}</span>,
                value: item?.id,
              }))}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem name="statusId" label="Trạng thái">
            <Select
              allowClear
              placeholder="Chọn trạng thái"
              loading={statusLoading}
              options={status?.items?.map((status) => ({
                label: status?.title,
                value: status?.id,
              }))}
            />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(UserFilter);
