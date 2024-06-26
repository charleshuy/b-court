import { useState } from "react";
import { Table, Button } from "antd";

const ManagementUser = () => {
  const [users, setUsers] = useState([
    {
      key: "1",

      address: "123 Main St",
      email: "john@example.com",
      name: "John Doe",
      phone: "123-456-7890",
      walletAmount: "100",
      role: "Staff",
    },
  ]);

  const handleDelete = (key) => {
    setUsers(users.filter((u) => u.key !== key));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Wallet Amount",
      dataIndex: "walletAmount",
      key: "walletAmount",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
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
      <h2 className="text-2xl font-bold p-4">Management User</h2>
      <Table columns={columns} dataSource={users} />
    </div>
  );
};

export default ManagementUser;
