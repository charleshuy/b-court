import { useState, useEffect } from "react";
import { Input, Pagination, Select, Checkbox } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import CourtAPI from "../api/CourtAPI";

const { Option } = Select;

const getUniqueDistricts = (courts) => {
  const districts = courts.map((court) => court.district.districtName);
  return [...new Set(districts)];
};

const Shop = () => {
  const [courts, setCourts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [sortBy, setSortBy] = useState("nothing");
  const [sortOrder, setSortOrder] = useState("asc"); // default ascending

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await CourtAPI.getCourts();
        setCourts(response);
        setFilteredCourts(response);
      } catch (error) {
        console.error("Failed to fetch courts:", error);
      }
    };

    fetchCourts();
  }, []);

  useEffect(() => {
    handleSorting();
  }, [sortBy, sortOrder]);

  const handleSorting = () => {
    let sortedCourts = [...filteredCourts];

    if (sortBy === "price_asc") {
      sortedCourts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      sortedCourts.sort((a, b) => b.price - a.price);
    }

    setFilteredCourts(sortedCourts);
  };

  const handleSearch = (value) => {
    const filtered = courts.filter((court) =>
      court.courtName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourts(filtered);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleDistrictChange = (checkedValues) => {
    setSelectedDistricts(checkedValues);
    filterCourts(checkedValues);
  };

  const filterCourts = (districts) => {
    let filtered = courts;

    if (districts.length > 0) {
      filtered = filtered.filter((court) =>
        districts.includes(court.district.districtName)
      );
    }

    setFilteredCourts(filtered);
  };

  const uniqueDistricts = getUniqueDistricts(courts);

  return (
    <div className="container mx-auto py-8">
      <div className="flex">
        <div className="flex flex-col w-fit">
          <div>
            <div className="w-fit p-4">
              <Input
                prefix={<AiOutlineSearch className="text-gray-500" />}
                placeholder="Search courts..."
                onChange={(e) => handleSearch(e.target.value)}
                className="mb-4"
              />
              <div className="mb-4">
                <h3 className="text-2xl font-semibold mb-2">Location</h3>
                <Checkbox.Group
                  options={uniqueDistricts}
                  onChange={handleDistrictChange}
                  className="flex flex-col"
                />
              </div>
            </div>
            <img
              src="src/assets/images/banner test.png"
              alt="banner"
              className="rounded"
            />
          </div>
        </div>
        <div className="w-3/4 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold">Courts</h2>
            <Select
              defaultValue={sortBy}
              onChange={(value) => setSortBy(value)}
              className="w-48"
            >
              <Option value="nothing">Default Sorting</Option>
              <Option value="price_asc">Price: Low to High</Option>
              <Option value="price_desc">Price: High to Low</Option>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((court) => (
                <div
                  key={court.courtId}
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all duration-300"
                >
                  <img
                    src={`http://localhost:8080/files/${court.fileId}`}
                    alt={court.courtName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {court.courtName}
                      </h3>
                      <p className="text-gray-600">{court.description}</p>
                      <p className="text-yellow-500 mt-2">
                        {court.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </p>
                      <p className="text-gray-500 mt-2">
                        {`${court.address}, ${court.district.districtName}, ${court.district.city.cityName}`}
                      </p>
                      <Link to={`/court-detail/${court.courtId}`}>
                        <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-full w-full">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              className="mt-8"
              current={currentPage}
              pageSize={pageSize}
              total={filteredCourts.length}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
