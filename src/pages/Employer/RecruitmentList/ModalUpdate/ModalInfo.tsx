import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { useEffect } from 'react';
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

const { Option } = Select;

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

  const { data: jobCategories } = useFetch<PaginatedJobCategories>(
    JobsAPI.getAllJobCategories
  );
  const { data: workType } = useFetch<PaginatedWorkTypes>(
    JobsAPI.getAllWorkTypes
  );
  const { data: jobPlacements } = useFetch<JobPlacement>(
    JobsAPI.getAllPlacements
  );
  const { data: jobFields } = useFetch<PaginatedJobFields>(
    JobsAPI.getAllJobFields
  );

  const formatter = (value: string | undefined): string => {
    if (!value) return '';
    return `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const parser = (value: string | undefined): string => {
    return value ? value.replace(/₫\s?|(,*)/g, '') : '';
  };

  useEffect(() => {
    if (initData) {
      form.setFieldsValue({
        fieldsId: initData.jobField?.id,
        categoriesId: initData.jobCategory?.id,
        workTypesId: initData.workType?.id,
        placements: initData.jobsPlacements?.map(
          (placement) => placement.placement.id
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
          <Select placeholder="Chọn danh mục">
            {jobFields?.items?.map?.((field) => (
              <Option value={field.id} key={field.id}>
                {field.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="categoriesId" label="Loại công việc" required>
          <Radio.Group>
            {jobCategories?.items.map?.((category) => (
              <Radio value={category.id} key={category.id}>
                {category.name}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="workTypesId" label="Hình thức làm việc" required>
          <Radio.Group>
            {workType?.items.map?.((type) => (
              <Radio value={type.id} key={type.id}>
                {type.title}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="placementIds"
          label="Địa điểm làm việc (tối đa 3 địa điểm)"
          required
        >
          <Select placeholder="Chọn địa điểm" mode="multiple" maxCount={3}>
            {jobPlacements?.items?.map((place) => (
              <Option key={place.id} value={place.id}>
                {place.title}
              </Option>
            ))}
          </Select>
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
