import { Input, Dropdown, Menu, Button } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const handleLogout = () => {
  localStorage.removeItem("token");
};

const menu = (
  <Menu>
    <Menu.Item key="profile">
      <a href="/profile">Profile</a>
    </Menu.Item>
    <Menu.Item key="deposit">
      <a href="/wallet">Deposit</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout">
      <a onClick={handleLogout} href="/">
        Logout
      </a>
    </Menu.Item>
  </Menu>
);

const Headerv2 = () => {
  return (
    <div className="flex justify-end items-center p-4 bg-white shadow-md h-24 w-full sticky right-0">
      <Dropdown overlay={menu} placement="bottomRight">
        <Button
          className="ant-dropdown-link flex items-center"
          onClick={(e) => e.preventDefault()}
        >
          <UserOutlined style={{ fontSize: "20px", marginRight: "8px" }} />
          <span>USER</span>
        </Button>
      </Dropdown>
    </div>
  );
};

export default Headerv2;
