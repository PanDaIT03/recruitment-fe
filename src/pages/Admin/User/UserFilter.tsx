import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { Dispatch, memo, SetStateAction, useEffect } from 'react';
import { JobsAPI } from '~/apis/job';

import FilterBox from '~/components/FilterBox/FilterBox';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useAppSelector } from '~/hooks/useStore';

interface IProps {
  open: boolean;
  form: FormInstance<any>;
  onCancel: () => void;
  onFinish: (values: any) => void;
  setFilterParams: Dispatch<SetStateAction<any>>;
}

const UserFilter = ({
  open,
  form,
  onCancel,
  onFinish,
  setFilterParams,
}: IProps) => {
  const { roles, loading } = useAppSelector((state) => state.role);

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

  return (
    <FilterBox
      open={open}
      form={form}
      onFinish={onFinish}
      onCancel={onCancel}
      setFilterParams={setFilterParams}
    >
      <Row gutter={[8, 16]} align="top">
        <Col span={8}>
          <FormItem name="email" label="Email">
            <Input allowClear placeholder="Ví dụ: abc@gmail.com" />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem name="jobField" label="Lĩnh vực công việc">
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
          <FormItem name="role" label="Quyền">
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
          <FormItem name="status" label="Trạng thái">
            <Select allowClear placeholder="Chọn trạng thái" />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(UserFilter);
