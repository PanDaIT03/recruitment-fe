import { FormItemProps, ModalProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { JobsAPI } from '~/apis/job';
import { BackPack, Salary } from '~/assets/svg';
import FormItem from '~/components/Form/FormItem';
import FormList, { IFormListProps } from '~/components/Form/FormList';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Modal from '~/components/Modal/Modal';
import Select from '~/components/Select/Select';
import { useFetch } from '~/hooks/useFetch';
import { JobPlacement } from '~/types/Job';
import { formatCurrencyVN } from '~/utils/functions';
import icons from '~/utils/icons';
import { startTimeOptions } from '../JobApplication/JobApplication';

interface IProps extends ModalProps {
  isOpen: boolean;
}

interface IApplicationFormItem extends FormItemProps {
  name: string;
  item?: ReactElement;
  listItem?: IFormListProps;
}

const { CloseOutlined } = icons;

const ModalDesiredJob = ({ isOpen, ...props }: IProps) => {
  const [form] = useForm();

  const { data: placements } = useFetch<JobPlacement>(JobsAPI.getAllPlacements);

  const handleSalaryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value,
        numericValue = value.replace(/[^0-9]/g, '');

      let formattedValue = '';
      if (numericValue) formattedValue = formatCurrencyVN(Number(numericValue));

      form.setFieldValue('salary', formattedValue);
    },
    []
  );

  const formItems: IApplicationFormItem[] = useMemo(() => {
    return [
      {
        name: 'field',
        label: 'Lĩnh vực bạn muốn ứng tuyển?',
        item: <Select placeholder="Lĩnh vực" />,
      },
      {
        name: 'positions',
        required: true,
        label: 'Vị trí muốn ứng tuyển? (Tối đa 3 vị trí)',
        listItem: {
          length: 3,
          buttonTitle: 'Thêm vị trí muốn ứng tuyển',
          render: (params) => {
            const { fields, func } = params;

            return fields.map((field) => (
              <FormItem {...field} key={field.key} className="mb-3">
                <Input
                  allowClear
                  className="w-full"
                  placeholder="Ví dụ: Marketing"
                  prefix={<BackPack />}
                  suffix={
                    fields.length > 1 && (
                      <CloseOutlined
                        className="p-2 text-[#f15224] text-base rounded-full cursor-pointer hover:bg-[#fcebe6]"
                        onClick={() => func.remove(field.name)}
                      />
                    )
                  }
                />
              </FormItem>
            ));
          },
        },
      },
      {
        name: 'placement',
        label: 'Nơi bạn mong muốn tìm việc? (Tối đa 3 địa điểm)',
        rules: [
          {
            validator: (_, value) => {
              if (!value.length) return Promise.resolve();

              if (value.length > 3)
                return Promise.reject('Chỉ được chọn tối đa 3 địa điểm');

              return Promise.resolve();
            },
          },
        ],
        item: (
          <Select
            mode="multiple"
            placeholder="Chọn thành phố"
            options={placements?.items?.map((place) => ({
              value: place?.id,
              label: place?.title,
            }))}
          />
        ),
        // rules: [{ required: true, message: 'Vui lòng chọn địa điểm' }],
      },
      {
        name: 'salary',
        label: 'Mức lương kỳ vọng (VNĐ)',
        item: (
          <Input
            inputMode="numeric"
            prefix={<Salary />}
            placeholder="Ví dụ: 30,000,000"
            onChange={handleSalaryChange}
          />
        ),
        extra: 'Để trống nếu bạn muốn thương lượng sau.',
        // rules: [{ required: true, message: 'Vui lòng nhập mức lương' }],
      },
      {
        name: 'time',
        label: 'Thời gian có thể bắt đầu làm việc kể từ khi nhận offer?',
        className: 'mb-0',
        item: (
          <Select placeholder="Chọn thời gian" options={startTimeOptions} />
        ),
        // rules: [
        //   {
        //     required: true,
        //     message: 'Vui lòng chọn thời gian bắt đầu làm việc',
        //   },
        // ],
      },
    ];
  }, [placements]);

  const handleFinish = useCallback(() => {
    console.log('finish');
  }, []);

  useEffect(() => {
    const positions = form.getFieldValue('positions');

    if (!positions || positions.length === 0)
      form.setFieldsValue({ positions: [''] });
  }, []);

  return (
    <Modal
      centered
      isOpen={isOpen}
      {...props}
      title="Cập nhật công việc mong muốn"
    >
      <FormWrapper form={form} onFinish={handleFinish}>
        {formItems.map((formItem) => {
          const { item, listItem, ...others } = formItem;

          if (item) return <FormItem {...others}>{item}</FormItem>;
          else if (listItem)
            return (
              <FormList
                key={formItem.name}
                formItem={{ ...others }}
                {...listItem}
              />
            );
        })}
      </FormWrapper>
    </Modal>
  );
};

export default ModalDesiredJob;
