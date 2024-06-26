import { Menu } from "antd";
import {
  AppstoreOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import bad3Image from "../assets/images/bad3.png";

const SideBar = () => {
  return (
    <div className="h-screen w-[15%] bg-white shadow-md sticky top-0 left-0">
      <div className="flex items-center justify-center py-4 w-full h-32">
        <Link to="/manager/courts">
          <img src={bad3Image} alt="Logo" className="h-auto w-52" />
        </Link>
      </div>
      <Menu className="border-r-0">
        <Menu.Item key="1" icon={<AppstoreOutlined />}>
          <Link to="/manager/courts">Courts</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<OrderedListOutlined />}>
          <Link to="/manager/orders">Order List</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          <Link to="/manager/staff">Staff</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default SideBar;
