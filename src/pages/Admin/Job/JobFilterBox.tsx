import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useCallback, useEffect, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import { StatusAPIs } from '~/apis/status';
import Content from '~/components/Content/Content';
import FormWrapper from '~/components/Form/FormWrapper';
import Select from '~/components/Select/Select';
import { IGetAllStatusParams } from '~/types/Status';
import { colSpan } from '~/utils/constant';

interface IJobFilterBoxProps {
  open: boolean;
  form: FormInstance<any>;
  onFinish(values: any): void;
  onCancel: () => void;
}

const JobFilterBox = ({
  form,
  open,
  onFinish,
  onCancel,
}: IJobFilterBoxProps) => {
  const [workTypeOptions, setWorkTypeOptions] = useState(
      [] as DefaultOptionType[]
    ),
    [placementOptions, setPlacementOptions] = useState(
      [] as DefaultOptionType[]
    ),
    [statusOptions, setStatusOptions] = useState([] as DefaultOptionType[]),
    [jobOptions, setJobOptions] = useState([] as DefaultOptionType[]);

  const { mutate: getAllWorkTypesMutate, isPending: isGetAllWorkTypesPending } =
      useMutation({
        mutationFn: () => JobsAPI.getAllWorkTypes(),
        onSuccess: (res: any) => {
          if (res?.items)
            setWorkTypeOptions(
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
      }),
    {
      mutate: getAllPlacementsMutate,
      isPending: isGetAllPlacementsMutatePending,
    } = useMutation({
      mutationFn: () => JobsAPI.getAllPlacements(),
      onSuccess: (res: any) => {
        if (res?.items)
          setPlacementOptions(
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
          `Lỗi khi lấy danh sách khu vực. ${error?.message ?? error}`
        );
      },
    }),
    { mutate: getAllStatusMutate, isPending: isGetAllStatusMutatePending } =
      useMutation({
        mutationFn: (params: IGetAllStatusParams) =>
          StatusAPIs.getAllStatus(params),
        onSuccess: (res: any) => {
          if (res?.items)
            setStatusOptions(
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
            `Lỗi khi lấy danh sách trạng thái. ${error?.message ?? error}`
          );
        },
      }),
    { mutate: getAllJobsMutate, isPending: isGetAllJobsMutatePending } =
      useMutation({
        mutationFn: () => JobsAPI.getAllJobs({ type: 'less' }),
        onSuccess: (res: any) => {
          if (res?.items)
            setJobOptions(
              res.items.map(
                (item: any) =>
                  ({
                    label: `${item?.user?.companyName} - ${item?.title}`,
                    value: item?.id,
                  }) as DefaultOptionType
              )
            );
        },
        onError: (error: any) => {
          message.error(
            `Lỗi khi lấy danh sách công việc. ${error?.message ?? error}`
          );
        },
      });

  useEffect(() => {
    if (!open) return;

    getAllWorkTypesMutate();
    getAllPlacementsMutate();
    getAllStatusMutate({ type: 'job' });
    getAllJobsMutate();
  }, [open]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  return (
    // <FilterBox open={open} form={form} onFinish={onFinish} onCancel={onCancel}></FilterBox>
    <Content isOpen={open}>
      <FormWrapper
        form={form}
        cancelTitle="Hủy"
        submitTitle="Tìm kiếm"
        onFinish={onFinish}
        onCancel={handleCancel}
      >
        <Row gutter={{ xs: 8, sm: 14 }}>
          <Col span={colSpan}>
            <FormItem label="Hình thức làm việc" name="workTypesId">
              <Select
                placeholder="Chọn hình thức làm việc"
                options={workTypeOptions}
                loading={isGetAllWorkTypesPending}
                // {...SELECT_PROPS}
              />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="Trạng thái" name="statusId">
              <Select
                placeholder="Chọn trạng thái"
                options={statusOptions}
                loading={isGetAllStatusMutatePending}
                // {...SELECT_PROPS}
              />
            </FormItem>
          </Col>
          <Col span={colSpan}>
            <FormItem label="Khu vực" name="placementIds">
              <Select
                allowClear
                mode="multiple"
                maxTagCount={6}
                placeholder="Chọn khu vực"
                options={placementOptions}
                loading={isGetAllPlacementsMutatePending}
                size="large"
                // {...SELECT_PROPS}
              />
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="Công việc" name="jobsId">
              <Select
                placeholder="Chọn công việc"
                options={jobOptions}
                loading={isGetAllJobsMutatePending}
                // {...SELECT_PROPS}
              />
            </FormItem>
          </Col>
        </Row>
      </FormWrapper>
    </Content>
  );
};

export default memo(JobFilterBox);
