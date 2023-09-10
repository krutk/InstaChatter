import React, { useEffect, useState } from "react";
import { Row, Col, Button, Input, List, message, Avatar, Space } from "antd";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { getSender } from "../../config/chatMethods";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const ChatInterface = () => {
  const [fetchAgain, setFetchAgain] = useState(true);

  return (
    <div className="chat-interface">
      <div className="main-left">
        <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
      <div className="main-right">
        {/* <h2>{selectedChats.title}</h2>
        <div className="chat-history">
          {selectedChats.history.map((message) => (
            <div key={message.id} className="message">
              {message.text}
            </div>
          ))}
        </div>
        <Input
          placeholder="Type your message..."
          onPressEnter={(e) => {
            sendMessage(e.target.value);
            e.target.value = "";
          }}
        /> */}
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default ChatInterface;
