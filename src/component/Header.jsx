import { Menu, Input, Avatar, Dropdown } from "antd";
import {
  AiOutlineSearch,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { FiMapPin, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import bad3Image from "../assets/images/bad3.png";
import { jwtDecode } from "jwt-decode";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
const { SubMenu } = Menu;
import UserAPI from "../api/UserAPI";
const Header = ({ isLoggedIn, onLogout }) => {
  const token = localStorage.getItem("token");
  const userName = token ? jwtDecode(token).name : "";
  const decodedToken = token ? jwtDecode(token) : null;
  const roleName = decodedToken ? decodedToken.roleName : null;
  const userId = decodedToken ? decodedToken.userId : null; // Added userId

  const [imageUrl, setImageUrl] = useState("/path/to/default/avatar.jpg"); // State for avatar URL

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Fetch user's profile photo
        const userResponse = await UserAPI.getUserById(userId);
        const photoUrl = "http://localhost:8080/files/" + userResponse.fileId; // Assuming fileId is used as avatar ID
        setImageUrl(photoUrl);
      } catch (error) {
        console.error("Failed to fetch avatar:", error);
        // Set default avatar URL in case of error
        setImageUrl("/path/to/default/avatar.jpg");
      }
    };

    if (userId) {
      fetchAvatar();
    }
  }, [userId]);

  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <a
          href="#settings"
          className="flex justify-start items-center space-x-2"
        >
          <AiOutlineSetting />
          <span>Settings</span>
        </a>
      </Menu.Item>
      <Menu.Item key="profile">
        <Link
          to="/profile"
          className="flex justify-start items-center space-x-2"
        >
          <CgProfile />
          <span>Profile</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="staff">
        <a
          href="staff/check-in"
          className="flex justify-start items-center space-x-2"
        >
          <CgProfile />
          <span>Staff</span>
        </a>
      </Menu.Item>
      <Menu.Item key="logout">
        <div className="flex justify-start items-center space-x-2">
          <AiOutlineLogout />
          <button onClick={onLogout}>Logout</button>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="container mx-auto p-4 flex justify-between items-center bg-green-500 rounded-xl relative z-10 text-white">
        <div className="flex items-center space-x-4">
          <FiMapPin className="text-xl" />
          <span>123 Street, New York</span>
          <FiMail className="text-xl" />
          <span>Email@Example.com</span>
        </div>
        <div className="flex space-x-4">
          <a href="#privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:underline">
            Terms of Use
          </a>
          <a href="#refunds" className="hover:underline">
            Sales and Refunds
          </a>
        </div>
      </div>
      <div>
        <div className="container mx-auto p-4 flex justify-between items-center relative">
          <div className="relative w-44 h-20">
            <Link to="/">
              <img
                src={bad3Image}
                alt="Logo"
                style={{
                  position: "absolute",
                  top: "-50px",
                  left: "0",
                  zIndex: "20",
                }}
              />
            </Link>
          </div>
          <Menu mode="horizontal" className="bg-white flex-1 ml-36">
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="shop">
              <Link to="/shop">Shop</Link>
            </Menu.Item>
            <Menu.Item key="shop-detail">
              <a href="#shop-detail">Shop Detail</a>
            </Menu.Item>
            <SubMenu title="Pages">
              <Menu.Item key="page1">
                <a href="#page1">Page 1</a>
              </Menu.Item>
              <Menu.Item key="page2">
                <a href="#page2">Page 2</a>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="contact">
              <a href="#contact">Contact</a>
            </Menu.Item>
          </Menu>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="search"
              prefix={<AiOutlineSearch className="text-xl text-gray-500" />}
              className="rounded-full"
            />
            {isLoggedIn ? (
              <>
                {roleName === "Manager" && (
                  <Link
                    to="/manager/courts"
                    className="bg-blue-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"
                  >
                    Manager
                  </Link>
                )}
                {roleName === "Staff" && (
                  <Link
                    to="/staff/check-in"
                    className="bg-blue-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"
                  >
                    Staff
                  </Link>
                )}
                <Dropdown overlay={menu} placement="bottomRight">
                  <div className="flex items-center space-x-4 cursor-pointer">
                    <Avatar src={imageUrl} /> {/* Display avatar */}
                  </div>
                </Dropdown>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-green-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
