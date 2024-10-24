import FormList from 'antd/lib/form/FormList';
import { cloneElement } from 'react';

import Button from '~/components/Button/Button';
import FormItem from '~/components/Form/FormItem';
import icons from '~/utils/icons';
import { IApplicationFormItem } from './JobApplication';

interface IProps {
  formItems: IApplicationFormItem[];
}

const { PlusCircleOutlined, CloseOutlined } = icons;

const FormApplication = ({ formItems }: IProps) => {
  return formItems.map((item) => {
    if ('name' in item) {
      const { formItem, component, formList, label, ...otherItems } = item;

      return formList ? (
        <FormList key={item.name} name={otherItems.name}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, ...otherFields }, index) => (
                <FormItem
                  key={key}
                  required={false}
                  className="mb-3"
                  label={index === 0 ? label : ''}
                  labelCol={{ span: index === 0 ? 24 : 0 }}
                >
                  <FormItem {...otherItems} {...otherFields} className="mb-0">
                    {cloneElement(formItem, {
                      suffix: fields.length > 1 && (
                        <CloseOutlined
                          className="p-2 text-[#f15224] text-base rounded-full cursor-pointer hover:bg-[#fcebe6]"
                          onClick={() => remove(otherFields.name)}
                        />
                      ),
                    })}
                  </FormItem>
                </FormItem>
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
        <FormItem key={item.name} label={label} {...otherItems}>
          {formItem}
        </FormItem>
      );
    } else return item;
  });
};

export default FormApplication;
