import { useState } from "react";
import { Table, Button, Modal, Image } from "antd";

const ApproveCourt = () => {
  const [courts, setCourts] = useState([
    {
      key: "1",
      image: "https://via.placeholder.com/100",
      username: "john_doe",
      courtName: "Court A",
      location: "123 Main St",
      price: "50",
    },
    // Thêm các dữ liệu khác tại đây
  ]);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (court) => {
    setSelectedCourt(court);
    setIsModalVisible(true);
  };

  const handleApprove = () => {
    setCourts(courts.filter((court) => court.key !== selectedCourt.key));
    setIsModalVisible(false);
  };

  const handleReject = () => {
    setCourts(courts.filter((court) => court.key !== selectedCourt.key));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Approve Court</h2>
      <Table columns={columns} dataSource={courts} />
      <Modal
        title="Review Court"
        visible={isModalVisible}
        onOk={handleApprove}
        onCancel={handleCancel}
        footer={[
          <Button key="reject" type="danger" onClick={handleReject}>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>
            Approve
          </Button>,
        ]}
      >
        {selectedCourt && (
          <div>
            <Image width={100} src={selectedCourt.image} />
            <p>
              <strong>Username:</strong> {selectedCourt.username}
            </p>
            <p>
              <strong>Court Name:</strong> {selectedCourt.courtName}
            </p>
            <p>
              <strong>Location:</strong> {selectedCourt.location}
            </p>
            <p>
              <strong>Price:</strong> {selectedCourt.price}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApproveCourt;
