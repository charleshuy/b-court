import { useEffect, useState } from "react";
import UserAPI from "../api/UserAPI";
import OrderAPI from "../api/OrderAPI";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);

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
      } catch (error) {
        console.error("Failed to fetch user or orders:", error);
      }
    };

    fetchUser();
  }, []);

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
      message.error("Failed to Update.");
      console.error("Failed to update user:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold mb-4">Profile</h2>
        <div className="mb-4">
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
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
            <input
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
            <input
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
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}

        <h3 className="text-2xl font-semibold mt-8 mb-4">Orders</h3>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Order ID</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Court</th>
                  <th className="py-2 px-4 border-b">Slot</th>
                  <th className="py-2 px-4 border-b">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="py-2 px-4 border-b">{order.orderId}</td>
                    <td className="py-2 px-4 border-b">{order.date}</td>
                    <td className="py-2 px-4 border-b">
                      {order.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td className="py-2 px-4 border-b">{order.courtName}</td>
                    <td className="py-2 px-4 border-b">{`${
                      order.slotStart.split(":")[0]
                    }:00 - ${order.slotEnd.split(":")[0]}:00
                     ${order.bookingDate}`}</td>
                    <td className="py-2 px-4 border-b">
                      {order.methodMethodName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No orders found</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
