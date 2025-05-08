import { useMutation } from '@tanstack/react-query';
import {
  Divider,
  Flex,
  FormItemProps,
  GetProp,
  Image as ImageAntd,
  Layout,
  Menu,
  message,
  Skeleton,
  Space,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/es/form/Form';
import { Content } from 'antd/es/layout/layout';
import {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Outlet } from 'react-router-dom';

import { JobsAPI } from '~/apis/job';
import UserAPI, { IUpdatePersonalInfo } from '~/apis/user';
import {
  AvatarPlaceHolder,
  CreditCard,
  PersonCard,
  SunRise,
} from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Dragger from '~/components/Dragger/Dragger';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal from '~/components/Modal/Modal';
import CustomSelect from '~/components/Select/CustomSelect';
import { useMessage } from '~/contexts/MessageProvider';
import { PERMISSION } from '~/enums/permissions';
import { useFetch } from '~/hooks/useFetch';
import { usePermission } from '~/hooks/usePermission';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getMe } from '~/store/thunk/auth';
import { IUser } from '~/types/User';
import { phoneNumberRegex } from '~/utils/constant';
import icons from '~/utils/icons';
import Header from './Header/Header';
import { createUserMenu } from './Header/menu/headerMenuItem';

interface IFormItem extends FormItemProps {
  item: ReactElement;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IUserInfoForm {
  fullName: string;
  phoneNumber: string;
  positionId: number;
  placementId: number;
  totalYearExperience: number;
}

interface ISiderProps {
  data: IUser;
  loading?: boolean;
  onEditUserInfo: (data: IUser) => void;
  setIsOpenAvatarModal: Dispatch<SetStateAction<boolean>>;
}

const { EditOutlined, EnvironmentOutlined, PhoneOutlined } = icons;

const Sider = ({
  data,
  loading,
  onEditUserInfo,
  setIsOpenAvatarModal,
}: ISiderProps) => {
  const menuItems = createUserMenu();
  const { hasPermissions } = usePermission(PERMISSION.EDIT_USER_PROFILE);

  return (
    <div className="w-full h-max overflow-hidden rounded-xl bg-white shadow-card p-0 shadow lg:col-span-3">
      <div className="w-full">
        <div className="h-[9rem] bg-[url('assets/img/profile_cover_image.jpg')] bg-cover bg-center bg-no-repeat"></div>
        <Space
          size="middle"
          direction="vertical"
          className="w-full -mt-[59px] px-6 pb-6"
        >
          <Flex align="end" justify="space-between" gap={16}>
            <div className="relative w-fit rounded-full border-[3px] border-white">
              <div className="rounded-full bg-white w-[108px] h-[108px]">
                <div className="inline-block aspect-square h-full w-full rounded-full border border-gray-200 overflow-hidden">
                  {data?.avatarUrl ? (
                    <ImageAntd
                      width={108}
                      height={108}
                      preview={false}
                      src={data.avatarUrl}
                    />
                  ) : (
                    <AvatarPlaceHolder width={108} height={108} />
                  )}
                </div>
              </div>
              {hasPermissions && (
                <ButtonAction
                  tooltipTitle="Sửa"
                  loading={loading}
                  title={<EditOutlined className="text-white cursor-pointer" />}
                  className="bg-[#691f74] py-[2px] px-[6px] absolute bottom-0 right-0 hover:!bg-[#461a53]"
                  onClick={() => setIsOpenAvatarModal(true)}
                />
              )}
            </div>
            {hasPermissions && (
              <Button
                title="Sửa"
                loading={loading}
                borderType="dashed"
                iconBefore={<EditOutlined />}
                onClick={() => onEditUserInfo(data)}
              />
            )}
          </Flex>
          <div>
            {loading ? (
              <Skeleton active title={false} paragraph={{ rows: 2 }} />
            ) : (
              <>
                <p className="text-lg font-semibold">{data.fullName}</p>
                <p className="text-sm text-sub">{data.email}</p>
              </>
            )}
          </div>
          {(data.jobPosition?.title || data.placement?.title) && (
            <div className="text-sm font-medium">
              {data.jobPosition?.title && (
                <span>
                  {data.jobPosition?.title}
                  {data.desiredJob?.totalYearExperience && (
                    <>
                      <span className='before:content-["•"] before:mx-2 before:text-lg'></span>
                      <span className="text-sub">
                        ~ {data.desiredJob?.totalYearExperience} năm kinh nghiệm
                      </span>
                    </>
                  )}
                </span>
              )}
              {data.placement?.title && (
                <Flex align="center" gap={4}>
                  <EnvironmentOutlined />
                  <p>{data.placement?.title}</p>
                </Flex>
              )}
            </div>
          )}
        </Space>
        <div className="hidden lg:block">
          <Divider dashed className="!m-0" />
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} className="p-6" />
          ) : (
            <Menu items={menuItems} />
          )}
        </div>
      </div>
    </div>
  );
};

