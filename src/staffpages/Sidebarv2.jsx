import { Menu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import bad3Image from "../assets/images/bad3.png";

const SideBar = () => {
  return (
    <div className="h-screen w-[15%] bg-white shadow-md sticky top-0 left-0">
      <div className="flex items-center justify-center py-4 w-full h-32">
        <Link to="/staff/courts">
          <img src={bad3Image} alt="Logo" className="h-auto w-52" />
        </Link>
      </div>
      <Menu className="border-r-0">
        <Menu.Item key="1" icon={<AppstoreOutlined />}>
          <Link to="/staff/check-in">Check in</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default SideBar;
