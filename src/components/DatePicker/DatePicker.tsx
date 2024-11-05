import {
  ConfigProvider,
  DatePicker as DatePickerAntd,
  DatePickerProps,
} from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import classNames from 'classnames';
import { memo } from 'react';

import viVN from 'antd/lib/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import './DatePicker.scss';

dayjs.locale('vi');

type IDatePickerProps = { isCalendarIconPrefix?: boolean } & DatePickerProps;
type IRangePickerProps = { isCalendarIconPrefix?: boolean } & RangePickerProps;

const { RangePicker: RangePickerAntd } = DatePickerAntd;

const DatePicker = memo(
  ({ isCalendarIconPrefix, className, ...props }: IDatePickerProps) => {
    const customClass = classNames(
      'w-full h-10',
      isCalendarIconPrefix ? 'ant-picker-prefix-icon' : '',
      className
    );

    return (
      <ConfigProvider
        locale={viVN}
        theme={{
          components: {
            DatePicker: {
              colorBgContainer: '#fafafa',
            },
          },
        }}
      >
        <DatePickerAntd className={customClass} {...props} />
      </ConfigProvider>
    );
  }
);

const RangePicker = memo(
  ({ isCalendarIconPrefix, className, ...props }: IRangePickerProps) => {
    const customClass = classNames(
      'w-full h-10',
      isCalendarIconPrefix ? 'ant-picker-prefix-icon' : '',
      className
    );

    return (
      <ConfigProvider
        locale={viVN}
        theme={{
          components: {
            DatePicker: {
              colorBgContainer: '#fafafa',
            },
          },
        }}
      >
        <RangePickerAntd className={customClass} {...props} />
      </ConfigProvider>
    );
  }
);

export { DatePicker, RangePicker };
