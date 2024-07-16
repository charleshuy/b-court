import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CourtAPI from "../api/CourtAPI";
import LocationAPI from "../api/LocationAPI";
import FileAPI from "../api/FileAPI";
import { Tooltip } from "antd";
const { Option } = Select;
const { confirm } = Modal;

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

  const handleFileUpload = async (file, courtId) => {
    try {
      if (!courtId) {
        throw new Error("Court ID not available for file upload.");
      }

      const uploadResponse = await FileAPI.uploadFileCourt(courtId, file);

      // Handle the response as needed (e.g., update court image)
      message.success("File uploaded successfully");
      fetchInitialData(); // Update court data after successful upload
    } catch (error) {
      message.error("Failed to upload file.");
      console.error("Failed to upload file:", error);
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

  const handleDelete = (courtId) => {
    confirm({
      title: "Are you sure you want to delete this court?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteCourt(courtId);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const deleteCourt = async (courtId) => {
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
      dataIndex: "fileId",
      key: "fileId",
      render: (fileId, record) => (
        <div style={{ position: "relative", width: 50, height: 50 }}>
          {fileId ? (
            <>
              <img
                src={`http://localhost:8080/files/${fileId}`}
                alt="Court"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <Tooltip title="Change Image" placement="bottom">
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  onClick={() => {
                    // Trigger file upload dialog
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.onchange = (e) => {
                      const file = e.target.files[0];
                      handleFileUpload(file, record.courtId);
                    };
                    fileInput.click();
                  }}
                >
                  <UploadOutlined style={{ color: "#fff", fontSize: 18 }} />
                </div>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Upload Image" placement="bottom">
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  onClick={() => {
                    // Trigger file upload dialog
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.onchange = (e) => {
                      const file = e.target.files[0];
                      handleFileUpload(file, record.courtId);
                    };
                    fileInput.click();
                  }}
                >
                  <UploadOutlined style={{ color: "#fff", fontSize: 18 }} />
                </div>
              </Tooltip>
            </>
          )}
        </div>
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
      title: "Approval",
      dataIndex: "approval",
      key: "approval",
      render: (approval) => {
        if (approval === null) {
          return <span>Pending</span>;
        } else if (approval) {
          return <span>Approved</span>;
        } else {
          return <span>Rejected</span>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4">
          <Link to={`manager/orders/${record.courtId}`}>
            <Button>View Orders</Button>
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
        title={editingCourt ? "Edit Court" : "Add Court"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {editingCourt !== null && (
          <Form layout="vertical">
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
