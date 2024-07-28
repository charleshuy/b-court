import { Menu, Input, Avatar, Dropdown } from "antd";
import {
  AiOutlineSearch,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { FiPhone, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import bad3Image from "../assets/images/bad3.png";
import { jwtDecode } from "jwt-decode";
import { CgProfile } from "react-icons/cg";
import { AiOutlineDollarCircle } from "react-icons/ai";
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
      <Menu.Item key="profile">
        <Link
          to="/profile"
          className="flex justify-start items-center space-x-2"
        >
          <CgProfile />
          <span>Profile</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="wallet">
        <Link
          to="/wallet"
          className="flex justify-start items-center space-x-2"
        >
          <AiOutlineDollarCircle size={15} /> {/* Adjust size as needed */}
          <span>Deposit</span>
        </Link>
      </Menu.Item>

      <Menu.Item key="logout">
        <div className="flex justify-start items-center space-x-2">
          <AiOutlineLogout />
          <button onClick={onLogout}>Logout</button>
        </div>
      </Menu.Item>
    </Menu>
  );

  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerStyle = {
    height: scrollY > 50 ? '150px' : '170px',
    backgroundColor: scrollY > 50 ? '#444B5D' : 'white',
    transition: 'height 0.5s, background-color 0.3s',
  };

  return (
    <header className="sticky top-0 z-20" style={headerStyle}>
      <div className="container mx-auto p-4 flex justify-between items-center bg-lime-500 rounded-xl relative z-10 text-white">
        <div className="flex items-center space-x-4">
          <FiMail className="text-xl" />
          <span>huylouis07@gmail.com</span>
          <FiPhone className="text-xl" />
          <span>0977517855</span>
        </div>
        <div className="flex space-x-4"></div>
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
          <Menu mode="horizontal" className="bg-white rounded-lg flex-1 ml-36 ">
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="shop">
              <Link to="/shop">Court</Link>
            </Menu.Item>
          </Menu>
          <div className="flex items-center space-x-4">
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
                {roleName === "Admin" && (
                  <Link
                    to="/admin/users"
                    className="bg-blue-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"
                  >
                    Admin
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
                className="bg-lime-500 hover:bg-amber-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"

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
