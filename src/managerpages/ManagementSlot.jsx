import { useState } from "react";
import { List, Badge } from "antd";

const timeSlots = [
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

const bookedSlots = ["9:00 - 10:00", "14:00 - 15:00", "17:00 - 18:00"];

const ManagementSlot = () => {
  //eslint-disable-next-line
  const [slots, setSlots] = useState(timeSlots);

  return (
    <div>
      <h2 className="text-2xl font-bold p-4">Time Slot Management</h2>
      <List
        bordered
        dataSource={slots}
        renderItem={(slot) => (
          <List.Item>
            {bookedSlots.includes(slot) ? (
              <Badge status="error" text={`${slot} (Booked)`} />
            ) : (
              <Badge status="success" text={`${slot} (Available)`} />
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ManagementSlot;
