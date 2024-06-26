import { useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker } from "antd";
import moment from "moment";

const Order = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      key: "1",
      orderId: "12345",
      amount: "100",
      bookingDate: "2023-06-20",
      date: "2023-06-24",
      slotEnd: "18:00",
      slotStart: "16:00",
      courtId: "1",
      methodId: "2",
      userId: "3",
    },
    // Thêm các dữ liệu khác tại đây
  ]);

  const showModal = (order) => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // Logic cập nhật dữ liệu sau khi chỉnh sửa
    const updatedOrders = orders.map((order) =>
      order.key === editingOrder.key ? editingOrder : order
    );
    setOrders(updatedOrders);
    setEditingOrder(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingOrder(null);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Slot Start",
      dataIndex: "slotStart",
      key: "slotStart",
    },
    {
      title: "Slot End",
      dataIndex: "slotEnd",
      key: "slotEnd",
    },
    {
      title: "Court ID",
      dataIndex: "courtId",
      key: "courtId",
    },
    {
      title: "Method ID",
      dataIndex: "methodId",
      key: "methodId",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button type="primary" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            type="default"
            onClick={() => showModal(record)}
            className="ml-2"
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Orders</h2>
      <Table columns={columns} dataSource={orders} />
      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        {editingOrder && (
          <Form layout="vertical">
            <Form.Item label="Order ID">
              <Input value={editingOrder.orderId} readOnly />
            </Form.Item>
            <Form.Item label="Amount">
              <Input
                value={editingOrder.amount}
                onChange={(e) =>
                  setEditingOrder({ ...editingOrder, amount: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Booking Date">
              <DatePicker
                className="w-full"
                value={moment(editingOrder.bookingDate, "YYYY-MM-DD")}
                onChange={(date) =>
                  setEditingOrder({
                    ...editingOrder,
                    bookingDate: date.format("YYYY-MM-DD"),
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Date">
              <DatePicker
                className="w-full"
                value={moment(editingOrder.date, "YYYY-MM-DD")}
                onChange={(date) =>
                  setEditingOrder({
                    ...editingOrder,
                    date: date.format("YYYY-MM-DD"),
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Slot Start">
              <Input
                value={editingOrder.slotStart}
                onChange={(e) =>
                  setEditingOrder({
                    ...editingOrder,
                    slotStart: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Slot End">
              <Input
                value={editingOrder.slotEnd}
                onChange={(e) =>
                  setEditingOrder({ ...editingOrder, slotEnd: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Court ID">
              <Input
                value={editingOrder.courtId}
                onChange={(e) =>
                  setEditingOrder({ ...editingOrder, courtId: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Method ID">
              <Input
                value={editingOrder.methodId}
                onChange={(e) =>
                  setEditingOrder({ ...editingOrder, methodId: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="User ID">
              <Input
                value={editingOrder.userId}
                onChange={(e) =>
                  setEditingOrder({ ...editingOrder, userId: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Order;
