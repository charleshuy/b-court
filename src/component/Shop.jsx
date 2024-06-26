import { useState } from "react";
import { Input, Pagination, Select, Checkbox } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";

const { Option } = Select;

const products = [
  {
    id: 1,
    name: "San Tan Truong",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Tân Bình",
    price: "70.000đ/h",

    rating: 4,
    tag: "SAN",
  },
  {
    id: 2,
    name: "San Quan Khu 7",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Thành Phố Thủ Đức",
    price: "40.000đ/h",
    rating: 3,
    tag: "SAN",
  },
  {
    id: 3,
    name: "San TADA",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Quận 1",
    price: "70.000đ/h",
    rating: 5,
    tag: "SAN",
  },
  {
    id: 4,
    name: "San Tan Binh Tan Son",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Quận 3",
    price: "70.000đ/h",

    rating: 4,
    tag: "SAN",
  },
  {
    id: 5,
    name: "CLB Binh Thanh",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Quận 5",
    price: "50.000đ/h",
    rating: 4,
    tag: "SAN",
  },
  {
    id: 6,
    name: "San Victory",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Tân Bình",
    price: "80.000đ/h",
    rating: 4,
    tag: "SAN",
  },
  {
    id: 7,
    name: "San Dai Phat",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Thành Phố Thủ Đức",
    price: "60.000đ/h",
    rating: 4,
    tag: "SAN",
  },
  {
    id: 8,
    name: "San Cau Long Galaxy",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Quận 1",
    price: "50.000đ/h",
    rating: 4,
    tag: "SAN",
  },
  {
    id: 9,
    name: "San Cau Long Duc Kim",
    img: "src/assets/images/tuonganh.tester.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt",
    address: "Quận 3",
    price: "40.000đ/h",
    rating: 4,
    tag: "SAN",
  },
];

const getUniqueAddresses = (products) => {
  const addresses = products.map((product) => product.address);
  return [...new Set(addresses)];
};

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const handleSearch = (value) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleAddressChange = (checkedValues) => {
    setSelectedAddresses(checkedValues);
    filterProducts(checkedValues, selectedExtras);
  };
  //eslint-disable-next-line
  const handleExtrasChange = (checkedValues) => {
    setSelectedExtras(checkedValues);
    filterProducts(selectedAddresses, checkedValues);
  };

  const filterProducts = (addresses, extras) => {
    let filtered = products;

    if (addresses.length > 0) {
      filtered = filtered.filter((product) =>
        addresses.includes(product.address)
      );
    }

    if (extras.length > 0) {
      // Apply extra filters if needed
    }

    setFilteredProducts(filtered);
  };

  const uniqueAddresses = getUniqueAddresses(products);

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
                <h3 className="text-2xl font-semibold mb-2">Vị Trí</h3>
                <Checkbox.Group
                  options={uniqueAddresses}
                  onChange={handleAddressChange}
                  className="flex flex-col"
                />
              </div>
            </div>
            <img
              src="src/assets/images/banner test.png"
              alt="anh"
              className="rounded"
            />
          </div>
        </div>
        <div className="w-3/4 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold">Sân Cầu Lông</h2>
            <Select defaultValue="nothing">
              <Option value="nothing">Default Sorting</Option>
              <Option value="price_asc">Price: Low to High</Option>
              <Option value="price_desc">Price: High to Low</Option>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all duration-300"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600">{product.description}</p>
                      <p className="text-yellow-500 mt-2">{product.price}</p>
                      <Link to={`/court-detail/${product.id}`}>
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
              total={filteredProducts.length}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
