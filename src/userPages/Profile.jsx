import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UserAPI from "../api/UserAPI";
import OrderAPI from "../api/OrderAPI";
import FileAPI from "../api/FileAPI"; // Import FileAPI
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [imageUrl, setImageUrl] = useState("/path/to/default/avatar.jpg");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const userResponse = await UserAPI.getUserById(userId);
        setUser(userResponse);
        setEditableUser(userResponse);

        const ordersResponse = await OrderAPI.getOrdersByUserId(userId);
        setOrders(ordersResponse);

        // Fetch and set user's profile photo
        const photoUrl = "http://localhost:8080/files/" + userResponse.fileId; // Assuming userId is used as fileId for simplicity
        setImageUrl(photoUrl);
      } catch (error) {
        console.error("Failed to fetch user or orders:", error);
      }
    };

    fetchUser();
  }, []);

  const handleUpload = async ({ file }) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const fileId = await FileAPI.uploadFile(userId, file);
      message.success("File uploaded successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to upload file:", error);
      message.error("Failed to upload file.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      await UserAPI.updateUser(editableUser);
      message.success("Update successfully");
      setUser(editableUser);
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update.");
      console.error("Failed to update user:", error);
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) =>
        text.toLocaleString("en-US", { style: "currency", currency: "USD" }),
    },
    { title: "Court", dataIndex: "courtName", key: "courtName" },
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
      render: (_, record) =>
        `${record.slotStart.split(":")[0]}:00 - ${
          record.slotEnd.split(":")[0]
        }:00 ${record.bookingDate}`,
    },
    {
      title: "Payment Method",
      dataIndex: "methodMethodName",
      key: "methodMethodName",
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex items-center justify-center space-x-4">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <Upload customRequest={handleUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Change Photo</Button>
        </Upload>
      </div>
      <div className="mt-6 space-y-6">
        <div className="mb-4">
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <Input
              type="text"
              name="name"
              value={editableUser.name}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
            />
          ) : (
            user.name
          )}
        </div>
        <div className="mb-4">
          <strong>Email:</strong>{" "}
          {isEditing ? (
            <Input
              type="email"
              name="email"
              value={editableUser.email}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
              disabled
            />
          ) : (
            user.email
          )}
        </div>
        <div className="mb-4">
          <strong>Phone:</strong>{" "}
          {isEditing ? (
            <Input
              type="text"
              name="phone"
              value={editableUser.phone}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
            />
          ) : (
            user.phone
          )}
        </div>
        <div className="mb-4">
          <strong>Wallet Balance:</strong>{" "}
          {editableUser.walletAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
        <div className="mb-4">
          <strong>Role:</strong> {user.role.roleName}
        </div>
        <Form.Item>
          {isEditing ? (
            <Button
              type="primary"
              onClick={handleSave}
              className="bg-green-500"
            >
              Save
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500"
            >
              Edit
            </Button>
          )}
        </Form.Item>
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4">Orders</h3>
      <Table columns={columns} dataSource={orders} rowKey="orderId" />
    </div>
  );
};

export default Profile;
