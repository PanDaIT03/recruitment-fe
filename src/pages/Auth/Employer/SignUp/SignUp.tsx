import { Divider, Flex, Layout, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '~/apis/auth';
import { JobsAPI } from '~/apis/job';

import { Fly } from '~/assets/svg';
import Button from '~/components/Button/Button';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputPassword from '~/components/Input/InputPassword';
import CustomSelect from '~/components/Select/CustomSelect';
import { useFetch } from '~/hooks/useFetch';
import { useAppDispatch } from '~/hooks/useStore';
import FormApplication from '~/pages/User/JobApplication/FormJobApplication';
import { IJobApplicationForm } from '~/pages/User/JobApplication/JobApplication';
import { checkExistedEmail } from '~/store/thunk/auth';
import { ROLE } from '~/types/Auth';
import { PaginatedJobFields, PaginatedJobPositions } from '~/types/Job';
import toast from '~/utils/functions/toast';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { Title, Text } = Typography;
const {
  HomeOutlined,
  LinkOutlined,
  ContainerOutlined,
  IdcardOutlined,
  CreditCardOutlined,
  PhoneOutlined,
  LockOutlined,
  WalletOutlined,
} = icons;

interface SignUpFormValues<T = string> {
  companyName: T;
  companyUrl: T;
  jobFieldsIds: number[];
  fullName: T;
  jobPositionsId: number;
  phoneNumber: T;
  email: T;
  password: T;
}

const SignUp = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: jobFields } = useFetch<PaginatedJobFields>(
    ['allJobsFields'],
    JobsAPI.getAllJobFields
  );

  const { data: jobPositions } = useFetch<PaginatedJobPositions>(
    ['allJobsPositions'],
    JobsAPI.getAllJobPositions
  );

  const formItem: IJobApplicationForm = useMemo(() => {
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
                  prefix={<HomeOutlined />}
                />
              ),
              rules: [
                { required: true, message: 'Vui lòng nhập Tên doanh nghiệp' },
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
                  prefixIcon={<ContainerOutlined />}
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
              rules: [{ required: true, message: 'Vui lòng nhập Họ và tên' }],
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
              rules: [{ required: true, message: 'Vui lòng chọn Chức vụ' }],
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
                { required: true, message: 'Vui lòng nhập Số điện thoại' },
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
                  prefix={<WalletOutlined />}
                />
              ),
              rules: [{ required: true, message: 'Vui lòng nhập Email' }],
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
              rules: [{ required: true, message: 'Vui lòng nhập Mật khẩu' }],
            },
          ],
        },
      ],
    };
  }, [jobFields, jobPositions]);

  const handleFinish = async (values: SignUpFormValues) => {
    try {
      const checkEmail = await dispatch(checkExistedEmail(values.email));

      if (checkEmail) return toast.warning('Email đã tồn tại');

      const payload = {
        ...values,
        jobFieldsIds: [values.jobFieldsIds],
        roleId: ROLE.EMPLOYER,
      };

      const response = await AuthAPI.signUp(payload);
      const { statusCode, message } = response;

      toast[statusCode === 200 ? 'success' : 'error'](message);
      if (statusCode === 200) {
        form.resetFields();
        navigate(PATH.USER_SIGN_IN);
      }
    } catch (error: any) {
      console.log('Unexpected error', error);
    }
  };

  return (
    <Layout className="w-full min-h-screen">
      <Flex vertical gap={24}>
        <FormWrapper form={form} onFinish={handleFinish}>
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
        <Flex gap={12}>
          <Button
            fill
            title="Đồng ý"
            className="w-full"
            iconAfter={<Fly />}
            onClick={() => form.submit()}
          />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default SignUp;
