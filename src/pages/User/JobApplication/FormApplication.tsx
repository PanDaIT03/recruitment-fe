import FormItem from '~/components/Form/FormItem';
import FormList from '~/components/Form/FormList';
import { IApplicationFormItem } from './JobApplication';

interface IProps {
  formItems: IApplicationFormItem[];
}

const FormApplication = ({ formItems }: IProps) => {
  return formItems.map((formItem) => {
    if ('name' in formItem) {
      const { item, listItem, ...others } = formItem;

      if (item)
        return (
          <FormItem key={formItem.name} {...others}>
            {item}
          </FormItem>
        );
      else if (listItem)
        return (
          <FormList
            key={formItem.name}
            formItem={{ ...others }}
            {...listItem}
          />
        );
    } else return formItem;
  });
};

export default FormApplication;
