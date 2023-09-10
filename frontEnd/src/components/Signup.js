import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Modal, Spin } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
const Signup = () => {
  const [signupForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const history = useHistory();
  const handleSignupSubmit = async (values) => {
    const { name, email, password } = values;
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );

      setSuccessModalVisible(true);
      localStorage?.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleModalOk = () => {
    setSuccessModalVisible(false);
    history?.push("/chats");
    signupForm.resetFields();
  };

  return (
    <div>
      <Form form={signupForm} onFinish={handleSignupSubmit}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>
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
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("The two passwords do not match!");
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign up
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Signup Successful"
        visible={successModalVisible}
        onOk={handleModalOk}
        onCancel={() => setSuccessModalVisible(false)}
      >
        <p>Your signup was successful!</p>
        {/* <p>You can now log in using your credentials.</p> */}
      </Modal>
      <Spin spinning={loading}>
        {" "}
        <Button type="primary" htmlType="submit">
          Signing up
        </Button>
      </Spin>
    </div>
  );
};

export default Signup;
