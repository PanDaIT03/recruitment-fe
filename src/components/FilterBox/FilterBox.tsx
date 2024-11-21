import { FormInstance } from 'antd';
import classNames from 'classnames/bind';
import React, { memo, useCallback } from 'react';

import Content from '../Content/Content';
import FormWrapper from '../Form/FormWrapper';
import styles from './index.module.scss';

interface IFilterBoxProps {
  open: boolean;
  form: FormInstance<any>;
  children: React.ReactNode;
  onFinish(values: any): void;
  onCancel: () => void;
}

const cx = classNames.bind(styles);

const FilterBox = ({
  open,
  form,
  children,
  onFinish,
  onCancel,
}: IFilterBoxProps) => {
  const handleFinish = useCallback(() => {
    onFinish(form.getFieldsValue());
  }, [onFinish]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [onCancel]);

  return (
    <Content
      className={cx('!bg-[#2f2f41b3]', !open && 'h-0 overflow-hidden !p-0')}
    >
      <FormWrapper
        form={form}
        cancelTitle="Hủy"
        submitTitle="Tìm kiếm"
        cancelClass="text-admin-primary border-primary-110 hover:bg-primary-110 hover:text-white"
        submitClass="bg-primary-110 hover:bg-primary-110 hover:opacity-[.8]"
        onFinish={handleFinish}
        onCancel={handleCancel}
        className={cx('form')}
      >
        {children}
      </FormWrapper>
    </Content>
  );
};

export default memo(FilterBox);
