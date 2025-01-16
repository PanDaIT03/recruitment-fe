import { DatePicker, Divider, Form, Input, Modal } from 'antd';
import Button from '../../Button/Button';
import { useForm } from 'antd/es/form/Form';
import { useFetch } from '~/hooks/useFetch';
import { StatusJob } from '~/types/Job';
import { JobsAPI } from '~/apis/job';
import { useMemo, useState } from 'react';
import CustomSelect from '../../Select/CustomSelect';
import { MenuIcon, Tag } from '~/assets/svg';
import './index.scss';
import toast from '~/utils/functions/toast';
import { IGetAllStatusParams } from '~/types/Status';

interface ModalProps {
  data: any;
  isOpen: boolean;
  handleCancel: () => void;
  refetch: () => void;
}

const ModalStatusJob = ({
  isOpen,
  handleCancel,
  data,
  refetch,
}: ModalProps) => {
  const [form] = useForm();
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const params: IGetAllStatusParams = { type: 'interview' };
  const { data: allStatusJob } = useFetch<StatusJob>(
    ['getAllStatusJob', params.type],
    () => JobsAPI.getAllStatusJob(params.type)
  );

  const statusJob = useMemo(() => {
    return allStatusJob?.items.map((status) => ({
      value: status.id,
      label: status.title,
    }));
  }, [allStatusJob]);

  const handleStatusChange = (value: number) => {
    setSelectedStatus(value);
  };

  const handleSubmit = async () => {
    const formData = form.getFieldsValue();

    const payload = {
      statusId: formData?.statusId,
      jobsId: data?.jobsId,
      usersId: data?.usersId,
    };

    try {
      const response = await JobsAPI.updateApplicationJob(payload);
      if (selectedStatus === 2) {
        const payload = {
          ...formData,
          jobsId: data?.jobsId,
          usersId: data?.usersId,
        };

        const response = await JobsAPI.createNewInterview(payload);
        if (response.statusCode === 200) {
          toast.success(response.message);
          refetch();
          handleCancel();
        }
      }
      if (response.statusCode === 200) {
        toast.success(response.message);
        refetch();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title="Cập nhật trạng thái"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Trạng thái" name="statusId">
          <CustomSelect
            options={statusJob}
            prefixIcon={<MenuIcon className="w-4 h-4 text-sub" />}
            onChange={handleStatusChange}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
        {selectedStatus === 3 && (
          <>
            <Form.Item
              label={
                <span className="text-sub font-medium">Ngày phỏng vấn</span>
              }
              name="date"
              required
              rules={[
                { required: true, message: 'Vui lòng chọn ngày phỏng vấn' },
              ]}
              extra={
                <span className="text-xs text-sub">
                  Giờ : Phút, Ngày / Tháng / Năm
                </span>
              }
            >
              <DatePicker
                showTime={{ format: 'HH : mm' }}
                format="HH : mm DD / MM / YYYY"
                placeholder="--:-- dd/mm/yyyy"
                className="w-full !flex-row-reverse"
                size="large"
                variant="outlined"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-sub font-medium">Ghi chú phỏng vấn</span>
              }
              name="note"
            >
              <Input.TextArea
                rows={3}
                placeholder="Ví dụ: Phỏng vấn vòng 1 với anh Phong"
              />
            </Form.Item>
          </>
        )}

        {selectedStatus === 10 && (
          <>
            <Form.Item label="Lý do" name="reason">
              <CustomSelect
                options={[
                  { label: 'Không đang tìm việc', value: 1 },
                  { label: 'Không đủ tiêu chuẩn', value: 2 },
                  { label: 'Quá tiêu chuẩn', value: 3 },
                  { label: 'Từ chối offer', value: 4 },
                  { label: 'Đã nhận việc nơi khác', value: 5 },
                ]}
                prefixIcon={<Tag className="w-4 h-4 text-sub" />}
                placeholder="Chọn lý do"
              />
            </Form.Item>
          </>
        )}
      </Form>

      <div className="flex items-center gap-2 mt-4">
        <Button title="Để sau" onClick={handleCancel} className="w-full" />
        <Button
          title="Lưu"
          className="w-full"
          fill
          onClick={() => form.submit()}
        />
      </div>
    </Modal>
  );
};

export default ModalStatusJob;
