import { Divider, Layout } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Select from '~/components/Select/Select';

const JobApplication = () => {
  const [form] = useForm();

  const handleFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Layout className="w-full bg-white border rounded-xl shadow-md">
      <h2 className="text-base font-semibold py-4 px-6">Công việc mong muốn</h2>
      <Divider className="!m-0" />
      <div className="p-6">
        <FormWrapper form={form} onFinish={handleFinish}>
          <FormItem label="Lĩnh vực bạn muốn ứng tuyển?">
            <Select placeholder="Lĩnh vực" />
          </FormItem>
        </FormWrapper>
      </div>
    </Layout>
  );
};

export default JobApplication;
