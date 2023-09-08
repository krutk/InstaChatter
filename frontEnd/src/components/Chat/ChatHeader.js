import React, { useState } from "react";
import {
  Input,
  Drawer,
  Modal,
  Button,
  Avatar,
  Badge,
  Menu,
  Dropdown,
  Col,
  Row,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "../../App.css";
import ChatSider from "./ChatSider";
import { useHistory } from "react-router-dom";

const ChatHeader = ({ user, setSelectedChat, chats, setChats }) => {
  const [searchDrawerVisible, setSearchDrawerVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const history = useHistory();
  const openSearchDrawer = () => {
    setSearchDrawerVisible(true);
  };

  const closeSearchDrawer = () => {
    setSearchDrawerVisible(false);
  };

  const openProfileModal = () => {
    setProfileModalVisible(true);
  };

  const closeProfileModal = () => {
    setProfileModalVisible(false);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      openProfileModal();
    } else if (key === "logout") {
      localStorage.removeItem("userInfo");
      history.push("/");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="chat-header">
      <div className="left">
        <Input
          placeholder="Search User"
          prefix={<SearchOutlined />}
          onClick={openSearchDrawer}
        />
      </div>
      <div className="center">
        <span className="app-name">InstaChatter</span>
      </div>
      <div className="right">
        <Badge dot>
          <BellOutlined style={{ cursor: "pointer" }} />
        </Badge>
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>{" "}
        <Modal
          title={null} // Set title to null to customize the content
          visible={profileModalVisible}
          onCancel={closeProfileModal}
          footer={[
            <Button key="close" onClick={closeProfileModal}>
              Close
            </Button>,
          ]}
        >
          <Row gutter={16} justify="center" align="middle">
            <Row>
              <Col span={24} content="center">
                <Avatar
                  icon={<UserOutlined />}
                  size={72}
                  style={{ cursor: "pointer" }}
                />
              </Col>
            </Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </Col>
          </Row>
        </Modal>
      </div>
      <Drawer
        title="Search User"
        placement="left"
        onClose={closeSearchDrawer}
        visible={searchDrawerVisible}
        width={300}
        className="search-drawer"
      >
        <ChatSider
          user={user}
          setSelectedChat={setSelectedChat}
          chats={chats}
          setChats={setChats}
          closeSearchDrawer={closeSearchDrawer}
        />
        {/* <Input placeholder="Enter user's name" /> */}
        {/* Add search functionality here */}
      </Drawer>
    </div>
  );
};

export default ChatHeader;
