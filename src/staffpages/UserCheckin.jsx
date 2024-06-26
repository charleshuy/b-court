import { useState } from "react";
import { Table, Button, Modal, Form, Select } from "antd";

const { Option } = Select;

const UserCheckIn = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCheckIn, setEditingCheckIn] = useState(null);
  const [checkIns, setCheckIns] = useState([
    {
      key: "1",
      name: "John Doe",
      phone: "123-456-7890",
      email: "john@example.com",
      timeSlot: "9:00 - 10:00",
      date: "24-06-2023",
      court: "Court 1",
      status: "Pending",
      amount: "100",
    },
  ]);

  const showModal = (checkIn) => {
    setEditingCheckIn(checkIn);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (editingCheckIn.key) {
      const updatedCheckIns = checkIns.map((c) =>
        c.key === editingCheckIn.key ? editingCheckIn : c
      );
      setCheckIns(updatedCheckIns);
    }
    setEditingCheckIn(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCheckIn(null);
  };

  const handleDelete = (key) => {
    setCheckIns(checkIns.filter((c) => c.key !== key));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Time Slot",
      dataIndex: "timeSlot",
      key: "timeSlot",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Court",
      dataIndex: "court",
      key: "court",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
            type="danger"
            onClick={() => handleDelete(record.key)}
            className="ml-2"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Check in</h2>
      <Table columns={columns} dataSource={checkIns} />
      <Modal
        title={
          editingCheckIn && editingCheckIn.key
            ? "Edit Check-In Status"
            : "Add Check-In"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {editingCheckIn && (
          <Form layout="vertical">
            <Form.Item label="Status">
              <Select
                value={editingCheckIn.status}
                onChange={(value) =>
                  setEditingCheckIn({ ...editingCheckIn, status: value })
                }
              >
                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default UserCheckIn;
