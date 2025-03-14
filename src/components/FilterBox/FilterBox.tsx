import { FormInstance } from 'antd';
import {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import useQueryParams from '~/hooks/useQueryParams';
import Content from '../Content/Content';
import FormWrapper from '../Form/FormWrapper';

interface IFilterBoxProps {
  open: boolean;
  form: FormInstance<any>;
  children: ReactNode;
  defaultFilter?: any;
  cancelTitle?: string;
  submitTitle?: string;
  onCancel: () => void;
  onFinish(values: any): void;
  onSetFormValues?: (form: FormInstance<any>, filterParams: any) => void;
}

const FilterBox = ({
  open,
  form,
  children,
  defaultFilter,
  cancelTitle = 'Hủy',
  submitTitle = 'Tìm kiếm',
  onFinish,
  onCancel,
  onSetFormValues,
}: IFilterBoxProps) => {
  const firstRender = useRef(true);
  const { searchParams } = useQueryParams();

  const handleFinish = useCallback(() => {
    onFinish(form.getFieldsValue());
  }, [onFinish]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;

    const formattedObject = Object.entries(searchParams).reduce(
      (prevVal, currentVal) => {
        const [key, value] = currentVal;
        if (value) prevVal[key] = value;

        return prevVal;
      },
      {} as Record<string, any>
    );

    if (onSetFormValues) {
      onSetFormValues(form, formattedObject);
      return;
    }

    form.setFieldsValue(formattedObject);
  }, [form, searchParams, defaultFilter, onSetFormValues]);

  return (
    <Content isOpen={open}>
      <FormWrapper
        form={form}
        cancelTitle={cancelTitle}
        submitTitle={submitTitle}
        onFinish={handleFinish}
        onCancel={handleCancel}
      >
        {children}
      </FormWrapper>
    </Content>
  );
};

export default memo(FilterBox);
