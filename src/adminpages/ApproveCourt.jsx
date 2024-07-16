import { useState, useEffect } from "react";
import { Table, Image, message, Select, Button, Input, Modal } from "antd";
import CourtAPI from "../api/CourtAPI";

const { Option } = Select;

const ApproveCourt = () => {
  const [courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [usernameSearch, setUsernameSearch] = useState("");
  const [courtNameSearch, setCourtNameSearch] = useState("");
  const [courtToDelete, setCourtToDelete] = useState(null); // Track court to delete
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Control delete confirmation modal visibility

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const courtsData = await CourtAPI.getCourtsAdmin();
        const mappedCourts = courtsData.map((court) => ({
          key: court.courtId,
          image: `http://localhost:8080/files/${court.fileId}`, // Adjust the URL as needed
          username: court.user.name,
          courtName: court.courtName,
          location: `${court.address}, ${court.district.districtName}, ${court.district.city.cityName}`,
          price: court.price,
          approval: court.approval,
        }));
        setCourts(mappedCourts);
        setFilteredCourts(mappedCourts);
      } catch (error) {
        message.error("Failed to fetch courts data.");
      }
    };

    fetchCourts();
  }, []);

  const handleApprovalChange = async (value, court) => {
    try {
      const updatedCourt = { ...court, approval: value };
      await CourtAPI.updateCourt(court.key, updatedCourt);
      setCourts((prevCourts) =>
        prevCourts.map((c) =>
          c.key === court.key ? { ...c, approval: value } : c
        )
      );
      message.success("Court approval status updated successfully.");
    } catch (error) {
      message.error("Failed to update court approval status.");
    }
  };

  const handleDelete = async (courtId) => {
    try {
      await CourtAPI.deleteCourt(courtId);
      setCourts((prevCourts) =>
        prevCourts.filter((court) => court.key !== courtId)
      );
      message.success("Court deleted successfully.");
    } catch (error) {
      message.error("Failed to delete court.");
    }
  };

  const handleConfirmDelete = () => {
    if (courtToDelete) {
      handleDelete(courtToDelete.key);
    }
    setIsDeleteModalVisible(false); // Close delete confirmation modal
  };

  useEffect(() => {
    let filtered = courts;

    if (filter === "Pending") {
      filtered = filtered.filter((court) => court.approval === null);
    }

    if (usernameSearch) {
      filtered = filtered.filter((court) =>
        court.username.toLowerCase().includes(usernameSearch.toLowerCase())
      );
    }

    if (courtNameSearch) {
      filtered = filtered.filter((court) =>
        court.courtName.toLowerCase().includes(courtNameSearch.toLowerCase())
      );
    }

    setFilteredCourts(filtered);
  }, [filter, usernameSearch, courtNameSearch, courts]);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <Image width={50} src={text} />,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
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
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Approval",
      dataIndex: "approval",
      key: "approval",
      render: (approval, court) => (
        <Select
          value={
            approval === null ? "Pending" : approval ? "Approved" : "Rejected"
          }
          onChange={(value) => handleApprovalChange(value, court)}
        >
          {approval === null && (
            <Option value="Pending" disabled>
              Pending
            </Option>
          )}
          <Option value={true}>Approved</Option>
          <Option value={false}>Rejected</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, court) => (
        <>
          <Button
            type="primary"
            danger
            onClick={() => {
              setCourtToDelete(court);
              setIsDeleteModalVisible(true);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Approve Court</h2>
      <div className="p-4 flex space-x-4">
        <Button
          type={filter === "All" ? "primary" : "default"}
          onClick={() => setFilter("All")}
        >
          All
        </Button>
        <Button
          type={filter === "Pending" ? "primary" : "default"}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </Button>
        <Input
          placeholder="Search by Username"
          value={usernameSearch}
          onChange={(e) => setUsernameSearch(e.target.value)}
        />
        <Input
          placeholder="Search by Court Name"
          value={courtNameSearch}
          onChange={(e) => setCourtNameSearch(e.target.value)}
        />
      </div>
      <Table columns={columns} dataSource={filteredCourts} />
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleConfirmDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this court?</p>
      </Modal>
    </div>
  );
};

export default ApproveCourt;
