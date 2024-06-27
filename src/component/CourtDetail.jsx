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
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
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
  const [orders, setOrders] = useState([]);

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
  const fetchOrders = async () => {
    if (selectedDate && orderData.court.courtId) {
      try {
        const orders = await OrderAPI.getOrdersByCourtAndDate(
          orderData.court.courtId,
          orderData.bookingDate
        );
        setOrders(orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }
  };

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

  const getSlotBookingInfo = (slot) => {
    const start = orders.some((order) =>
      moment(slot, "HH:mm").isSame(moment(order.slotStart, "HH:mm"))
    );
    const end = orders.some((order) =>
      moment(slot, "HH:mm").isSame(moment(order.slotEnd, "HH:mm"))
    );

    if (start && end) return "startEnd";
    if (start) return "start";
    if (end) return "end";
    if (
      orders.some((order) =>
        moment(slot, "HH:mm").isBetween(
          moment(order.slotStart, "HH:mm"),
          moment(order.slotEnd, "HH:mm"),
          null,
          "[)"
        )
      )
    )
      return "middle";

    return "none";
  };

  const handleDateChange = async (date) => {
    const formattedDate = date.format("YYYY-MM-D");
    setSelectedDate(date);
    setOrderData((prev) => ({ ...prev, bookingDate: formattedDate }));

    // Fetch orders for the selected date
    try {
      const fetchedOrders = await OrderAPI.getOrdersByCourtAndDate(
        id,
        formattedDate
      );
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders for the selected date:", error);
    }
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
      setSelectedTimes([]); // Reset selected times
      setOrderData((prev) => ({
        ...prev,
        slotStart: "",
        slotEnd: "",
      })); // Reset order data slots
      fetchOrders(); // Fetch updated orders
    } catch (error) {
      console.error("Failed to create order:", error);
      message.error("Failed to create order. Please try again.");
      setErrorModalVisible(true); // Show error modal
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      if (selectedDate && orderData.court.courtId) {
        try {
          const orders = await OrderAPI.getOrdersByCourtAndDate(
            orderData.court.courtId,
            orderData.bookingDate
          );
          setOrders(orders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      }
    };

    fetchOrders();
  }, [selectedDate, orderData.court.courtId]);

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
        <div className="bg-green-100 rounded-lg p-2 mb-2 flex justify-center">
          <div className="flex justify-between w-full">
            {timeSlots.map((slot) => {
              const bookingInfo = getSlotBookingInfo(slot);
              let slotStyle = {
                flex: "1 0 auto",
                width: "50px",
                height: "50px",
              };

              if (bookingInfo === "start") {
                slotStyle.background =
                  "linear-gradient(to right, green 50%, red 50%)";
              } else if (bookingInfo === "end") {
                slotStyle.background =
                  "linear-gradient(to right, red 50%, green 50%)";
              } else if (bookingInfo === "startEnd") {
                slotStyle.background =
                  "linear-gradient(to right, red 50%, red 50%)";
              } else if (bookingInfo === "middle") {
                slotStyle.background = "red";
              } else {
                slotStyle.background = "green";
              }

              return (
                <div
                  key={slot}
                  className="flex items-center justify-center"
                  style={slotStyle}
                >
                  {slot.split(":")[0]}
                </div>
              );
            })}
          </div>
        </div>

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
    </div>
  );
};

export default CourtDetail;
