import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  Space,
  message,
  Spin,
  List,
  Avatar,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import BadgeUser from "./BadgeUser";

const { Option } = Select;

const GroupChatModal = ({ visible, onCancel }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();
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

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      message.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      message.warning("Please fill all the fields");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onCancel();
      message.success("New group chat created!");
    } catch (error) {
      message.error("failed to create group chat");
      onCancel();
    }
  };

  return (
    <Modal
      title="Create Group Chat"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={handleSubmit}>
          Create Group
        </Button>,
      ]}
    >
      <Input
        placeholder="Chat Name"
        onChange={(e) => setGroupChatName(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <Input
        placeholder="Add Users eg: ..- - -.- .- .-. ... .... --..-- ....... -.- .. ... .... .- -."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {selectedUsers.map((user) => (
        <BadgeUser
          key={user._id}
          user={user}
          handleFtn={() => handleDelete(user)}
        />
      ))}
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
                    onClick={() => handleGroup(user)}
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

export default GroupChatModal;
