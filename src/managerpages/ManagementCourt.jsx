import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Option } = Select;

const ManagementCourt = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [courts, setCourts] = useState([
    {
      key: "1",
      image: "https://via.placeholder.com/150",
      courtName: "Court A",
      license: "Valid",
      location: "Location 1",
      price: "100",
      status: "Active",
    },
  ]);

  const showModal = (court) => {
    setEditingCourt(court);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);

    if (editingCourt.key) {
      const updatedCourts = courts.map((court) =>
        court.key === editingCourt.key ? editingCourt : court
      );
      setCourts(updatedCourts);
    } else {
      setCourts([...courts, { ...editingCourt, key: courts.length + 1 }]);
    }
    setEditingCourt(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourt(null);
  };

  const handleDelete = (key) => {
    setCourts(courts.filter((court) => court.key !== key));
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="Court" style={{ width: 50 }} />,
    },
    {
      title: "Court Name",
      dataIndex: "courtName",
      key: "courtName",
    },
    {
      title: "License",
      dataIndex: "license",
      key: "license",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4">
          <Link to="/manager/slots">
            <Button>View Slots</Button>
          </Link>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.key)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">Courts</h2>
        <Button
          type="primary"
          onClick={() => showModal({})}
          icon={<PlusOutlined />}
          className="mb-4"
        >
          Add Court
        </Button>
      </div>
      <Table columns={columns} dataSource={courts} />
      <Modal
        title={
          editingCourt && editingCourt.key ? "Edit Court" : "Request Add Court"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {editingCourt && (
          <Form layout="vertical">
            <Form.Item label="Image URL">
              <Input
                value={editingCourt.image}
                onChange={(e) =>
                  setEditingCourt({ ...editingCourt, image: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Court Name">
              <Input
                value={editingCourt.courtName}
                onChange={(e) =>
                  setEditingCourt({
                    ...editingCourt,
                    courtName: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="License">
              <Input
                value={editingCourt.license}
                onChange={(e) =>
                  setEditingCourt({ ...editingCourt, license: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Location">
              <Input
                value={editingCourt.location}
                onChange={(e) =>
                  setEditingCourt({
                    ...editingCourt,
                    location: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Price">
              <Input
                value={editingCourt.price}
                onChange={(e) =>
                  setEditingCourt({ ...editingCourt, price: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Status">
              <Select
                value={editingCourt.status}
                onChange={(value) =>
                  setEditingCourt({ ...editingCourt, status: value })
                }
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ManagementCourt;
