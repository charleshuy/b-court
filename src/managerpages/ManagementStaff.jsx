import { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ManagementStaff = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staff, setStaff] = useState([
    {
      key: "1",
      userId: "1",
      address: "123 Main St",
      email: "john@example.com",
      name: "John Doe",
      phone: "123-456-7890",
    },
  ]);

  const showModal = (staffMember) => {
    setEditingStaff(staffMember);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (editingStaff.key) {
      const updatedStaff = staff.map((s) =>
        s.key === editingStaff.key ? editingStaff : s
      );
      setStaff(updatedStaff);
    } else {
      setStaff([...staff, { ...editingStaff, key: staff.length + 1 }]);
    }
    setEditingStaff(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStaff(null);
  };

  const handleDelete = (key) => {
    setStaff(staff.filter((s) => s.key !== key));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
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
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <Button
          type="primary"
          onClick={() => showModal({})}
          icon={<PlusOutlined />}
        >
          Add Staff
        </Button>
      </div>
      <Table columns={columns} dataSource={staff} />
      <Modal
        title={editingStaff && editingStaff.key ? "Edit Staff" : "Add Staff"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {editingStaff && (
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                value={editingStaff.name}
                onChange={(e) =>
                  setEditingStaff({ ...editingStaff, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                value={editingStaff.address}
                onChange={(e) =>
                  setEditingStaff({ ...editingStaff, address: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                value={editingStaff.email}
                onChange={(e) =>
                  setEditingStaff({ ...editingStaff, email: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item label="Phone">
              <Input
                value={editingStaff.phone}
                onChange={(e) =>
                  setEditingStaff({ ...editingStaff, phone: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ManagementStaff;
