import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import OrderAPI from "../api/OrderAPI";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderAPI.getOrders();
        setOrders(
          fetchedOrders.map((order) => ({ ...order, key: order.orderId }))
        ); // Ensure each order has a key
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const formatDailyOrdersData = () => {
    const orderCountsByDate = {};
    const orderAmountsByDate = {};

    orders.forEach((order) => {
      const orderDate = moment(order.date, "YYYY-MM-DD").format("YYYY-MM-DD");
      if (orderCountsByDate[orderDate]) {
        orderCountsByDate[orderDate] += 1;
        orderAmountsByDate[orderDate] += order.amount;
      } else {
        orderCountsByDate[orderDate] = 1;
        orderAmountsByDate[orderDate] = order.amount;
      }
    });

    const countData = Object.keys(orderCountsByDate).map((date) => ({
      date,
      orders: orderCountsByDate[date],
    }));

    const amountData = Object.keys(orderAmountsByDate).map((date) => ({
      date,
      amount: orderAmountsByDate[date],
    }));

    // Sort data by date
    countData.sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );
    amountData.sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );

    return { countData, amountData };
  };

  const { countData, amountData } = formatDailyOrdersData();

  const chartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`Date: ${label}`}</p>
          <p>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={countData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip content={chartTooltip} />
              <Line type="monotone" dataKey="orders" stroke="#1890ff" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <h3>Order Count</h3>
          </div>
        </div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={amountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip content={chartTooltip} />
              <Line type="monotone" dataKey="amount" stroke="#ff4d4f" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <h3>Order Amount</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
