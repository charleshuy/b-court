import { useEffect, useState } from "react";
import { Tag } from "antd";
import { Link } from "react-router-dom";
import CourtAPI from "/src/api/CourtAPI"; // Ensure this import path is correct

const Court = () => {
  const [courts, setCourts] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await CourtAPI.getCourts();
        console.log("Fetched courts data:", data); // Log the fetched data
        setCourts(data); // Directly set the courts data
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };

    fetchCourts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-semibold mb-4">Our popular options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courts.map((court) => (
          <div
            key={court.courtId} // Use courtId instead of id
            className="relative bg-white rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all duration-300"
          >
            <div className="overflow-hidden">
              <img
                src={"src/assets/images/tuonganh.tester.png"} // Placeholder image path
                alt={court.courtName}
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {court.courtName}
                </h3>
                <p className="text-gray-600">
                  {court.location.address},{" "}
                  {court.location.district.districtName},{" "}
                  {court.location.district.city.cityName}
                </p>
                <p className="text-gray-600 mt-2">
                  {"Description not available"}
                </p>
                <p className="text-yellow-500 mt-2">{court.price}đ/h</p>
              </div>
              <Link to={`/court-detail/${court.courtId}`}>
                <button className="mt-4 w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                  Book Court
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Court;
