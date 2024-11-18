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

interface ModalProps {
  isOpen: boolean;
  handleCancel: () => void;
}

const ModalStatusJob = ({ isOpen, handleCancel }: ModalProps) => {
  const [form] = useForm();
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  const { data: allStatusJob } = useFetch<StatusJob>(['getAllStatusJob'], () =>
    JobsAPI.getAllStatusJob()
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

  const handleSubmit = () => {
    console.log('1');
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
        <Form.Item label="Trạng thái" name="status">
          <CustomSelect
            options={statusJob}
            prefixIcon={<MenuIcon className="w-4 h-4 text-sub" />}
            onChange={handleStatusChange}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
        {selectedStatus === 8 && (
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

        {selectedStatus === 6 && (
          <>
            <Form.Item label="Trạng thái" name="reason">
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
          onClick={() => console.log('first')}
        />
      </div>
    </Modal>
  );
};

export default ModalStatusJob;
