import React, { useEffect, useState } from 'react';
import { Badge, Popover, List } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import useWebSocket from 'react-use-websocket';

interface NotificationMessage {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  role: 'employer' | 'user';
}

interface NotificationComponentProps {
  userRole: 'employer' | 'user';
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  userRole,
}) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const socketUrl = 'wss://echo.websocket.events';
  const { lastMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data: NotificationMessage = JSON.parse(lastMessage.data);

        if (data.role === userRole) {
          setNotifications((prevNotifications) =>
            [data, ...prevNotifications].reverse()
          );
        }
      } catch (error) {
        console.error('Error parsing message', error);
      }
    }
  }, [lastMessage, userRole]);

  const popoverContent = (
    <div className="max-h-60 w-80 overflow-y-auto">
      <List
        dataSource={notifications}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta title={item.title} description={item.message} />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <div className="text-end">
      <Popover
        content={popoverContent}
        title="Thông báo"
        trigger="click"
        placement="leftTop"
      >
        <Badge count={notifications.length || 1} offset={[-20, 0]}>
          <BellOutlined className="cursor-pointer" style={{ fontSize: 24 }} />
        </Badge>
      </Popover>
    </div>
  );
};

export default NotificationComponent;
