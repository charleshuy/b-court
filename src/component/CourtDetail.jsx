import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Select, DatePicker, Button, Rate, Modal, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import CourtAPI from "../api/CourtAPI";
import OrderAPI from "../api/OrderAPI";
import PaymentMethodAPI from "../api/PaymentMethodAPI";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const CourtDetail = () => {
  const [orderData, setOrderData] = useState({
    bookingDate: "",
    slotStart: "",
    slotEnd: "",
    user: {
      userId: "",
    },
    court: {
      courtId: "",
    },
    method: {
      methodId: "",
    },
  });
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    // Decode token and set userId to orderData
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setOrderData((prev) => ({
          ...prev,
          user: { userId: decodedToken.userId },
        }));
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const response = await CourtAPI.getCourts();
        const courtData = response.find((court) => court.courtId === id);
        setCourt(courtData);
        // Set courtId in orderData when courtData is fetched
        setOrderData((prev) => ({
          ...prev,
          court: { courtId: courtData.courtId },
        }));
      } catch (error) {
        console.error("Failed to fetch court details:", error);
      }
    };

    fetchCourt();
  }, [id]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await PaymentMethodAPI.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleDateChange = (date) => {
    const formattedDate = date.format("YYYY-MM-D");
    setSelectedDate(date);
    setOrderData((prev) => ({ ...prev, bookingDate: formattedDate }));
  };

  const handleTimeChange = (times) => {
    // Ensure times array is sorted chronologically
    times.sort((a, b) => {
      const timeA = moment(a, "HH:mm:ss");
      const timeB = moment(b, "HH:mm:ss");
      return timeA.diff(timeB);
    });

    if (times.length <= 2) {
      setSelectedTimes(times);
      setOrderData((prev) => ({
        ...prev,
        slotStart: times[0],
        slotEnd: times[times.length - 1],
      }));
    }
  };

  const getWeekDates = (weekOffset = 0) => {
    const now = new Date();
    const startOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 1 + 7 * weekOffset)
    );
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const handleBookNow = async () => {
    try {
      const response = await OrderAPI.createOrder(orderData);
      console.log("Order created successfully:", response);
      message.success("Order created successfully");
      setSuccessModalVisible(true); // Show success modal
    } catch (error) {
      console.error("Failed to create order:", error);
      message.error("Failed to create order. Please try again.");
      setErrorModalVisible(true); // Show error modal
    }
  };

  useEffect(() => {
    console.log("Updated orderData:", orderData);
  }, [orderData]);

  if (!court) {
    return <div>Court not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/2 p-4">
          <img
            src={court.img || "src/assets/images/default_court.png"}
            alt={court.courtName}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        </div>
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold">{court.courtName}</h1>
          <p className="text-gray-600">{court.location.address}</p>
          <p className="text-gray-600">
            {court.location.district.districtName},{" "}
            {court.location.district.city.cityName}
          </p>
          <Rate disabled defaultValue={5} />
          <p className="text-lg font-semibold">
            Price:{" "}
            {court.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <p className="text-gray-600 mt-2">{court.description}</p>
        </div>
      </div>
      <div className="my-4">
        <h3 className="text-xl font-semibold mb-2">Select Booking Type</h3>
        <Select defaultValue="fixed" className="w-full mb-2">
          <Option value="fixed">Fixed Booking</Option>
          <Option value="flexible">Flexible Booking</Option>
        </Select>
        <DatePicker
          onChange={handleDateChange}
          className="w-full mb-2"
          placeholder="Select Date"
          disabledDate={disabledDate}
        />
        <Select
          placeholder="Select Payment Method"
          className="w-full mb-2"
          onChange={(value) =>
            setOrderData((prev) => ({
              ...prev,
              method: { methodId: value },
            }))
          }
        >
          {paymentMethods.map((method) => (
            <Option key={method.methodId} value={method.methodId}>
              {method.methodName}
            </Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Select Time Start and Time End"
          className="w-full mb-2"
          onChange={handleTimeChange}
          value={selectedTimes}
        >
          {timeSlots.map((slot) => (
            <Option key={slot} value={slot}>
              {slot}
            </Option>
          ))}
        </Select>
        <Button
          className="w-full h-10 rounded bg-orange-500 text-white hover:bg-orange-600"
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Đặt sân theo khung thời gian
        </h2>
        <div className="flex justify-between items-center mb-4">
          <Button
            icon={<ArrowLeftOutlined />}
            className="bg-gray-200"
            onClick={() => setCurrentWeek((prev) => prev - 1)}
          >
            Tuần trước
          </Button>
          <Button
            icon={<ArrowRightOutlined />}
            className="bg-gray-200"
            onClick={() => setCurrentWeek((prev) => prev + 1)}
          >
            Tuần sau
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">{moment(date).format("L")}</h3>
              <div className="mt-2">
                {timeSlots.map((slot) => (
                  <div key={slot} className="bg-gray-200 p-2 rounded mb-2">
                    {slot} - 120k
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;
