import { Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-200 py-12">
      <div className="flex justify-between mx-44 mb-10">
        <div className="flex-col">
          <h2 className="text-4xl font-semibold text-orange-400 mb-4">
            Bcourt
          </h2>
          <h3 className="text-2xl">Start Playing Today</h3>
        </div>

        <div className="flex space-x-4 mt-4">
          <FacebookOutlined className="text-xl cursor-pointer hover:text-white" />
          <TwitterOutlined className="text-xl cursor-pointer hover:text-white" />
          <YoutubeOutlined className="text-xl cursor-pointer hover:text-white" />
          <LinkedinOutlined className="text-xl cursor-pointer hover:text-white" />
        </div>
      </div>
      <hr className="border-t-2 border-orange-500 my-8" />
      <div className="container mx-44 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Why People Like Us!
          </h3>
          <p>
            Typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the like Aldus PageMaker including of Lorem Ipsum.
          </p>
          <Button
            type="link"
            className="mt-4 text-orange-400 border border-orange-400 rounded-lg px-4 py-2"
          >
            Read More
          </Button>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Shop Info
          </h3>
          <ul>
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">
              Terms & Condition
            </li>
            <li className="hover:text-white cursor-pointer">Return Policy</li>
            <li className="hover:text-white cursor-pointer">FAQs & Help</li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Account
          </h3>
          <ul>
            <li className="hover:text-white cursor-pointer">My Account</li>
            <li className="hover:text-white cursor-pointer">Shop Details</li>
            <li className="hover:text-white cursor-pointer">Shopping Cart</li>
            <li className="hover:text-white cursor-pointer">Wishlist</li>
            <li className="hover:text-white cursor-pointer">Order History</li>
            <li className="hover:text-white cursor-pointer">
              International Orders
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <p className="text-orange-400 mb-2">Contact</p>
          <p>Address: 1429 Netus Rd, NY 48247</p>
          <p>Email: Example@gmail.com</p>
          <p>Phone: +0123 4567 8910</p>

          <img src="src/assets/images/payment.png" alt="Visa" className="h-6" />

          <p className="mt-4 text-gray-500">
            © Your Site Name, All rights reserved.
          </p>
          <p className="mt-4 text-gray-500">
            Designed by HTML Codex Distributed By ThemeWagon
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
