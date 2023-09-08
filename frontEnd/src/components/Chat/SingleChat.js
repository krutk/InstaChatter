import React, { useRef, useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Button, Col, Input, List, Row } from "antd";
import { getSender } from "../../config/chatMethods";
import { SendOutlined } from "@ant-design/icons";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { EyeOutlined } from "@ant-design/icons";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [isUpdateGroupChatModalVisible, setIsUpdateGroupChatModalVisible] =
    useState(false);
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageObject = {
      text: newMessage,
      sender: user._id,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, messageObject]);

    setNewMessage("");
  };

  const openUpdateGroupChatModal = () => {
    setIsUpdateGroupChatModalVisible(true);
  };
  const closeUpdateGroupChatModal = () => {
    setIsUpdateGroupChatModalVisible(false);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 96px)" }}>
      {selectedChat ? (
        <>
          <Col>
            {!selectedChat.isGroupChat ? (
              <>{getSender(user, selectedChat.users)}</>
            ) : (
              <div>
                <Row justify={"space-between"}>
                  <Col>{selectedChat.chatName.toUpperCase()}</Col>
                  <Col>
                    <EyeOutlined onClick={openUpdateGroupChatModal} />
                  </Col>
                </Row>

                <UpdateGroupChatModal
                  visible={isUpdateGroupChatModalVisible}
                  onCancel={closeUpdateGroupChatModal}
                />
              </div>
            )}
          </Col>
          {/* <Col> Messages here</Col> */}
          <Col
            style={{ flex: "10", overflowY: "auto" }}
            ref={messagesContainerRef}
          >
            <List
              dataSource={messages}
              renderItem={(message) => <List.Item>{message.text}</List.Item>}
            />
          </Col>
          <Col style={{ flex: "1" }}>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleSendMessage}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Col>
          {/*  */}
        </>
      ) : (
        <Row justify="center" align="middle" minHeight="100%">
          <Col style={{ fontSize: "32px" }}>
            Click on a user to start chatting
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SingleChat;
