import React, { useEffect, useState } from "react";
import { Tabs } from "antd";

import "../App.css";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useHistory } from "react-router-dom";

const { TabPane } = Tabs;
const Home = () => {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) history.push("/chats");
  }, [history]);

  return (
    <div className="login-signup-container">
      <div className="login-signup-card">
        <h1>InstaChatter</h1>
        <Tabs defaultActiveKey="login">
          <TabPane tab="Login" key="login">
            <Login />
          </TabPane>
          <TabPane tab="Sign Up" key="signup">
            <Signup />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
