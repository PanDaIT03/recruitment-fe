import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import FilterBox from '~/components/FilterBox/FilterBox';
import Input from '~/components/Input/Input';
import CustomSelect from '~/components/Select/CustomSelect';
import { colSpan } from '~/utils/constant';

interface IJobFilterBoxProps {
  form: FormInstance<any>;
  onFinish(values: any): void;
  open: boolean;
}

const JobFilterBox = ({ form, open, onFinish }: IJobFilterBoxProps) => {
  const [workTypes, setWorkTypes] = useState([] as DefaultOptionType[]);

  const { mutate: getAllWorkTypesMutate, isPending: isGetAllWorkTypesPending } =
    useMutation({
      mutationFn: () => JobsAPI.getAllWorkTypes(),
      onSuccess: (res: any) => {
        if (res?.items)
          setWorkTypes(
            res.items.map(
              (item: any) =>
                ({
                  label: item?.title,
                  value: item?.id,
                }) as DefaultOptionType
            )
          );
      },
      onError: (error) => {
        message.error(
          `Lỗi khi lấy danh sách hình thức làm việc. ${error?.message ?? error}`
        );
      },
    });

  useEffect(() => {
    getAllWorkTypesMutate();
  }, [open]);

  return (
    <FilterBox open={open} form={form} onFinish={onFinish}>
      <Row gutter={{ xs: 8, sm: 14 }}>
        <Col span={colSpan}>
          <FormItem label="Hình thức làm việc" name="workTypesId">
            <CustomSelect
              allowClear
              size="large"
              className="!bg-[#2b2b3f]"
              placeholder="Chọn hình thức làm việc"
              configProvider={{
                clearBg: '#ffffff',
                colorTextQuaternary: '#666666',
              }}
              configTokenProvider={{
                colorText: '#fff',
                controlItemBgHover: '#ffac69',
                colorTextPlaceholder: '#666666',
              }}
              options={workTypes}
              loading={isGetAllWorkTypesPending}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Hình thức làm việc" name="placement">
            <Input placeholder="Hình thức làm việc" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Hình thức làm việc" name="placement">
            <Input placeholder="Hình thức làm việc" />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(JobFilterBox);
