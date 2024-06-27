import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CourtAPI from "../api/CourtAPI";

const { Option } = Select;

const ManagementCourt = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null); // Use null for new court
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("User not logged in");
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const courtsData = await CourtAPI.getCourtsByUserId(userId);
        setCourts(courtsData);
      } catch (error) {
        message.error("Failed to fetch courts");
        console.error(error);
      }
    };

    fetchCourts();
  }, []);

  const showModal = (court) => {
    if (court) {
      // If editing existing court
      setEditingCourt(court);
    } else {
      // If adding new court
      setEditingCourt({
        image: "",
        courtName: "",
        license: "",
        location: {
          address: "",
          district: {
            districtName: "",
            city: {
              cityName: "",
            },
          },
        },
        price: "",
        status: false, // Assuming default status is active
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);

    if (editingCourt && editingCourt.key) {
      const updatedCourts = courts.map((court) =>
        court.key === editingCourt.key ? editingCourt : court
      );
      setCourts(updatedCourts);
    } else {
      // Add new court
      const newCourt = { ...editingCourt, key: courts.length + 1 };
      setCourts([...courts, newCourt]);
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
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) =>
        `${location.address}, ${location.district.districtName}, ${location.district.city.cityName}`,
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
      render: (status) => <span>{status ? "Active" : "Inactive"}</span>,
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
          onClick={() => showModal(null)} // Null indicates adding new court
          icon={<PlusOutlined />}
          className="mb-4"
        >
          Add Court
        </Button>
      </div>
      <Table columns={columns} dataSource={courts} />
      <Modal
        title={editingCourt ? "Edit Court" : "Request Add Court"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {editingCourt !== null && (
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
            <Form.Item label="Address">
              <Input
                value={editingCourt.location.address}
                onChange={(e) =>
                  setEditingCourt({
                    ...editingCourt,
                    location: {
                      ...editingCourt.location,
                      address: e.target.value,
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="District">
              <Input
                value={editingCourt.location.district.districtName}
                onChange={(e) =>
                  setEditingCourt({
                    ...editingCourt,
                    location: {
                      ...editingCourt.location,
                      district: {
                        ...editingCourt.location.district,
                        districtName: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Item>
            <Form.Item label="City">
              <Input
                value={editingCourt.location.district.city.cityName}
                onChange={(e) =>
                  setEditingCourt({
                    ...editingCourt,
                    location: {
                      ...editingCourt.location,
                      district: {
                        ...editingCourt.location.district,
                        city: {
                          ...editingCourt.location.district.city,
                          cityName: e.target.value,
                        },
                      },
                    },
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
                value={editingCourt.status ? "Active" : "Inactive"}
                onChange={(value) =>
                  setEditingCourt({
                    ...editingCourt,
                    status: value === "Active",
                  })
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
