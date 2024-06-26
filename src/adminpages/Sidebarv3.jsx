import { Menu } from "antd";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import bad3Image from "../assets/images/bad3.png";

const SideBar = () => {
  return (
    <div className="h-screen w-[15%] bg-white shadow-md sticky top-0 left-0">
      <div className="flex items-center justify-center py-4 w-full h-32">
        <Link to="/admin/requests">
          <img src={bad3Image} alt="Logo" className="h-auto w-52" />
        </Link>
      </div>
      <Menu className="border-r-0">
        <Menu.Item key="1" icon={<AppstoreOutlined />}>
          <Link to="/admin/requests">Courts</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/admin/users">Management User</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default SideBar;
