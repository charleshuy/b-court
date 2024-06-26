import { Input, Dropdown, Menu, Button } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const { Search } = Input;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="#profile">Profile</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="#settings">Settings</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <a href="#logout">Logout</a>
    </Menu.Item>
  </Menu>
);

const Headerv2 = () => {
  return (
    <div className="flex justify-end items-center p-4 bg-white shadow-md h-24 w-full sticky right-0">
      <Search
        placeholder="Search"
        onSearch={(value) => console.log(value)}
        style={{ width: 200 }}
        className="mr-4"
        prefix={<SearchOutlined />}
      />
      <Dropdown overlay={menu} trigger={["click"]}>
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
