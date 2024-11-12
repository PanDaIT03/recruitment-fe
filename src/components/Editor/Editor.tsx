import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import {
  IAllProps,
  InitOptions,
} from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';

type IProps = IAllProps;

const initOptions: InitOptions = {
  height: 300,
  menubar: false,
  plugins: [
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'wordcount',
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
};

const Editor = ({ init = initOptions, value, ...props }: IProps) => {
  return (
    <TinyEditor
      init={init}
      value={typeof value === 'string' ? value : ''}
      apiKey={import.meta.env.VITE_APP_TINYMCE_API_KEY}
      {...props}
    />
  );
};

export default Editor;
