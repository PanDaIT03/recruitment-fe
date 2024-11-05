import { Form } from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/es/form';
import { FormItemProps } from 'antd/lib';
import { memo, ReactNode } from 'react';

import icons from '~/utils/icons';
import Button from '../Button/Button';
import FormItem from './FormItem';

const { List } = Form;

interface IFormListParamsRender {
  fields: FormListFieldData[];
  func: FormListOperation;
}

export interface IFormListProps {
  length: number;
  buttonTitle: string;
  render: (params: IFormListParamsRender) => ReactNode;
}

type IFormList = {
  formItem: FormItemProps;
} & IFormListProps;

const { PlusCircleOutlined } = icons;

const FormList = ({ formItem, length, buttonTitle, render }: IFormList) => {
  const { name, label, ...otherItems } = formItem;

  return (
    <List name={name}>
      {(fields, func) => (
        <FormItem label={label} {...otherItems}>
          <>
            {render({ fields, func })}
            {fields.length < length ? (
              <Button
                borderType="dashed"
                title={buttonTitle}
                iconBefore={<PlusCircleOutlined className="text-base" />}
                onClick={() => func.add()}
              />
            ) : null}
          </>
        </FormItem>
      )}
    </List>
  );
};

export default memo(FormList);