const UserLayout = () => {
  const dispatch = useAppDispatch();
  const { messageApi } = useMessage();
  const [form] = useForm<IUserInfoForm>();

  const firstRender = useRef<boolean>(true);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const [isOpenAvatarModal, setIsOpenAvatarModal] = useState(false);

  const { currentUser, loading } = useAppSelector((state) => state.auth);

  const { data: placements } = useFetch(
    ['placements'],
    JobsAPI.getAllPlacements
  );

  const { data: jobPositions } = useFetch(
    ['jobPositions'],
    JobsAPI.getAllJobPositions
  );

  const refetchUserProfile = useCallback(() => {
    dispatch(getMe());
  }, []);

  const { mutate: updateAccountInfo, isPending: isUpdateAccountInfoPending } =
    useMutation({
      mutationFn: (params: FormData) => UserAPI.updateAccountInfo(params),
      onSuccess: (res) => {
        refetchUserProfile();
        setIsOpenAvatarModal(false);
        messageApi.success(res?.message || 'Cập nhật thông tin thành công');
      },
      onError: (error: any) => {
        messageApi.error(
          `Cập nhật thông tin thất bại: ${error?.response?.data?.message}`
        );
      },
    });

  const { mutate: updatePersonalInfo, isPending: isUpdatePersonalInfoPending } =
    useMutation({
      mutationFn: (params: IUpdatePersonalInfo) =>
        UserAPI.updatePersonalInfo(params),
      onSuccess: (res) => {
        refetchUserProfile();
        setIsOpenInfoModal(false);
        messageApi.success(res?.message || 'Cập nhật thông tin thành công');
      },
      onError: (error: any) => {
        messageApi.error(
          `Cập nhật thông tin thất bại: ${error?.response?.data?.message}`
        );
      },
    });

  const props: UploadProps = useMemo(
    () => ({
      fileList,
      name: 'file',
      maxCount: 1,
      listType: 'picture-card',
      onRemove: () => setFileList([]),
      onPreview: async (file: UploadFile) => {
        let src = file.url as string;

        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as FileType);
            reader.onload = () => resolve(reader.result as string);
          });
        }

        const image = new Image();

        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      },
      beforeUpload: (file) => {
        const isValidFormat =
          file.type === 'image/png' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg';

        if (!isValidFormat) {
          message.error('Tệp tin không hợp lệ! Chỉ hỗ trợ PNG, JPG, JPEG.');
          return Upload.LIST_IGNORE;
        }

        setFileList([{ ...file, name: file.name, originFileObj: file }]);
        return false;
      },
    }),
    [fileList]
  );

  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;
  }, [firstRender]);

  useEffect(() => {
    if (!Object.keys(currentUser).length) return;

    form.setFieldsValue({
      fullName: currentUser?.fullName,
      phoneNumber: currentUser?.phoneNumber,
      placementId: currentUser?.placement?.id,
      positionId: currentUser?.jobPosition?.id,
      totalYearExperience: currentUser?.desiredJob?.totalYearExperience,
    });
  }, [currentUser]);

  const handleTotalYearChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value,
        numericValue = value.replace(/[^0-9]/g, '');

      form.setFieldValue('totalYearExperience', numericValue);
    },
    []
  );

  const handleBlurTotalYear = useCallback(
    (event: React.FocusEvent<HTMLInputElement, Element>) => {
      let formattedValue = '';
      const value = Number(event.target.value);

      if (value >= 50) formattedValue = '50';
      else formattedValue = value.toString();

      form.setFieldValue('totalYearExperience', formattedValue);
    },
    []
  );

  const handleCancelInfoModal = useCallback(() => {
    setIsOpenInfoModal(false);
    form.resetFields();
  }, []);

  const handleCancelAvatarModal = useCallback(() => {
    setIsOpenAvatarModal(false);
  }, []);

  const handleEditUserInfo = useCallback((data: IUser) => {
    setIsOpenInfoModal(true);

    const { fullName, placement, jobPosition, desiredJob, phoneNumber } = data;
    form.setFieldsValue({
      fullName,
      phoneNumber,
      placementId: placement?.id,
      positionId: jobPosition?.id,
      totalYearExperience: desiredJob?.totalYearExperience,
    });
  }, []);

  const handleAvatarModalFinish = useCallback(() => {
    if (!fileList.length) return;

    const formData = new FormData();
    fileList.forEach((file) => {
      if (file.originFileObj) formData.append('file', file.originFileObj);
    });

    updateAccountInfo(formData);
  }, [fileList]);

  const handleInfoModalFinish = useCallback((values: IUserInfoForm) => {
    const params: IUpdatePersonalInfo = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      jobPositionsId: values.positionId.toString(),
      placementsId: values.placementId.toString(),
      totalYearExperience: values?.totalYearExperience?.toString(),
    };

    updatePersonalInfo(params);
  }, []);

  const formItems: IFormItem[] = useMemo(() => {
    return [
      {
        name: 'fullName',
        label: 'Họ và tên',
        rules: [{ required: true, message: 'Vui lòng nhập họ và tên' }],
        item: (
          <Input
            placeholder="Nhập họ và tên"
            prefix={<PersonCard width={16} height={16} />}
          />
        ),
      },
      {
        name: 'phoneNumber',
        label: 'Số điện thoại',
        rules: [
          { required: true, message: 'Vui lòng nhập số điện thoại' },
          { len: 10, message: 'Số điện thoại bao gồm 10 chữ số' },
          {
            pattern: phoneNumberRegex,
            message: 'Số điện thoại không đúng định dạng',
          },
        ],
        item: (
          <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
        ),
      },
      {
        name: 'positionId',
        label: 'Chức vụ hiện tại',
        rules: [{ required: true, message: 'Vui lòng chọn chức vụ' }],
        item: (
          <CustomSelect
            allowClear
            placeholder="Chọn chức vụ"
            prefixIcon={<CreditCard />}
            options={jobPositions?.items?.map((jobPosition) => ({
              label: jobPosition.title,
              value: jobPosition.id,
            }))}
          />
        ),
      },
      ...(currentUser.desiredJob?.totalYearExperience
        ? [
            {
              name: 'totalYearExperience',
              label: 'Tổng số năm kinh nghiệm của bạn',
              rules: [
                { required: true, message: 'Vui lòng nhập số năm kinh nghiệm' },
              ],
              item: (
                <Input
                  inputMode="numeric"
                  placeholder="Ví dụ: 7"
                  prefix={<SunRise />}
                  onChange={handleTotalYearChange}
                  onBlur={(e) => handleBlurTotalYear(e)}
                />
              ),
            },
          ]
        : []),
      {
        name: 'placementId',
        label: 'Nơi sống hiện tại',
        className: 'mb-0',
        rules: [{ required: true, message: 'Vui lòng chọn nơi sống hiện tại' }],
        item: (
          <CustomSelect
            allowClear
            placeholder="Chọn thành phố"
            prefixIcon={<EnvironmentOutlined />}
            options={placements?.items?.map((place) => ({
              value: place?.id,
              label: place?.title,
            }))}
          />
        ),
      },
    ];
  }, [currentUser, placements, jobPositions]);

  return (
    <Layout className="min-h-screen">
      <Header />
      <div className="w-full py-4 px-8 mx-auto max-w-7xl grid grid-cols-1 gap-4 lg:grid-cols-10 max-lg:px-4">
        <Sider
          data={currentUser}
          loading={loading && firstRender.current}
          onEditUserInfo={handleEditUserInfo}
          setIsOpenAvatarModal={setIsOpenAvatarModal}
        />
        <Content className="bg-gray-100 lg:col-span-7">
          <div className="bg-white p-4 rounded-lg shadow">
            <Outlet />
          </div>
        </Content>
      </div>
      <Modal
        centered
        isOpen={isOpenInfoModal}
        title="Cập nhật thông tin"
        loading={isUpdatePersonalInfoPending}
        onCancel={handleCancelInfoModal}
        onOk={() => form.submit()}
      >
        <FormWrapper form={form} onFinish={handleInfoModalFinish}>
          {formItems.map((formItem, index) => {
            const { item, ...others } = formItem;

            return (
              <FormItem key={index} {...others}>
                {item}
              </FormItem>
            );
          })}
        </FormWrapper>
      </Modal>
      <Modal
        centered
        isOpen={isOpenAvatarModal}
        title="Thay đổi hình đại diện"
        loading={isUpdateAccountInfoPending}
        onCancel={handleCancelAvatarModal}
        onOk={handleAvatarModalFinish}
      >
        <ImgCrop
          rotationSlider
          modalOk="Lưu"
          modalCancel="Huỷ"
          cropShape="round"
          modalTitle="Chỉnh sửa hình ảnh"
        >
          <Dragger {...props}>
            <Flex vertical align="center" gap={8}>
              <p className="ant-upload-drag-icon">
                <AvatarPlaceHolder width={96} height={96} />
              </p>
              <p className="ant-upload-text">
                Nhấn vào hoặc kéo thả tệp tin để tải lên
              </p>
              <p className="ant-upload-hint">Hỗ trợ tệp tin: PNG, JPG, JPEG</p>
            </Flex>
          </Dragger>
        </ImgCrop>
      </Modal>
    </Layout>
  );
};

export default UserLayout;
