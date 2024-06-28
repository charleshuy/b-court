import { Menu, Input } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { FiMapPin, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import bad3Image from "../assets/images/bad3.png";
import { jwtDecode } from "jwt-decode";

const { SubMenu } = Menu;

const Header = ({ isLoggedIn, onLogout }) => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const roleName = decodedToken ? decodedToken.roleName : null;

  return (
    <header className="relative text-white">
      <div className="container mx-auto p-4 flex justify-between items-center bg-green-500 rounded-xl relative z-10">
        <div className="flex items-center space-x-4">
          <FiMapPin className="text-xl" />
          <span>123 Street, New York</span>
          <FiMail className="text-xl" />
          <span>Email@Example.com</span>
        </div>
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="bg-blue-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"
              >
                Profile
              </Link>
            </>
          ) : (
            <Link
              to="/signup"
              className="bg-green-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"
            >
              Sign up
            </Link>
          )}
        </div>
      </div>
      <div className="sticky top-0 bg-white z-20">
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
                    Court
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white px-4 py-2 w-full h-8 rounded flex items-center justify-center"
                >
                  Logout
                </button>
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
