// import useWebSocket, { ReadyState } from 'react-use-websocket';
// import { Button } from 'antd';

// const WebSocketComponent: React.FC = () => {
//   const socketUrl = 'wss://echo.websocket.org1';

//   const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

//   const connectionStatus = {
//     [ReadyState.CONNECTING]: 'Connecting',
//     [ReadyState.OPEN]: 'Open',
//     [ReadyState.CLOSING]: 'Closing',
//     [ReadyState.CLOSED]: 'Closed',
//     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
//   }[readyState];

//   return (
//     <div>
//       <Button onClick={() => sendMessage('Hello World')}>Send Message</Button>
//       <p>
//         Last message:
//         {lastMessage ? lastMessage.data : 'No message received yet'}
//       </p>
//       <p>Connection status: {connectionStatus}</p>
//     </div>
//   );
// };

// export default WebSocketComponent;

import { Button, Space } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('wss://demos.kaazing.com/echo'),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <Space>
        <Button onClick={handleClickChangeSocketUrl}>
          Click Me to change Socket Url
        </Button>
        <Button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </Button>
      </Space>
      <div>
        <Space direction="vertical">
          <span>The WebSocket is currently {connectionStatus}</span>
          {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
          <ul>
            {messageHistory.map((message, idx) => {
              console.log(message);
              return <li key={idx}>{message ? message.data : null}</li>;
            })}
          </ul>
        </Space>
      </div>
    </div>
  );
};
