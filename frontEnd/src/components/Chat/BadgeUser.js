import { Tag } from "antd";
import React from "react";

const BadgeUser = ({ user, handleFtn }) => {
  return (
    <Tag color="#2db7f5" onClose={handleFtn} closable>
      {user.name}
    </Tag>
  );
};

export default BadgeUser;
