import { useMutation } from '@tanstack/react-query';
import { Divider, Flex, Layout, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useMemo, useState } from 'react';

import AuthAPI, { ISignUpParams } from '~/apis/auth';
import { JobsAPI } from '~/apis/job';
import { Box, Email, Fly, SkyScraper } from '~/assets/svg';
import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputPassword from '~/components/Input/InputPassword';
import CustomSelect from '~/components/Select/CustomSelect';
import { useMessage } from '~/contexts/MessageProvider';
import { useFetch } from '~/hooks/useFetch';
import { useAppSelector } from '~/hooks/useStore';
import FormApplication from '~/pages/User/JobApplication/FormJobApplication';
import { IJobApplicationForm } from '~/pages/User/JobApplication/JobApplication';
import { PaginatedJobFields, PaginatedJobPositions } from '~/types/Job';
import { ROLE } from '~/types/Role';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import ModalSignUpSuccess from '../../components/ModalSignUpSuccess/ModalSignUpSuccess';

interface SignUpFormValues {
  companyName: string;
  companyUrl: string;
  jobFieldsIds: number;
  fullName: string;
  jobPositionsId: number;
  phoneNumber: string;
  email: string;
  password: string;
}

type IEmployerSignUpForm = IJobApplicationForm;

const { Title, Text } = Typography;

const {
  LinkOutlined,
  LockOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CreditCardOutlined,
} = icons;

