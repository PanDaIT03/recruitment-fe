import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, Row } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import { StatusAPI } from '~/apis/status';
import { DatePicker } from '~/components/DatePicker/DatePicker';
import FilterBox from '~/components/FilterBox/FilterBox';
import FormItem from '~/components/Form/FormItem';
import Input from '~/components/Input/Input';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import { startTimeOptions } from '~/pages/User/JobApplication/JobApplication';
import { IGetAllStatusParams } from '~/types/Status';
import { colSpan } from '~/utils/constant';

interface IProps {
  isOpen: boolean;
  form: FormInstance<any>;
  onCancel: () => void;
  onFinish: (values: any) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const FilterCandidateProfile = ({ isOpen, form, ...props }: IProps) => {
  const [statusOptions, setStatusOptions] = useState<DefaultOptionType[]>([]);

  const { data: jobFields, isPending: isGetAllJobFieldsPending } = useFetch(
    ['allJobsFields'],
    JobsAPI.getAllJobFields
  );

  const { mutate: getAllStatus, isPending: isGetAllStatusPending } =
    useMutation({
      mutationFn: (params: IGetAllStatusParams) =>
        StatusAPI.getAllStatus(params),
      onSuccess: (res) =>
        setStatusOptions(
          res?.items?.map((item) => ({
            label: item?.title,
            value: item?.id,
          }))
        ),
    });

  useEffect(() => {
    if (!isOpen) return;
    getAllStatus({ type: 'candidate_profile' });
  }, [isOpen]);

  return (
    <FilterBox form={form} open={isOpen} {...props}>
      <Row gutter={[8, 16]}>
        <Col span={colSpan}>
          <FormItem name="fullName" label="Tên">
            <Input placeholder="Ví dụ: Nguyễn Văn A" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem name="totalYearExperience" label="Năm kinh nghiệm">
            <Input type="number" placeholder="Ví dụ: 1" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem name="createdDate" label="Ngày tạo">
            <DatePicker allowClear format="DD/MM/YYYY" />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem name="jobFieldId" label="Lĩnh vực">
            <Select
              allowClear
              placeholder="Chọn lĩnh vực"
              loading={isGetAllJobFieldsPending}
              options={jobFields?.items?.map((jobField) => ({
                label: jobField?.title,
                value: jobField?.id,
              }))}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem name="startAfterOffer" label="Thời gian bắt đầu">
            <Select
              allowClear
              options={startTimeOptions}
              placeholder="Chọn thời gian bắt đầu"
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem name="statusId" label="Trạng thái">
            <Select
              allowClear
              options={statusOptions}
              placeholder="Chọn trạng thái"
              loading={isGetAllStatusPending}
            />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(FilterCandidateProfile);
