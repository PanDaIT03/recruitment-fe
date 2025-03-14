import { useMutation } from '@tanstack/react-query';
import { Col, FormInstance, message, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DefaultOptionType } from 'antd/es/select';
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { JobsAPI } from '~/apis/job';
import { StatusAPIs } from '~/apis/status';
import FilterBox from '~/components/FilterBox/FilterBox';
import Select from '~/components/Select/Select';
import { IGetAllStatusParams } from '~/types/Status';
import { colSpan } from '~/utils/constant';

interface IJobFilterBoxProps {
  open: boolean;
  form: FormInstance<any>;
  onCancel: () => void;
  onFinish(values: any): void;
  setFilterParams: Dispatch<SetStateAction<any>>;
}

const initialOptions = [] as DefaultOptionType[];

const JobFilterBox = ({
  form,
  open,
  onFinish,
  onCancel,
  setFilterParams,
}: IJobFilterBoxProps) => {
  const [jobOptions, setJobOptions] = useState(initialOptions);
  const [statusOptions, setStatusOptions] = useState(initialOptions);
  const [workTypeOptions, setWorkTypeOptions] = useState(initialOptions);
  const [placementOptions, setPlacementOptions] = useState(initialOptions);

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
    });

  const {
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
  });

  const { mutate: getAllStatusMutate, isPending: isGetAllStatusMutatePending } =
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

  const { mutate: getAllJobsMutate, isPending: isGetAllJobsMutatePending } =
    useMutation({
      mutationFn: () => JobsAPI.getAllJobs({ type: 'less' }),
      onSuccess: (res: any) => {
        if (res?.items)
          setJobOptions(
            res.items.map(
              (item: any) =>
                ({
                  label: item?.user?.companyName
                    ? `${item?.user?.companyName} - ${item?.title}`
                    : item?.title,
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

  const handleSetFieldValues = useCallback(
    (form: FormInstance<any>, filterParams: any) => {
      const { type, placementIds, ...rest } = filterParams;
      const formattedObject = Object.entries(rest)?.reduce(
        (prevVal, currentVal) => {
          const [key, value] = currentVal;
          if (value) prevVal[key] = Number(value);

          return prevVal;
        },
        {} as Record<string, any>
      );

      form.setFieldsValue({
        ...formattedObject,
        placementIds: (placementIds as string)
          ?.split(',')
          ?.map((placementId) => Number(placementId)),
      });
    },
    []
  );

  useEffect(() => {
    getAllJobsMutate();
    getAllWorkTypesMutate();
    getAllPlacementsMutate();
    getAllStatusMutate({ type: 'job' });
  }, []);

  console.log(jobOptions);

  return (
    <FilterBox
      open={open}
      form={form}
      onFinish={onFinish}
      onCancel={onCancel}
      setFilterParams={setFilterParams}
      onSetFormValues={handleSetFieldValues}
    >
      <Row gutter={{ xs: 8, sm: 14 }}>
        <Col span={colSpan}>
          <FormItem label="Hình thức làm việc" name="workTypesId">
            <Select
              options={workTypeOptions}
              loading={isGetAllWorkTypesPending}
              placeholder="Chọn hình thức làm việc"
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Trạng thái" name="statusId">
            <Select
              options={statusOptions}
              placeholder="Chọn trạng thái"
              loading={isGetAllStatusMutatePending}
            />
          </FormItem>
        </Col>
        <Col span={colSpan}>
          <FormItem label="Khu vực" name="placementIds">
            <Select
              allowClear
              size="large"
              mode="multiple"
              maxTagCount={6}
              placeholder="Chọn khu vực"
              options={placementOptions}
              loading={isGetAllPlacementsMutatePending}
            />
          </FormItem>
        </Col>
        <Col span={16}>
          <FormItem label="Công việc" name="jobsId">
            <Select
              options={jobOptions}
              placeholder="Chọn công việc"
              loading={isGetAllJobsMutatePending}
            />
          </FormItem>
        </Col>
      </Row>
    </FilterBox>
  );
};

export default memo(JobFilterBox);
