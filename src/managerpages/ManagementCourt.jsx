import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CourtAPI from "../api/CourtAPI";
import LocationAPI from "../api/LocationAPI";

const { Option } = Select;

const ManagementCourt = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null); // Use null for new court
  const [courts, setCourts] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("User not logged in");
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const [courtsData, citiesData] = await Promise.all([
        CourtAPI.getCourtsByUserId(userId),
        LocationAPI.getAllCities(),
      ]);

      setCourts(courtsData);
      setCities(citiesData);
    } catch (error) {
      message.error("Failed to fetch initial data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchDistricts = async (cityId) => {
    try {
      const districtsData = await LocationAPI.getDistrictsByCityId(cityId);
      setDistricts(districtsData);
    } catch (error) {
      message.error("Failed to fetch districts");
      console.error(error);
    }
  };

  const showModal = (court) => {
    if (court) {
      // If editing existing court
      setEditingCourt({ ...court, courtId: court.courtId });
      fetchDistricts(court.location.district.city.cityId);
    } else {
      // If adding new court
      setEditingCourt({
        courtImg: "",
        courtName: "",
        license: "",
        location: {
          address: "",
          district: {
            districtName: "",
            districtId: "",
            city: {
              cityName: "",
              cityId: "",
            },
          },
        },
        price: "",
        status: false, // Assuming default status is inactive
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      if (editingCourt && editingCourt.key) {
        // Update existing court
        await CourtAPI.updateCourt(editingCourt.courtId, editingCourt);
        message.success("Court updated successfully");
      } else {
        // Add new court
        await CourtAPI.createCourt(editingCourt);
        message.success("Court added successfully");
      }
      setIsModalVisible(false);
      setEditingCourt(null);
      fetchInitialData(); // Fetch the updated list of courts
    } catch (error) {
      message.error("Failed to save court");
      console.error("Failed to save court:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourt(null);
  };

  const handleDelete = (key) => {
    setCourts(courts.filter((court) => court.key !== key));
  };

  const handleCityChange = (cityId) => {
    setEditingCourt({
      ...editingCourt,
      location: {
        ...editingCourt.location,
        district: {
          ...editingCourt.location.district,
          city: cities.find((city) => city.cityId === cityId),
        },
      },
    });
    fetchDistricts(cityId);
  };

  const handleDistrictChange = (districtId) => {
    const selectedDistrict = districts.find(
      (district) => district.districtId === districtId
    );
    setEditingCourt({
      ...editingCourt,
      location: {
        ...editingCourt.location,
        district: selectedDistrict,
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "courtImg",
      key: "courtImg",
      render: (text) => (
        <img
          src={"http://localhost:5173/" + text}
          alt="Court"
          style={{ width: 50 }}
        />
      ),
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
                value={editingCourt.courtImg}
                onChange={(e) =>
                  setEditingCourt({ ...editingCourt, courtImg: e.target.value })
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
            <Form.Item label="City">
              <Select
                value={editingCourt.location.district.city.cityId}
                onChange={handleCityChange}
              >
                {cities.map((city) => (
                  <Option key={city.cityId} value={city.cityId}>
                    {city.cityName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="District">
              <Select
                value={editingCourt.location.district.districtId}
                onChange={handleDistrictChange}
              >
                {districts.map((district) => (
                  <Option key={district.districtId} value={district.districtId}>
                    {district.districtName}
                  </Option>
                ))}
              </Select>
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
