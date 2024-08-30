import { Col, Divider, Row } from 'antd';
import Button from '~/components/Button/Button';

const Header = () => {
  return (
    <Row
      align={'middle'}
      justify={'space-between'}
      className="bg-white h-16 px-8"
    >
      <Col>Logo</Col>
      <Col className="flex gap-3">
        <Button title="Đăng ký / Đăng nhập" />
        <Divider type="vertical" />
        <Button fill title="Nhà tuyển dụng" />
      </Col>
    </Row>
  );
};

export default Header;
