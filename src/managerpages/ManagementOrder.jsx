import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Tooltip } from "antd";
import OrderAPI from "../api/OrderAPI"; // Make sure to import your OrderAPI
import moment from "moment"; // Import moment for time formatting
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const Order = () => {
  const { courtId } = useParams(); // Get courtId from URL params
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getOrdersByCourtId(courtId);
        setOrders(
          fetchedOrders.map((order) => ({ ...order, key: order.orderId }))
        ); // Ensure each order has a key
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [courtId]);

  const formatTime = (time) => {
    return moment(time, "HH:mm").format("HH:mm");
  };

  const getStatusText = (status) => {
    if (status === null) return "Pending";
    return status ? "Confirmed" : "Cancelled";
  };

  const renderTruncatedId = (id) => {
    const truncatedId = `${id.substring(0, 8)}....`;
    return (
      <Tooltip title={id}>
        <span>{truncatedId}</span>
      </Tooltip>
    );
  };

  const formatDailyOrdersData = () => {
    const orderCountsByDate = {};
    orders.forEach((order) => {
      const orderDate = moment(order.bookingDate, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      if (orderCountsByDate[orderDate]) {
        orderCountsByDate[orderDate] += 1;
      } else {
        orderCountsByDate[orderDate] = 1;
      }
    });

    const data = Object.keys(orderCountsByDate).map((date) => ({
      date,
      orders: orderCountsByDate[date],
    }));

    // Sort data by date
    data.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

    return data;
  };

  const dailyOrdersData = formatDailyOrdersData();

  const chartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`Date: ${label}`}</p>
          <p>{`Orders: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (_, record) => renderTruncatedId(record.orderId),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Slot",
      key: "timeSlot",
      render: (_, record) =>
        `${formatTime(record.slotStart)} - ${formatTime(record.slotEnd)}`,
    },
    {
      title: "Payment Method",
      dataIndex: "methodMethodName",
      key: "methodMethodName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (_, record) => renderTruncatedId(record.userId),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => getStatusText(record.status),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip content={chartTooltip} />
            <Bar dataKey="orders" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Table columns={columns} dataSource={orders} />
    </div>
  );
};

export default Order;
