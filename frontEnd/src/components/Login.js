import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios"; // Import axios for making HTTP requests
import { useHistory } from "react-router-dom";
const Login = () => {
  const [loginForm] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (values) => {
    const { email, password } = values;

    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      console.log("Login Successful:", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      message.success("Login Successful!");
      history.push("/chats");
    } catch (error) {
      console.error("Login Error:", error);

      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={loginForm} onFinish={handleLoginSubmit}>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please enter a valid email!",
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email address" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input
          prefix={<LockOutlined />}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          suffix={
            <Button
              type="text"
              icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={togglePasswordVisibility}
            />
          }
        />
      </Form.Item>
      <Form.Item>
        <Spin spinning={loading}>
          {" "}
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </Spin>
      </Form.Item>
    </Form>
  );
};

export default Login;
