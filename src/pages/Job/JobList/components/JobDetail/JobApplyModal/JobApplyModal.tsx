import { Flex, message, Space, Upload, UploadFile, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { useMemo, useState } from 'react';
import UserAPI from '~/apis/user';

import { File, Fly } from '~/assets/svg';
import Button from '~/components/Button/Button';
import Dragger from '~/components/Dragger/Dragger';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Modal, { IModalProps } from '~/components/Modal/Modal';
import { Radio, RadioGroup } from '~/components/Radio/Radio';
import CustomSelect from '~/components/Select/CustomSelect';
import { useFetch } from '~/hooks/useFetch';
import icons from '~/utils/icons';

interface IProps extends IModalProps {
  jobId: number;
  onApply: (values: any) => void;
}

const { CloseOutlined } = icons;

const JobApplyModal = ({
  jobId,
  loading,
  onCancel,
  onApply,
  ...props
}: IProps) => {
  const [form] = useForm();

  const [value, setValue] = useState(1);
  const [uploadFile, setUploadFile] = useState<UploadFile[]>([]);

  const isUsingExistingCV = useMemo(() => value === 1, [value]);
  const { data: myCVs } = useFetch(['getMyCV'], UserAPI.getMyCv);

  const cvOptions: DefaultOptionType[] = useMemo(() => {
    return (
      myCVs?.items?.map((item) => ({
        label: item?.fileName,
        value: item?.id,
      })) || []
    );
  }, [myCVs]);

  const handleFinish = (values: any) => {
    const { cv } = values;

    const formData = new FormData();
    !isUsingExistingCV
      ? formData.append('file', cv?.file)
      : formData.append('curriculumVitaesId', cv.toString());
    formData.append('jobsId', jobId.toString());

    formData.forEach((val) => {
      console.log(val);
    });

    onApply(formData);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    setUploadFile([]);
    form.resetFields();

    onCancel && onCancel(e);
  };

  const draggerProps: UploadProps = useMemo(
    () => ({
      name: 'file',
      maxCount: 1,
      fileList: uploadFile,
      onRemove: () => setUploadFile([]),
      beforeUpload: (file) => {
        const isValidFormat =
          file.type === 'application/pdf' ||
          file.type === 'application/msword' ||
          file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (!isValidFormat) {
          message.error('Tệp tin không hợp lệ! Chỉ hỗ trợ PDF, DOC, DOCX.');
          return Upload.LIST_IGNORE;
        }

        const newFile: UploadFile[] = [
          ...uploadFile,
          { uid: file.uid, name: file.name, originFileObj: file },
        ];

        setUploadFile(newFile);
        return false;
      },
    }),
    [uploadFile]
  );

  return (
    <Modal
      {...props}
      footer={
        <Flex gap={16}>
          <Button
            title="Để sau"
            loading={loading}
            className="basis-1/2"
            iconBefore={<CloseOutlined />}
            onClick={handleCancel}
          />
          <Button
            fill
            title="Gửi hồ sơ"
            loading={loading}
            className="basis-1/2"
            iconAfter={<Fly />}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onCancel={handleCancel}
    >
      <Space direction="vertical" size="large" className="w-full">
        <RadioGroup
          value={value}
          className="flex flex-col gap-5"
          onChange={(e) => setValue(e.target.value)}
        >
          <Radio value={1}>Chọn từ CV đã có</Radio>
          <Radio value={2}>Tải lên CV mới</Radio>
        </RadioGroup>
        <FormWrapper form={form} onFinish={handleFinish}>
          <FormItem
            name="cv"
            className="mb-0"
            label={
              isUsingExistingCV ? 'Chọn CV ứng tuyển' : 'Hồ sơ xin việc / CV'
            }
            rules={[{ required: true, message: 'Vui lòng chọn CV' }]}
          >
            {isUsingExistingCV ? (
              <CustomSelect
                placeholder="Chọn CV"
                prefixIcon={<File />}
                options={cvOptions}
              />
            ) : (
              <Dragger {...draggerProps} />
            )}
          </FormItem>
        </FormWrapper>
      </Space>
    </Modal>
  );
};

export default JobApplyModal;
