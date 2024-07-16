import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourtAPI from "../api/CourtAPI"; // Ensure this import path is correct

const Court = () => {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await CourtAPI.getCourts();
        console.log("Fetched courts data:", data);
        setCourts(data);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };

    fetchCourts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-semibold mb-4">Our Courts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courts.map((court) => (
          <div
            key={court.courtId}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all duration-300"
          >
            <div className="overflow-hidden">
              <img
                src={`http://localhost:8080/files/${court.fileId}`}
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
                  {court.address}, {court.district.districtName},{" "}
                  {court.district.city.cityName}
                </p>
                <p className="text-gray-600 mt-2">
                  {court.description || "Description not available"}
                </p>
                <p className="text-yellow-500 mt-2">{court.price}VND /h</p>
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
