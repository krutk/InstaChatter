import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMain from "../components/Chat/ChatMain";
const Chat = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();

  return (
    <div>
      <ChatHeader
        user={user}
        setSelectedChat={setSelectedChat}
        chats={chats}
        setChats={setChats}
      />
      <ChatMain />
    </div>
  );
};

export default Chat;
