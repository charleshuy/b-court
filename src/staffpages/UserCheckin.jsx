import React, { useState, useEffect } from "react";
import { Table, Button, Select, Spin, message, Modal, DatePicker } from "antd";
import OrderAPI from "../api/OrderAPI";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;

const UserCheckIn = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [refundConfirmVisible, setRefundConfirmVisible] = useState(false); // State for refund confirmation modal
  const [refundOrderId, setRefundOrderId] = useState(null); // State to store orderId for refund
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const fetchOrdersByCourtId = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await OrderAPI.getOrdersByCourtId(
          decodedToken.assignedCourt
        );
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders); // Set both orders and filteredOrders initially
      } catch (error) {
        console.error("Error fetching orders by courtId:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByCourtId();
  }, []);

  useEffect(() => {
    // Filter orders based on selectedDate
    if (selectedDate) {
      const filtered = orders.filter(
        (order) => order.bookingDate === selectedDate
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // Reset filteredOrders to all orders if no date selected
    }
  }, [selectedDate, orders]);

  const handleStatusChange = async (key, value) => {
    try {
      setLoading(true);
      // Update status via API
      const updatedStatus = getStatusFromValue(value);
      await OrderAPI.updateOrder(key, { status: updatedStatus });

      // Optimistically update UI
      const updatedOrders = orders.map((order) =>
        order.orderId === key ? { ...order, status: updatedStatus } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders); // Update filteredOrders as well

      // Display success message
      message.success(
        `Order status updated to ${getStatusDisplay(updatedStatus)}`
      );

      // Log the updated object
      console.log(
        "Updated Object:",
        updatedOrders.find((order) => order.orderId === key)
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // Display error message
      message.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key) => {
    try {
      setLoading(true);
      await OrderAPI.deleteOrderById(key);
      const updatedOrders = orders.filter((order) => order.orderId !== key);
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders); // Update filteredOrders as well
      setDeleteModalVisible(false); // Close the delete confirmation modal
      message.success("Order deleted successfully");
    } catch (error) {
      message.error("Failed to delete order");
      console.error("Error deleting order:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId) => {
    try {
      setLoading(true);
      await OrderAPI.refundForEWalletOrder(orderId);
      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, status: false } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders); // Update filteredOrders as well
      message.success("Order refunded successfully");
    } catch (error) {
      message.error("Failed to refund order");
      console.error("Error refunding order:", error);
      // Handle error
    } finally {
      setLoading(false);
      setRefundConfirmVisible(false); // Close refund confirmation modal after refund
    }
  };

  const getStatusFromValue = (value) => {
    switch (value) {
      case "Pending":
        return null;
      case "Confirmed":
        return true;
      case "Cancelled":
        return false;
      default:
        return null;
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case null:
        return "Pending";
      case true:
        return "Confirmed";
      case false:
        return "Cancelled";
      default:
        return "";
    }
  };

  const showDeleteModal = (orderId) => {
    setDeletingOrderId(orderId);
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingOrderId(null);
  };

  const handleDatePickerChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const showRefundConfirmModal = (orderId) => {
    setRefundOrderId(orderId);
    setRefundConfirmVisible(true);
  };

  const handleConfirmRefund = () => {
    handleRefund(refundOrderId);
  };

  const handleCancelRefund = () => {
    setRefundConfirmVisible(false);
    setRefundOrderId(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Phone",
      dataIndex: "userPhone",
      key: "userPhone",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
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
      title: "Date",
      dataIndex: "bookingDate",
      key: "date",
    },
    {
      title: "Court",
      dataIndex: "courtName",
      key: "court",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={getStatusDisplay(record.status)}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.orderId, value)}
          disabled={loading}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => `${record.amount.toFixed(0)}d`,
    },
    {
      title: "Payment",
      dataIndex: "methodMethodName",
      key: "methodMethodName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          {record.status === null && record.methodMethodName === "E-Wallet" && (
            // Render refund button only when status is 'Pending' and method is 'E-Wallet'
            <Button
              type="primary"
              onClick={() => showRefundConfirmModal(record.orderId)}
              className="mr-2"
              disabled={loading}
            >
              Refund
            </Button>
          )}
          <Button
            type="danger"
            onClick={() => showDeleteModal(record.orderId)}
            className="ml-2"
            disabled={loading}
          >
            Delete
          </Button>
          <Modal
            title="Confirm Delete"
            visible={deleteModalVisible}
            onOk={() => handleDelete(deletingOrderId)}
            onCancel={handleCancelDelete}
            okText="Delete"
            cancelText="Cancel"
          >
            <p>Are you sure you want to delete this order?</p>
          </Modal>
          <Modal
            title="Confirm Refund"
            visible={refundConfirmVisible}
            onOk={handleConfirmRefund}
            onCancel={handleCancelRefund}
            okText="Refund"
            cancelText="Cancel"
          >
            <p>Are you sure you want to refund this order?</p>
          </Modal>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Check in</h2>
      <DatePicker onChange={handleDatePickerChange} />
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredOrders} />
      </Spin>
    </div>
  );
};

export default UserCheckIn;
