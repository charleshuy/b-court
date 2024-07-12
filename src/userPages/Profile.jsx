import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Table,
  Modal,
  DatePicker,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import UserAPI from "../api/UserAPI";
import OrderAPI from "../api/OrderAPI";
import FileAPI from "../api/FileAPI";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
const { confirm } = Modal;

const Profile = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [imageUrl, setImageUrl] = useState("/path/to/default/avatar.jpg");
  const [selectedDate, setSelectedDate] = useState(null);

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

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // First confirmation
      confirm({
        title: "Are you sure you want to cancel this order?",
        icon: <ExclamationCircleOutlined />,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await OrderAPI.cancelOrder(orderId, userId);
            message.success("Order cancelled successfully");
            const updatedOrders = orders.map((order) =>
              order.orderId === orderId ? { ...order, status: false } : order
            );
            setOrders(updatedOrders);
            window.location.reload();
          } catch (error) {
            console.error("Failed to cancel order:", error);
            message.error("Failed to cancel order.");
          }
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } catch (error) {
      console.error("Failed to cancel order:", error);
      message.error("Failed to cancel order.");
    }
  };

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

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString); // Store selected date as a string
  };

  const getStatusText = (status) => {
    if (status === null) {
      return "Pending";
    } else if (status === true) {
      return "Confirmed";
    } else if (status === false) {
      return "Canceled";
    } else {
      return "Unknown";
    }
  };

  const filteredOrders = selectedDate
    ? orders.filter((order) => order.bookingDate === selectedDate)
    : orders;

  const columns = [
    { title: "Date", dataIndex: "bookingDate", key: "date" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => text + "VND",
    },
    {
      title: "Court",
      dataIndex: "courtName",
      key: "courtName",
      render: (courtName, record) => (
        <Link to={`/court-detail/${record.courtId}`}>{courtName}</Link>
      ),
    },
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
      render: (_, record) =>
        `${record.slotStart.split(":")[0]}:00 - ${
          record.slotEnd.split(":")[0]
        }:00`,
    },
    {
      title: "Payment Method",
      dataIndex: "methodMethodName",
      key: "methodMethodName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <span>{getStatusText(status)}</span>,
    },
    {
      title: "Actions",
      dataIndex: "status",
      key: "actions",
      render: (status, record) => {
        const bookingDate = new Date(record.bookingDate);
        const today = new Date();
        const oneDayAfterToday = new Date();
        oneDayAfterToday.setDate(today.getDate() + 1);

        // Check if status is null and bookingDate is after today minus 1 day
        if (status === null && bookingDate >= oneDayAfterToday) {
          return (
            <Button
              type="primary"
              onClick={() => handleCancelOrder(record.orderId)}
            >
              Cancel
            </Button>
          );
        } else {
          return null; // Return null for non-pending orders or past bookings
        }
      },
    },
    ,
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
          <strong>Ban Count:</strong>{" "}
          {isEditing ? (
            <Input
              type="text"
              name="phone"
              value={editableUser.banCount}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
              disabled
            />
          ) : (
            user.banCount
          )}
        </div>
        <div className="mb-4">
          <strong>Wallet Balance:</strong> {editableUser.walletAmount} VND
        </div>
        {user.role.roleName === "Manager" && (
          <div className="mb-4">
            <strong>Escrow Balance:</strong> {editableUser.refundWallet} VND
          </div>
        )}

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
      <DatePicker onChange={handleDateChange} />
      <Table columns={columns} dataSource={filteredOrders} rowKey="orderId" />
    </div>
  );
};

export default Profile;
