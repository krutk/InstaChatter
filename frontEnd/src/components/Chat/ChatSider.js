import { Button, Col, Input, Row, Space, message, List, Avatar } from "antd";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const ChatSider = ({
  user,
  setSelectedChat,
  chats,
  setChats,
  closeSearchDrawer,
}) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const handleSearch = async () => {
    if (search.trim() === "") {
      message.error("Please enter a user's name.");
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
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      message.error("Failed to retrieve search results");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log("accessChat", data);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      message.error("Error fetching chat", error);
    }
  };

  return (
    <>
      <Space>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Input
              placeholder="Enter user's name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button
              onClick={handleSearch}
              type="primary"
              block
              icon={<SearchOutlined />}
            >
              Go
            </Button>
          </Col>
        </Row>
      </Space>
      <div style={{ marginTop: "16px" }}>
        <List
          itemLayout="horizontal"
          dataSource={searchResult}
          loading={loading}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.pic} />}
                title={
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      accessChat(item._id);
                      closeSearchDrawer();
                    }}
                  >
                    {item?.name}
                  </span>
                }
                description={item.email}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default ChatSider;
