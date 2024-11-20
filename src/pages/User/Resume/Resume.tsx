import { useMutation } from '@tanstack/react-query';
import {
  Divider,
  Flex,
  Image,
  List,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Upload,
  UploadProps,
} from 'antd';
import { UploadFile } from 'antd/lib';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import UserApi from '~/apis/user';
import { PDF_Icon } from '~/assets/img';
import { File } from '~/assets/svg';
import ButtonAction from '~/components/Button/ButtonAction';
import DownloadButton from '~/components/Button/DownloadButton';
import Dragger from '~/components/Dragger/Dragger';
import Modal from '~/components/Modal/Modal';
import { useFetch } from '~/hooks/useFetch';
import { IMyCV } from '~/types/User/profile';
import icons from '~/utils/icons';

const {
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
} = icons;

const Resume = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<UploadFile[]>([]);

  const {
    refetch,
    isPending,
    data: myCVs,
  } = useFetch(['getMyCV'], UserApi.getMyCv);

  const { mutate: uploadCV, isPending: isUploadCVPending } = useMutation({
    mutationFn: (params: FormData) => UserApi.uploadCV(params),
    onSuccess: (res) => {
      refetch();
      setIsOpenModal(false);
      message.success(res?.message || 'Upload CV thành công');
    },
    onError: (error: any) =>
      message.error(error?.response?.data?.message || 'Lỗi khi upload CV'),
  });

  const props: UploadProps = useMemo(
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
          { uid: file.uid, name: file.name, originFileObj: file },
        ];
        setUploadFile(newFile);
        return false;
      },
    }),
    [uploadFile]
  );

  const handleDelete = () => {
    console.log('del');
  };

  const handleUpload = () => {
    if (!uploadFile.length) return;

    const formData = new FormData();
    uploadFile.forEach((item) => {
      if (!item.originFileObj) return;
      formData.append('files', item.originFileObj);
    });

    uploadCV(formData);
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <File />
          <h2 className="text-base font-bold">Hồ sơ / CV</h2>
        </Flex>
        <ButtonAction
          tooltipTitle="Tải lên CV"
          title={<UploadOutlined className="text-[#691f74]" />}
          onClick={() => setIsOpenModal(true)}
        />
      </Flex>
      <Divider className="!my-3" />
      <List
        itemLayout="horizontal"
        dataSource={isPending ? ([1] as unknown as IMyCV[]) : myCVs?.items}
        renderItem={(item) =>
          isPending ? (
            <List.Item>
              <Skeleton avatar title={false} active paragraph={{ rows: 2 }} />
            </List.Item>
          ) : (
            <List.Item
              className="!border-0"
              actions={[
                <Space>
                  <DownloadButton
                    url={item.url}
                    fileName={item.fileName}
                    title={<DownloadOutlined className="text-[#691f74]" />}
                  />
                  <Popconfirm
                    okText="Có"
                    cancelText="Không"
                    title="Xoá CV này"
                    description="Bạn có chắc chắn muốn xoá CV này?"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={handleDelete}
                  >
                    <ButtonAction
                      title={<CloseOutlined className="text-warning" />}
                      className="hover:bg-light-warning"
                    />
                  </Popconfirm>
                </Space>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Image
                    width={40}
                    height={40}
                    preview={false}
                    src={PDF_Icon}
                  />
                }
                title={<p className="font-medium">{item?.fileName}</p>}
                description={
                  <p className="text-sub">
                    Tải lên {dayjs(item?.createAt).format('HH:ss DD/MM/YYYY')}
                  </p>
                }
              />
            </List.Item>
          )
        }
      />
      <Modal
        isOpen={isOpenModal}
        title="Đăng tải CV"
        loading={isUploadCVPending}
        onCancel={() => setIsOpenModal(false)}
        onOk={handleUpload}
      >
        <Dragger {...props} />
      </Modal>
    </>
  );
};

export default Resume;
