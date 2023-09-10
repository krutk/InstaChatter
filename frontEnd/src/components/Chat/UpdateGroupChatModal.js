import { Avatar, Button, Input, List, Modal, Spin, message } from "antd";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import BadgeUser from "./BadgeUser";
import axios from "axios";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  visible,
  onCancel,
  fetchMessages,
}) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [renameLoading, setRenameLoading] = useState(false);
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      message.warning("Only admins can remove someone!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/removefromgroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      message.error("Error Occured", error);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      message.error("Error Occured", error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log("data: ", data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      message.error("Failed to retrieve search results", error);
    }
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      message.warning("User already in the group");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      message.warning("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/addtogroup",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      message.error("Error Occured", error);
      setLoading(false);
    }
  };
  return (
    <Modal
      title={selectedChat.chatName}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="create" type="primary" danger onClick={handleRemove}>
          Leave Group
        </Button>,
        <Button key="create" type="primary" onClick={handleRename}>
          Update Group
        </Button>,
      ]}
    >
      {selectedChat.users.map((u) => (
        <BadgeUser key={u._id} user={u} handleFtn={() => handleRemove(u)} />
      ))}
      <Input
        placeholder="Chat Name"
        value={groupChatName}
        onChange={(e) => setGroupChatName(e.target.value)}
        style={{ margin: "10px 0" }}
      />
      <Input
        placeholder="Add User to group"
        onChange={(e) => handleSearch(e.target.value)}
      />
      {loading ? (
        <Spin />
      ) : (
        <List
          key={user._id}
          itemLayout="horizontal"
          dataSource={searchResult?.slice(0, 4)}
          loading={loading}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={user.pic} />}
                title={
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleAddUser(user)}
                  >
                    {user?.name}
                  </span>
                }
                description={user.email}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default UpdateGroupChatModal;
