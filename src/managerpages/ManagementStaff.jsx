import { useState, useEffect } from "react";
import { Table, Button, Select, Form, message } from "antd"; // Import message from antd
import { PlusOutlined } from "@ant-design/icons";
import UserAPI from "../api/UserAPI";
import CourtAPI from "../api/CourtAPI";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;

const ManagementStaff = () => {
  const [staff, setStaff] = useState([]);
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const managerId = decodedToken.userId;

    const fetchUsersByManagerId = async () => {
      try {
        const response = await UserAPI.getUsersByManagerId(managerId);
        setStaff(response.content);
      } catch (error) {
        console.error("Error fetching users by managerId:", error);
      }
    };

    const fetchCourtsByManagerId = async () => {
      try {
        const response = await CourtAPI.getCourtsByUserId(managerId);
        setCourts(response);
      } catch (error) {
        console.error("Error fetching courts by managerId:", error);
      }
    };

    fetchUsersByManagerId();
    fetchCourtsByManagerId();
  }, []);

  const handleSaveAssignedCourt = async (userId, courtId) => {
    try {
      const updatedUser = {
        userId: userId,
        assignedCourt: {
          courtId: courtId,
        },
      };
      await UserAPI.updateUser(updatedUser);
      // Update staff state or handle success
      const updatedStaff = staff.map((user) =>
        user.userId === userId ? { ...user, courtId: courtId } : user
      );
      setStaff(updatedStaff);
      message.success("Assigned court saved successfully"); // Success message
      console.log("Updated User:", updatedUser); // Log the updated user object
    } catch (error) {
      console.error("Error updating assigned court:", error);
      message.error("Failed to save assigned court"); // Error message
      // Handle error
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
      title: "Assigned Court Name",
      key: "assignedCourtName",
      render: (text, record) => (
        <Form
          onFinish={(values) =>
            handleSaveAssignedCourt(record.userId, values.assignedCourtId)
          }
          initialValues={{ assignedCourtId: record.assignedCourtId }}
        >
          <Form.Item name="assignedCourtId" noStyle>
            <Select
              onChange={(value) =>
                handleSaveAssignedCourt(record.userId, value)
              }
            >
              {courts.map((court) => (
                <Option key={court.courtId} value={court.courtId}>
                  {court.courtName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">Staff Management</h2>
      </div>
      <Table columns={columns} dataSource={staff} />
    </div>
  );
};

export default ManagementStaff;
