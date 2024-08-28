import { Button } from 'antd';
import toast from '~/utils/functions/toast';

const Header = () => {
  const handleNotify = () => {
    toast.success('Ok!');
  };

  return (
    <div className="p-5">
      <Button onClick={handleNotify}>Click me!</Button>
    </div>
  );
};

export default Header;
