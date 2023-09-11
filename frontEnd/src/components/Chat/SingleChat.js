import React, { useRef, useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Button, Col, Input, List, Row, Space, Spin, notification } from "antd";
import { getSender } from "../../config/chatMethods";
import { SendOutlined } from "@ant-design/icons";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { EyeOutlined } from "@ant-design/icons";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const [isUpdateGroupChatModalVisible, setIsUpdateGroupChatModalVisible] =
    useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const sendMessage = async (event) => {
    if (newMessage.trim() === "") return;
    if (event?.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new-message", data);
        setMessages([...messages, data]);
      } catch (e) {
        message.error({
          message: "Error",
          description: "Error in sending message",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log("fetched-chat->", { data });
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (e) {
      notification.error({
        message: "Error",
        description: "Failed to load the messages",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      console.log("message received", newMessageRecieved);
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const openUpdateGroupChatModal = () => {
    setIsUpdateGroupChatModalVisible(true);
  };
  const closeUpdateGroupChatModal = () => {
    setIsUpdateGroupChatModalVisible(false);
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
                  fetchMessages={fetchMessages}
                />
              </div>
            )}
          </Col>
          <div>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "calc(100vh - 128px)",
                  alignItems: "center",
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
          </div>
          <Row gutter={16}>
            <Col span={18}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={typingHandler}
                onPressEnter={sendMessage}
                // style={{ flex: 1 }}
              />
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                style={{ width: "100%" }}
              >
                Send
              </Button>
            </Col>
          </Row>

          {/* </Col>  */}
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
