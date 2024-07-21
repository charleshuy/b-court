import { useState, useEffect } from "react";
import { Table, Button, message, Input, Modal, Form, Select } from "antd";
import UserAPI from "../api/UserAPI";
import RoleAPI from "../api/RoleAPI";

const { Option } = Select;

const ManagementUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form] = Form.useForm();
  const [isCreatingUser, setIsCreatingUser] = useState(false); // Track if creating a new user
  const [userToDelete, setUserToDelete] = useState(null); // Track user to delete
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Control delete confirmation modal visibility
  const [managerSearchTerm, setManagerSearchTerm] = useState("");
  const filteredManagers = managers.filter((manager) =>
    manager.email.toLowerCase().includes(managerSearchTerm.toLowerCase())
  );
  const fetchUsers = async (page, size) => {
    try {
      const response = await UserAPI.getAllUsers(page - 1, size);
      console.log("API Response:", response);

      if (response && response.content) {
        setUsers(response.content);
        setFilteredUsers(response.content);
        setPagination({
          current: response.number + 1,
          pageSize: response.size,
          total: response.totalElements,
        });
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await RoleAPI.getAllRoles();
      setRoles(rolesData.content);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const managersData = await UserAPI.getUsersByRoleName("Manager");
      console.log("API manager Response:", managersData);
      setManagers(managersData.content); // Update managers state with fetched data
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
    fetchRoles(); // Assuming initial page and size
    fetchManagers();
  }, []);

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const handleDelete = async (userId) => {
    try {
      await UserAPI.deleteUserById(userId);
      fetchUsers(pagination.current, pagination.pageSize);
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user");
    } finally {
      setUserToDelete(null); // Clear userToDelete after deletion
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredData = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setIsCreatingUser(false); // Not creating new user when editing
    setIsModalVisible(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null); // Clear selectedUser for creating new user
    form.resetFields(); // Reset form fields
    setIsCreatingUser(true); // Set flag to indicate creating new user
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const roleId = values.role.roleId; // Extract roleId from selected role

      // Check if roleId is 4 to set manager to null
      const manager =
        roleId !== "4"
          ? null
          : values.managerId
          ? {
              userId: values.managerId,
              role: {
                roleId: "3", // Assuming manager role ID is available
              },
            }
          : null;

      const updatedUser = { ...selectedUser, ...values, roleId, manager };
      console.log("Updating User:", updatedUser); // Log the object being sent

      await UserAPI.updateUser(updatedUser);
      setIsModalVisible(false);
      fetchUsers(pagination.current, pagination.pageSize);
      message.success("User updated successfully");
    } catch (error) {
      console.error("Failed to update user:", error);
      message.error("Failed to update user");
    }
  };

  const handleCreate = async (values) => {
    try {
      const roleId = values.role.roleId; // Extract roleId from selected role

      // Check if values.managerId is not empty before assigning manager
      const manager = values.managerId
        ? {
            userId: values.managerId,
            role: {
              roleId: "3", // Assuming manager role ID is available
            },
          }
        : null;

      await UserAPI.createUser({
        ...values,
        roleId,
        manager,
        password: values.password,
      });
      setIsModalVisible(false);
      fetchUsers(pagination.current, pagination.pageSize);
      console.log("Created user:", values); // Log the created user object
      message.success("User created successfully");
    } catch (error) {
      console.error("Failed to create user:", error);
      console.log("Created user:", values); // Log the created user object
      message.error("Failed to create user");
    }
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
      title: "Wallet Amount",
      dataIndex: "walletAmount",
      key: "walletAmount",
    },
    {
      title: "Role",
      dataIndex: ["role", "roleName"],
      key: "roleName",
    },
    {
      title: "Manager",
      dataIndex: "managerName",
      key: "managerName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            type="danger"
            onClick={() => {
              setUserToDelete(record);
              setIsDeleteModalVisible(true);
            }}
            className="ml-2"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleConfirmDelete = () => {
    if (userToDelete) {
      handleDelete(userToDelete.userId);
    }
    setIsDeleteModalVisible(false); // Close delete confirmation modal
  };

  // Function to handle role change in the modal
  const handleRoleChange = (value) => {
    if (value === "4") {
      // Assuming "1" is the roleId for "Staff"
      fetchManagers(); // Fetch managers if role is Staff
    } else {
      setManagers([]); // Clear managers if role is not Staff
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Management User</h2>
      <Button
        type="primary"
        onClick={handleCreateUser}
        style={{ marginBottom: 16 }}
      >
        Add User
      </Button>
      <Input
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredUsers}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={isCreatingUser ? "Create User" : "Edit User"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isCreatingUser ? handleCreate : handleUpdate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter the phone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="walletAmount"
            label="Wallet Amount"
            rules={[
              { required: true, message: "Please enter the wallet amount" },
            ]}
          >
            <Input />
          </Form.Item>
          {isCreatingUser && ( // Only show password field when creating user
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter the password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name={["role", "roleId"]} // Use roleId instead of roleName
            label="Role"
            rules={[{ required: true, message: "Please select the role" }]}
          >
            <Select onChange={handleRoleChange}>
              {roles.map((role) => (
                <Option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {roles.find((role) => role.roleId === "1") && ( // Only show manager selection for Staff role
            <Form.Item
              name="managerId"
              label="Manager"
              rules={[{ required: false, message: "Please select a manager" }]}
            >
              <Select
                disabled={form.getFieldValue(["role", "roleId"]) !== "4"}
                allowClear
              >
                {filteredManagers.map((manager) => (
                  <Option key={manager.userId} value={manager.userId}>
                    {manager.email} - {manager.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item label="Search Manager">
            <Input
              placeholder="Search by email"
              value={managerSearchTerm}
              onChange={(e) => setManagerSearchTerm(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleConfirmDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default ManagementUser;
