import { DatePicker, Divider, Form, Input, message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import 'dayjs/locale/vi';
import React, { useEffect } from 'react';
import { JobsAPI } from '~/apis/job';
import Button from '~/components/Button/Button';
import toast from '~/utils/functions/toast';
import dayjs from 'dayjs';
import '~/components/Modal/ModalStatusJob/index.scss';

interface ModalInterviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  refetch: () => void;
  refetchAppJ: () => void;
  editData?: {
    id: number;
    date: string;
    note: string;
  } | null;
}

export interface TypeInterview {
  date: string;
  note: string;
  usersId: number;
  jobsId: number;
}

const ModalInterview: React.FC<ModalInterviewProps> = ({
  isOpen,
  onClose,
  data,
  refetch,
  refetchAppJ,
  editData,
}) => {
  const [form] = useForm();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        date: dayjs(editData.date),
        note: editData.note,
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = async () => {
    const { date, note } = form.getFieldsValue();

    if (!date) {
      return message.error('Vui lòng chọn ngày phỏng vấn');
    }

    const payload = {
      date: date,
      note: note,
      usersId: data?.usersId,
      jobsId: data?.jobsId,
      statusId: 6,
    };

    try {
      let response;
      if (editData) {
        response = await JobsAPI.updateInterview(editData.id, payload);
      } else {
        response = await JobsAPI.createNewInterview(payload);
      }

      if (response.statusCode === 200) {
        toast.success(response.message);
        refetch();
        refetchAppJ();
        handleCancel();
      }
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={editData ? 'Cập nhật lịch phỏng vấn' : 'Thêm lịch phỏng vấn'}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={<span className="text-sub font-medium">Ngày phỏng vấn</span>}
          name="date"
          required
          rules={[{ required: true, message: 'Vui lòng chọn ngày phỏng vấn' }]}
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
            className="w-full"
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
      </Form>

      <div className="flex items-center gap-2 mt-4">
        <Button title="Hủy" onClick={handleCancel} className="w-full" />
        <Button
          title={editData ? 'Cập nhật' : 'Thêm'}
          className="w-full"
          fill
          onClick={() => form.submit()}
        />
      </div>
    </Modal>
  );
};

export default ModalInterview;
