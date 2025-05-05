import { FormInstance } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { memo, ReactNode, useCallback, useEffect, useRef } from 'react';

import useQueryParams from '~/hooks/useQueryParams';
import { formatDateToBE } from '~/utils/functions';
import Content from '../Content/Content';
import FormWrapper, { IFormWrapper } from '../Form/FormWrapper';

interface IFilterBoxProps extends IFormWrapper {
  open?: boolean;
  wrapper?: boolean;
  className?: string;
  defaultFilter?: any;
  onCancel: () => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onSetFormValues?: (form: FormInstance<any>, filterParams: any) => void;
}

interface IWapperCompProps {
  children: ReactNode;
}

const FilterBox = ({
  form,
  children,
  defaultFilter,
  open = true,
  wrapper = true,
  cancelTitle = 'Hủy',
  submitTitle = 'Tìm kiếm',
  onFinish,
  onCancel,
  onPageChange,
  onSetFormValues,
  ...props
}: IFilterBoxProps) => {
  const firstRender = useRef(true);
  const { searchParams } = useQueryParams();

  const WrapperComp = useCallback(
    ({ children }: IWapperCompProps) =>
      wrapper ? <Content isOpen={open}>{children}</Content> : children,
    [wrapper, open]
  );

  const handleFinish = useCallback(() => {
    const formValues = form.getFieldsValue();
    const formattedParams = Object.entries(formValues).reduce(
      (prevVal, currentVal) => {
        const [key, value] = currentVal;

        if (key.includes('createdDate'))
          prevVal[key] = value ? formatDateToBE(value as Dayjs) : value;
        else prevVal[key] = value;

        return prevVal;
      },
      {} as Record<string, any>
    );

    onPageChange(1, 10);
    onFinish(formattedParams);
  }, [form, onFinish, onPageChange]);

  const handleCancel = useCallback(() => {
    form.resetFields();

    onPageChange(1, 10);
    onCancel();
  }, [form, onCancel, onPageChange]);

  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;

    const formattedObject = Object.entries(searchParams).reduce(
      (prevVal, currentVal) => {
        const [key, value] = currentVal;
        if (value) {
          if (key.includes('createdDate') && typeof value === 'string')
            prevVal[key] = value ? dayjs(value) : '';
          else prevVal[key] = value;
        }

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
    <WrapperComp>
      <FormWrapper
        form={form}
        cancelTitle={cancelTitle}
        submitTitle={submitTitle}
        onFinish={handleFinish}
        onCancel={handleCancel}
        {...props}
      >
        {children}
      </FormWrapper>
    </WrapperComp>
  );
};

export default memo(FilterBox);
