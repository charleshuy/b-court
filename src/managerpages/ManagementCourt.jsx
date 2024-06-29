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
  const [editingCourt, setEditingCourt] = useState(null);
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

  const fetchDistricts = async (cityId) => {
    try {
      const districtsData = await LocationAPI.getDistrictsByCityId(cityId);
      setDistricts(districtsData);
    } catch (error) {
      message.error("Failed to fetch districts");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showModal = (court) => {
    if (court) {
      setEditingCourt(court);
      fetchDistricts(court.district.city.cityId);
    } else {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      setEditingCourt({
        courtImg: "",
        courtName: "",
        license: "",
        address: "",
        district: {
          districtId: "",
          districtName: "",
          city: {
            cityId: "",
            cityName: "",
          },
        },
        price: "",
        status: false,
        user: { userId },
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const courtData = { ...editingCourt };

      if (editingCourt && editingCourt.courtId) {
        await CourtAPI.updateCourt(editingCourt.courtId, courtData);
        message.success("Court updated successfully");
      } else {
        await CourtAPI.createCourt(courtData);
        message.success("Court added successfully");
      }
      setIsModalVisible(false);
      setEditingCourt(null);
      fetchInitialData();
    } catch (error) {
      message.error("Failed to save court");
      console.error("Failed to save court:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourt(null);
  };

  const handleDelete = async (courtId) => {
    try {
      await CourtAPI.deleteCourt(courtId);
      setCourts(courts.filter((court) => court.courtId !== courtId));
      message.success("Court deleted successfully");
    } catch (error) {
      message.error("Failed to delete court");
      console.error("Failed to delete court:", error);
    }
  };

  const handleCityChange = (cityId) => {
    const city = cities.find((c) => c.cityId === cityId);
    setEditingCourt((prevCourt) => ({
      ...prevCourt,
      district: {
        ...prevCourt.district,
        city: city || { cityId: "", cityName: "" },
      },
    }));
    fetchDistricts(cityId);
  };

  const handleDistrictChange = (districtId) => {
    const district = districts.find((d) => d.districtId === districtId);
    setEditingCourt((prevCourt) => ({
      ...prevCourt,
      district: district || {
        districtId: "",
        districtName: "",
        city: prevCourt.district.city,
      },
    }));
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "courtImg",
      key: "courtImg",
      render: (text) => (
        <img
          src={`http://localhost:5173/${text}`}
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
      key: "location",
      render: (record) =>
        `${record.address}, ${record.district.districtName}, ${record.district.city.cityName}`,
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
          <Button onClick={() => handleDelete(record.courtId)}>Delete</Button>
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
          onClick={() => showModal(null)}
          icon={<PlusOutlined />}
          className="mb-4"
        >
          Add Court
        </Button>
      </div>
      <Table columns={columns} dataSource={courts} rowKey="courtId" />
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
                value={editingCourt.address}
                onChange={(e) =>
                  setEditingCourt({
                    ...editingCourt,
                    address: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="City">
              <Select
                value={editingCourt.district.city.cityId}
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
                value={editingCourt.district.districtId}
                onChange={handleDistrictChange}
                disabled={!editingCourt.district.city.cityId}
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
