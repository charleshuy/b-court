import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Select, DatePicker, Input, Button, Rate } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import courts from "../data";

const { Option } = Select;

const time = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

const CourtDetail = () => {
  const { id } = useParams();
  const court = courts.find((court) => court.id.toString() === id);
  //eslint-disable-next-line
  const [selectedDate, setSelectedDate] = useState(null);
  //eslint-disable-next-line
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (selectedTimes) => {
    setSelectedTimes(selectedTimes);
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

  if (!court) {
    return <div>Court not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/2 p-4">
          <img
            src={court.img}
            alt={court.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        </div>
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold">{court.name}</h1>
          <p className="text-gray-600">{court.address}</p>
          <p className="text-gray-600">Description: {court.description}</p>
          <Rate disabled defaultValue={5} />
          <p className="text-lg font-semibold">Price: {court.price}</p>
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
        />
        <Select
          mode="multiple"
          placeholder="Select Time"
          className="w-full mb-2"
          onChange={handleTimeChange}
        >
          {time.map((slot) => (
            <Option key={slot} value={slot}>
              {slot}
            </Option>
          ))}
        </Select>
        <Input placeholder="Full Name" className="mb-2" />
        <Input placeholder="Email" className="mb-4" />
        <Link to="/payment">
          <button className="w-full h-10 rounded bg-orange-500 text-white hover:bg-orange-600">
            Book Now
          </button>
        </Link>
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
                {time.map((slot) => (
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
