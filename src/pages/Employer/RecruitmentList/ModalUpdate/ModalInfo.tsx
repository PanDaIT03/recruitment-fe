import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import { useFetch } from '~/hooks/useFetch';
import {
  JobItem,
  JobPlacement,
  PaginatedJobCategories,
  PaginatedJobFields,
  PaginatedWorkTypes,
} from '~/types/Job';
import icons from '~/utils/icons';

const { TeamOutlined } = icons;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  initData?: JobItem;
  onUpdate: (value: any) => void;
}
const ModalInfo: React.FC<ModalProps> = ({
  open,
  onClose,
  initData,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  const jobCategories = useFetch<PaginatedJobCategories>(
    ['jobCategories'],
    JobsAPI.getAllJobCategories
  );

  const workTypes = useFetch<PaginatedWorkTypes>(
    ['workTypes'],
    JobsAPI.getAllWorkTypes
  );

  const jobPlacements = useFetch<JobPlacement>(
    ['placements'],
    JobsAPI.getAllPlacements
  );

  const jobFields = useFetch<PaginatedJobFields>(
    ['jobFields'],
    JobsAPI.getAllJobFields
  );

  const categories = useMemo(() => {
    return jobCategories.data?.items.map((categories) => ({
      value: categories.id,
      label: categories.name,
    }));
  }, [jobCategories]);

  const types = useMemo(() => {
    return workTypes.data?.items.map((types) => ({
      value: types.id,
      label: types.title,
    }));
  }, [workTypes]);

  const placements = useMemo(() => {
    return jobPlacements.data?.items.map((placements) => ({
      value: placements.id,
      label: placements.title,
    }));
  }, [jobPlacements]);

  const fields = useMemo(() => {
    return jobFields.data?.items.map((fields) => ({
      value: fields.id,
      label: fields.title,
    }));
  }, [jobFields]);

  const formatter = (value: string | undefined): string => {
    if (!value) return '';
    return `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const parser = (value: string | undefined): string => {
    return value ? value.replace(/₫\s?|(,*)/g, '') : '';
  };
  console.log(
    initData?.jobsPlacements?.map((placement) => placement.placement.id)
  );
  useEffect(() => {
    if (initData) {
      form.setFieldsValue({
        fieldsId: initData.jobField?.id,
        categoriesId: initData.jobCategory?.id,
        workTypesId: initData.workType?.id,
        placements: initData?.jobsPlacements?.map(
          (placement) => placement?.placement.id
        ),
        salaryMin: initData.salaryMin,
        salaryMax: initData.salaryMax,
        quantity: initData.quantity,
      });
    }
  }, [initData, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const modalInfo = {
          fieldsId: values.fieldsId,
          categoriesId: values.categoriesId,
          workTypesId: values.workTypesId,
          placementIds: values.placementIds,
          salaryMin: values.salaryMin,
          salaryMax: values.salaryMax,
          quantity: values.quantity,
        };
        onUpdate(modalInfo);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal open={open} footer={false} closeIcon={null}>
      <h2 className="text-xl font-bold mb-6 text-center">Cập nhật thông tin</h2>
      <Form form={form} layout="vertical">
        <Form.Item
          name="fieldsId"
          label="Lĩnh vực của vị trí tuyển dụng này là gì?"
          required
        >
          <Select placeholder="Chọn danh mục" options={fields || []}></Select>
        </Form.Item>

        <Form.Item name="categoriesId" label="Loại công việc" required>
          <Radio.Group options={categories || []}></Radio.Group>
        </Form.Item>

        <Form.Item name="workTypesId" label="Hình thức làm việc" required>
          <Radio.Group options={types || []}></Radio.Group>
        </Form.Item>

        <Form.Item
          name="placementIds"
          label="Địa điểm làm việc (tối đa 3 địa điểm)"
          required
        >
          <Select
            placeholder="Chọn địa điểm"
            options={placements}
            mode="multiple"
            maxCount={3}
          ></Select>
        </Form.Item>

        <Form.Item label="Mức lương (không bắt buộc)" className="mb-4">
          <Input.Group compact>
            <Input.Group compact className="w-full">
              <Form.Item name={'salaryMin'} noStyle>
                <InputNumber
                  formatter={formatter}
                  parser={parser}
                  className="w-full"
                  placeholder="Từ mức lương"
                  suffix="VND"
                  min="1"
                />
              </Form.Item>
              <Form.Item name={'salaryMax'} noStyle>
                <InputNumber
                  formatter={formatter}
                  parser={parser}
                  className="w-full"
                  placeholder="Đến mức lương"
                  suffix="VND"
                  min="1"
                />
              </Form.Item>
            </Input.Group>
          </Input.Group>
          <p className="mt-2">
            <span className="text-gray-400">Ứng viên sẽ nhìn thấy:</span>
            <span className="italic text-red-500"> Thương lượng</span>
          </p>
        </Form.Item>

        <Form.Item
          name={'quantity'}
          label="Số lượng tuyển dụng"
          className="mb-4"
          required
        >
          <InputNumber
            prefix={<TeamOutlined />}
            className="w-full"
            placeholder="Số lượng cần tuyển"
            min={1}
          />
        </Form.Item>
        <div className="flex items-center justify-end gap-2">
          <Button title="Hủy" onClick={onClose} />

          <Button title="Cập nhật" onClick={handleOk} fill />
        </div>
      </Form>
    </Modal>
  );
};

export default ModalInfo;
