import { Form as AntdForm, Divider, Layout } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormItemProps } from 'antd/lib';
import {
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';

import Button from '~/components/Button/Button';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import InputNumber from '~/components/Input/InputNumber';
import Select from '~/components/Select/Select';
import icons from '~/utils/icons';

type IFormItem = {
  name: string;
  formList?: boolean;
  formItem: ReactElement;
  component?: ReactNode;
} & FormItemProps;

const { List: FormList } = AntdForm;
const { PlusCircleOutlined, CloseOutlined } = icons;

const JobApplication = () => {
  const [form] = useForm();

  useEffect(() => {
    const positions = form.getFieldValue('positions');
    if (!positions || positions.length === 0) {
      form.setFieldsValue({ positions: [''] });
    }
  }, []);

  const formItems: (IFormItem | ReactElement)[] = useMemo(() => {
    return [
      {
        name: 'field',
        label: 'Lĩnh vực bạn muốn ứng tuyển?',
        formItem: <Select placeholder="Lĩnh vực" />,
        // rules: [{ required: true, message: 'Hãy nhập email' }],
      },
      {
        formList: true,
        name: 'positions',
        label: 'Vị trí muốn ứng tuyển? (Tối đa 3 vị trí)',
        formItem: (
          <Input allowClear className="w-full" placeholder="Ví dụ: Marketing" />
        ),
        // rules: [{ required: true, message: 'Vui nhập vị trí ứng tuyển' }],
      },
      {
        name: 'placement',
        label: 'Nơi bạn mong muốn tìm việc? (Tối đa 3 địa điểm)',
        formItem: <Select placeholder="Chọn thành phố" />,
        // rules: [{ required: true, message: 'Vui chọn địa điểm' }],
      },
      {
        name: 'salary',
        label: 'Mức lương kỳ vọng (VNĐ)',
        formItem: <InputNumber className="text-red" />,
        help: 'Để trống nếu bạn muốn thương lượng sau.',
        // rules: [{ required: true, message: 'Vui chọn địa điểm' }],
      },
      {
        name: 'time',
        label: 'Thời gian có thể bắt đầu làm việc kể từ khi nhận offer?',
        formItem: <Select placeholder="Chọn thời gian" />,
        className: 'mt-[46px] mb-0',
        // rules: [{ required: true, message: 'Vui chọn địa điểm' }],
      },
    ];
  }, []);

  const handleFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Layout className="w-full bg-white border rounded-xl shadow-md">
      <h2 className="text-base font-semibold py-4 px-6">Công việc mong muốn</h2>
      <Divider className="!m-0" />
      <div className="p-6">
        <FormWrapper form={form} onFinish={handleFinish}>
          {formItems.map((item) => {
            if ('name' in item) {
              const { formItem, component, formList, ...others } = item;

              return formList ? (
                <FormList key={others.name} name={others.name}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <>
                          <FormItem
                            key={field.key}
                            required={false}
                            className="mb-3"
                            labelCol={{ span: index === 0 ? 24 : 0 }}
                            label={index === 0 ? others.label : ''}
                          >
                            <FormItem
                              {...others}
                              {...field}
                              className="mb-0"
                              labelCol={{ span: 0 }}
                            >
                              {cloneElement(formItem, {
                                suffix: fields.length > 1 && (
                                  <CloseOutlined
                                    className="p-2 text-[#f15224] text-base rounded-full cursor-pointer hover:bg-[#fcebe6]"
                                    onClick={() => remove(field.name)}
                                  />
                                ),
                              })}
                            </FormItem>
                          </FormItem>
                        </>
                      ))}
                      {fields.length > 0 && fields.length < 3 ? (
                        <Button
                          borderType="dashed"
                          className="mb-6"
                          title="Thêm vị trí muốn ứng tuyển"
                          iconBefore={<PlusCircleOutlined />}
                          onClick={() => add()}
                        />
                      ) : null}
                    </>
                  )}
                </FormList>
              ) : (
                <FormItem key={others.name} {...others}>
                  {formItem}
                </FormItem>
              );
            } else return item;
          })}
        </FormWrapper>
      </div>
    </Layout>
  );
};

export default JobApplication;