const SignUp = () => {
  const [form] = useForm();
  const { messageApi } = useMessage();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { roles } = useAppSelector((state) => state.role);

  const { data: jobFields } = useFetch<PaginatedJobFields>(
    ['allJobsFields'],
    JobsAPI.getAllJobFields
  );

  const { data: jobPositions } = useFetch<PaginatedJobPositions>(
    ['allJobsPositions'],
    JobsAPI.getAllJobPositions
  );

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: (params: ISignUpParams) => AuthAPI.signUp(params),
    onSuccess: (res) => {
      if (res?.statusCode === 200) {
        setIsOpenModal(true);
        return;
      }

      messageApi.error(`Có lỗi xảy ra: ${res?.message}`);
    },
    onError: (error: any) =>
      messageApi.error(`Có lỗi xảy ra: ${error?.response?.data?.message}`),
  });

  const formItem: IEmployerSignUpForm = useMemo(() => {
    return {
      form: form,
      children: [
        {
          title: (
            <>
              <Title level={4}>Thông tin công ty</Title>
              <Text className="text-gray-500 text-sm mb-4">
                Hãy cung cấp đầy đủ thông tin chính xác về công ty của bạn
              </Text>
            </>
          ),
          items: [
            {
              name: 'companyName',
              label: 'Tên doanh nghiệp?',
              item: (
                <Input
                  placeholder="Ví dụ: Tập đoàn FPT"
                  prefix={<SkyScraper width={16} height={16} />}
                />
              ),
              rules: [
                { required: true, message: 'Vui lòng nhập tên doanh nghiệp' },
              ],
            },
            {
              name: 'companyUrl',
              label: 'Link Website/Facebook/LinkedIn để ứng viên tham khảo',
              item: (
                <Input
                  placeholder="Ví dụ: fpt.com.vn"
                  prefix={<LinkOutlined />}
                />
              ),
              rules: [
                { required: true, message: 'Vui lòng nhập link tham khảo' },
              ],
            },
            {
              name: 'jobFieldsIds',
              label: 'Lĩnh vực chính công ty đang hoạt động',
              item: (
                <CustomSelect
                  placeholder="Lĩnh vực"
                  options={
                    jobFields?.items.map((el) => ({
                      value: el.id,
                      label: el.title,
                    })) || []
                  }
                  prefixIcon={<Box />}
                />
              ),
              rules: [{ required: true, message: 'Vui lòng chọn lĩnh vực' }],
            },
          ],
        },
        {
          title: (
            <>
              <Title level={5}>Thông tin liên hệ</Title>
              <Text className="text-gray-500 text-sm mb-4">
                Dùng để kết nối nhằm trao đổi các thực của thông tin đăng ký và
                sẽ không được chia sẻ cho bất kỳ ai
              </Text>
            </>
          ),
          items: [
            {
              name: 'fullName',
              label: 'Họ và tên',
              item: (
                <Input
                  placeholder="Ví dụ: Trần Tuấn Kiệt"
                  prefix={<IdcardOutlined />}
                />
              ),
              rules: [{ required: true, message: 'Vui lòng nhập họ và tên' }],
            },
            {
              name: 'jobPositionsId',
              label: 'Chức vụ',
              item: (
                <CustomSelect
                  placeholder="Chức vụ"
                  options={
                    jobPositions?.items.map((el) => ({
                      value: el.id,
                      label: el.title,
                    })) || []
                  }
                  prefixIcon={<CreditCardOutlined />}
                />
              ),
              rules: [{ required: true, message: 'Vui lòng chọn chức vụ' }],
            },
            {
              name: 'phoneNumber',
              label: 'Số điện thoại của bạn',
              item: (
                <Input
                  placeholder="Ví dụ: 0999999999"
                  prefix={<PhoneOutlined />}
                />
              ),
              rules: [
                { required: true, message: 'Vui lòng nhập số điện thoại' },
              ],
            },
          ],
        },
        {
          title: (
            <>
              <Title level={5}>Thông tin đăng nhập</Title>
              <Text className="text-gray-500 text-sm mb-4">
                Dùng để đăng nhập vào hệ thống
              </Text>
            </>
          ),
          items: [
            {
              name: 'email',
              label: 'Email của bạn',
              item: (
                <Input
                  placeholder="Ví dụ: devcui@gmail.com"
                  prefix={<Email />}
                />
              ),
              rules: [
                {
                  type: 'email',
                  message: 'Email không hợp lệ',
                },
                { required: true, message: 'Vui lòng nhập email' },
              ],
            },
            {
              name: 'password',
              label: 'Mật khẩu',
              item: (
                <InputPassword
                  placeholder="Tối thiểu 8 ký tự"
                  prefix={<LockOutlined />}
                />
              ),
              rules: [
                { min: 8, message: 'Mật khẩu có tối thiểu 8 ký tự' },
                { required: true, message: 'Vui lòng nhập mật khẩu' },
              ],
            },
          ],
        },
      ],
    };
  }, [jobFields, jobPositions]);

  const handleFinish = async (values: SignUpFormValues) => {
    try {
      const roleId = roles.find((role) => role.title === ROLE.EMPLOYER)?.id;

      if (!roleId) {
        toast.error('Lỗi không tìm thấy chức vụ');
        return;
      }

      const payload: ISignUpParams = {
        ...values,
        roleId: roleId,
        jobFieldsIds: [values.jobFieldsIds],
      };
      signUp(payload);
    } catch (error: any) {
      console.log('Unexpected error', error);
    }
  };

  return (
    <Layout className="w-full min-h-screen">
      <Flex vertical gap={24}>
        <FormWrapper form={form} loading={isPending} onFinish={handleFinish}>
          <Space direction="vertical" size="large" className="w-full">
            {formItem.children.map((item, index) => (
              <div
                key={index}
                className="w-full bg-white border rounded-xl shadow-md"
              >
                <Title
                  level={5}
                  className="text-base font-semibold py-4 px-6 !mb-0"
                >
                  {item.title}
                </Title>
                <Divider className="!m-0" />
                <div className="p-6">
                  <FormApplication formItems={item.items} />
                </div>
              </div>
            ))}
          </Space>
        </FormWrapper>
        <Button
          fill
          title="Đồng ý"
          className="w-full"
          loading={isPending}
          iconAfter={<Fly />}
          onClick={() => form.submit()}
        />
      </Flex>
      <ModalSignUpSuccess
        isOpenModal={isOpenModal}
        email={form.getFieldValue('email')}
        setIsOpenModal={setIsOpenModal}
      />
    </Layout>
  );
};

export default SignUp;
