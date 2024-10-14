import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { createContext, ReactNode, useContext } from 'react';

interface IMessageContext {
  messageApi: MessageInstance;
}

const MessageContext = createContext<IMessageContext>(undefined as never);
const useMessage = () => useContext(MessageContext);

const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ messageApi }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export { useMessage, MessageProvider };
