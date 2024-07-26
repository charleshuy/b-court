import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Spin,
  message,
  Modal,
  DatePicker,
  Input,
} from "antd";
import OrderAPI from "../api/OrderAPI";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const { Option } = Select;
const { Search } = Input;

const UserCheckIn = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [emailSearch, setEmailSearch] = useState(""); // State for email search
  const [refundConfirmVisible, setRefundConfirmVisible] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState(null);
  const [checkInConfirmVisible, setCheckInConfirmVisible] = useState(false);
  const [checkInOrderId, setCheckInOrderId] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByCourtId();
  }, []);

  useEffect(() => {
    // Filter orders based on selectedDate and email search
    let filtered = orders;
    if (selectedDate) {
      filtered = filtered.filter((order) => order.bookingDate === selectedDate);
    }
    if (emailSearch) {
      filtered = filtered.filter((order) =>
        order.userEmail.toLowerCase().includes(emailSearch.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  }, [selectedDate, emailSearch, orders]);

  const handleStatusChange = async (key, value) => {
    try {
      setLoading(true);
      const updatedStatus = getStatusFromValue(value);
      await OrderAPI.updateOrder(key, { status: updatedStatus });

      const updatedOrders = orders.map((order) =>
        order.orderId === key ? { ...order, status: updatedStatus } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);

      message.success(
        `Order status updated to ${getStatusDisplay(updatedStatus)}`
      );
      console.log(
        "Updated Object:",
        updatedOrders.find((order) => order.orderId === key)
      );
    } catch (error) {
      console.error("Error updating status:", error);
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
      setFilteredOrders(updatedOrders);
      setDeleteModalVisible(false);
      message.success("Order deleted successfully");
    } catch (error) {
      message.error("Failed to delete order");
      console.error("Error deleting order:", error);
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
      setFilteredOrders(updatedOrders);
      message.success("Order refunded successfully");
    } catch (error) {
      message.error("Failed to refund order");
      console.error("Error refunding order:", error);
    } finally {
      setLoading(false);
      setRefundConfirmVisible(false);
    }
  };

  const handleCheckIn = async (orderId) => {
    try {
      setLoading(true);
      await OrderAPI.updateOrder(orderId, { status: true });
      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, status: true } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      message.success("Order checked in successfully");
    } catch (error) {
      message.error("Failed to check in order");
      console.error("Error checking in order:", error);
    } finally {
      setLoading(false);
      setCheckInConfirmVisible(false);
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

  const showCheckInConfirmModal = (orderId) => {
    setCheckInOrderId(orderId);
    setCheckInConfirmVisible(true);
  };

  const handleConfirmCheckIn = () => {
    handleCheckIn(checkInOrderId);
  };

  const handleCancelCheckIn = () => {
    setCheckInConfirmVisible(false);
    setCheckInOrderId(null);
  };

  const handleEmailSearchChange = (e) => {
    setEmailSearch(e.target.value);
  };

  const getTodayDate = () => {
    return moment().format("YYYY-MM-DD");
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
      title: "Check In",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Button
          type={record.status === true ? "default" : "primary"}
          onClick={() => showCheckInConfirmModal(record.orderId)}
          disabled={
            loading ||
            record.status === true ||
            record.status === false ||
            record.bookingDate !== getTodayDate() // Disable if bookingDate is not today
          }
        >
          {record.status === true ? "Checked In" : "Check In"}
        </Button>
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
            <Button
              type="primary"
              onClick={() => showRefundConfirmModal(record.orderId)}
              className="mr-2"
              disabled={loading}
            >
              Refund
            </Button>
          )}

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
          <Modal
            title="Confirm Check In"
            visible={checkInConfirmVisible}
            onOk={handleConfirmCheckIn}
            onCancel={handleCancelCheckIn}
            okText="Check In"
            cancelText="Cancel"
          >
            <p>Are you sure you want to check in this order?</p>
          </Modal>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Check in</h2>
      <DatePicker onChange={handleDatePickerChange} />
      <Search
        placeholder="Search by email"
        onChange={handleEmailSearchChange}
        style={{ width: 300, marginLeft: 10 }}
      />
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredOrders} />
      </Spin>
    </div>
  );
};

export default UserCheckIn;
