import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DefaultOptionType } from 'antd/es/select';
import { memo, useEffect, useMemo, useState } from 'react';

import { JobsAPI } from '~/apis/job';
import { StatusAPIs } from '~/apis/status';
import FilterBox from '~/components/FilterBox/FilterBox';
import CustomSelect from '~/components/Select/CustomSelect';
import { JobItem } from '~/types/Job';
import { IGetAllStatusParams } from '~/types/Status';
import { colSpan } from '~/utils/constant';
import { SELECT_PROPS } from '../constants';

interface IJobFilterBoxProps {
  open: boolean;
  form: FormInstance<any>;
  job?: {
    items?: JobItem[];
    loading: boolean;
  };
  onFinish(values: any): void;
  onCancel: () => void;
}

const JobFilterBox = ({
  form,
  open,
  job,
  onFinish,
  onCancel,
}: IJobFilterBoxProps) => {
  const [workTypeOptions, setWorkTypeOptions] = useState(
      [] as DefaultOptionType[]
    ),
    [placementOptions, setPlacementOptions] = useState(
      [] as DefaultOptionType[]
    ),
    [statusOptions, setStatusOptions] = useState([] as DefaultOptionType[]);

  const jobOptions = useMemo(() => {
    return (job?.items ?? []).map(
      (item) =>
        ({
          label: `${item?.user?.companyName} - ${item?.title}`,
          value: item?.id,
        }) as DefaultOptionType
    ) as DefaultOptionType[];
  }, [job]);

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
      });

  useEffect(() => {
    if (!open) return;

    getAllWorkTypesMutate();
    getAllPlacementsMutate();
    getAllStatusMutate({ type: 'Công việc' });
  }, [open]);

  return (
    <FilterBox open={open} form={form} onFinish={onFinish} onCancel={onCancel}>
      <Row gutter={{ xs: 8, sm: 14 }}>
        <Col span={colSpan}>
          <FormItem label="Hình thức làm việc" name="workTypesId">
            <CustomSelect
              placeholder="Chọn hình thức làm việc"
              options={workTypeOptions}
              loading={isGetAllWorkTypesPending}
              {...SELECT_PROPS}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Công việc" name="jobsId">
            <CustomSelect
              placeholder="Chọn công việc"
              options={jobOptions}
              loading={job?.loading ?? false}
              {...SELECT_PROPS}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Khu vực" name="placementIds">
            <CustomSelect
              mode="multiple"
              maxTagCount={4}
              placeholder="Chọn khu vực"
              options={placementOptions}
              loading={isGetAllPlacementsMutatePending}
              {...SELECT_PROPS}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Trạng thái" name="statusId">
            <CustomSelect
              placeholder="Chọn trạng thái"
              options={statusOptions}
              loading={isGetAllStatusMutatePending}
              {...SELECT_PROPS}
            />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(JobFilterBox);
