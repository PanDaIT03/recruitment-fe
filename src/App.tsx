import { Space } from 'antd';
import { Counter } from './pages/Counter';
import { WebSocketDemo } from './websocket/Websocket';

function App() {
  return (
    <>
      <Space direction="vertical" size={'large'}>
        <Counter />
        <WebSocketDemo />
      </Space>
    </>
  );
}

export default App;
