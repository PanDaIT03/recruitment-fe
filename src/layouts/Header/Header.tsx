import { Col, Image, Row } from 'antd';
import Button from '~/components/Button/Button';

const Header = () => {
  return (
    <Row
      align={'middle'}
      justify={'space-between'}
      className="bg-[#692474] h-16 px-8"
    >
      <Col><Image preview={false} src='' alt='logo'/></Col>
      <Col className="flex gap-3 items-center">
        <Button
          displayType="text"
          customClass="hover:bg-[#461A53]"
          title={
            <div className="flex flex-col text-start">
              <span className="text-xs">Người tìm việc</span>
              <span className="text-sm">Đăng ký/ Đăng nhập</span>
            </div>
          }
        />
        <hr className="border-l-[1px]	border-white h-7" />
        <Button fill title="Nhà tuyển dụng" />
      </Col>
    </Row>
  );
};

export default Header;
