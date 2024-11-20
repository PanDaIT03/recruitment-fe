import { FormInstance } from 'antd';
import classNames from 'classnames/bind';
import React, { memo, useCallback } from 'react';

import Content from '../Content/Content';
import FormWrapper from '../Form/FormWrapper';
import styles from './index.module.scss';

interface IFilterBoxProps {
  form: FormInstance<any>;
  children: React.ReactNode;
  onFinish(values: any): void;
}

const cx = classNames.bind(styles);

const FilterBox = ({ form, children, onFinish }: IFilterBoxProps) => {
  const handleFinish = useCallback(() => {
    onFinish(form.getFieldsValue());
  }, [onFinish]);

  return (
    <Content className="!bg-[#2f2f41b3]">
      <FormWrapper
        form={form}
        cancelTitle="Hủy"
        submitTitle="Tìm kiếm"
        onFinish={handleFinish}
        className={cx('form')}
      >
        {children}
      </FormWrapper>
    </Content>
  );
};

export default memo(FilterBox);
