import React, { useEffect, useState } from "react";
import { getSender } from "../../config/chatMethods";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Avatar, Button, List, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [isCreateGroupChatModalVisible, setIsCreateGroupChatModalVisible] =
    useState(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/chat`, config);
      console.log("fetchChats", data);
      setChats(data);
    } catch (error) {
      message.error("Failed to retrieve chats", error);
    }
  };

  useEffect(() => {
    if(user) {
    setLoggedUser(JSON.parse(localStorage?.getItem("userInfo")));
    fetchChats();
    }
    //eslint-disable-next-line
  }, [user, fetchAgain]);

  const handleChatItemClick = (chat) => {
    setSelectedChat(chat);
  };

  const openCreateGroupChatModal = () => {
    setIsCreateGroupChatModalVisible(true);
  };

  const closeCreateGroupChatModal = () => {
    setIsCreateGroupChatModalVisible(false);
  };

  return (
    <div>
      <Space>
        <h2>My Chats</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateGroupChatModal}
        >
          Group Chat
        </Button>
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(item) => (
          <List.Item
            style={
              item._id === selectedChat?._id
                ? {
                    backgroundColor: "lightgray",
                    borderRadius: "8px",
                    padding: "8px",
                  }
                : { padding: "8px" }
            }
            onClick={() => handleChatItemClick(item)}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.pic} style={{ marginLeft: "8px" }} />} // Add marginLeft for space
              title={
                <span style={{ cursor: "pointer" }}>
                  {!item.isGroupChat
                    ? getSender(loggedUser, item.users)
                    : item.chatName}
                </span>
              }
              description={item.email}
            />
          </List.Item>
        )}
      />

      <GroupChatModal
        visible={isCreateGroupChatModalVisible}
        onCancel={closeCreateGroupChatModal}
      />
    </div>
  );
};

export default MyChats;
