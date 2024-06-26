import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const courts = [
  {
    id: 1,
    name: "Sân Tường Anh",
    img: "src/assets/images/tuonganh.tester.png",
    description: "Hold and Manage your contest",
    address: "Thủ Đức",
    price: "70.000đ/h",
    tag: "Best Seller",
    sale: "30%",
  },
];

const CourtsOnSale = () => {
  const renderArrow = (type) => (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-200 ${
        type === "left" ? "left-0 ml-2" : "right-0 mr-2"
      }`}
    >
      {type === "left" ? (
        <LeftOutlined className="text-xl " />
      ) : (
        <RightOutlined className="text-xl " />
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-semibold mb-4">Courts on Sales</h2>
      <div className="relative">
        <Carousel
          arrows
          nextArrow={renderArrow("right")}
          prevArrow={renderArrow("left")}
          slidesToShow={4}
          slidesToScroll={1}
          infinite
        >
          {courts.map((court) => (
            <div key={court.id} className="p-4">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all duration-300">
                <div className="overflow-hidden">
                  <img
                    src={court.img}
                    alt={court.name}
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded">
                    {court.sale} OFF
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{court.name}</h3>
                    <h4 className="text-gray-600 text-lg">{court.address}</h4>
                    <p className="text-gray-600 text-lg">{court.description}</p>
                    <p className="text-yellow-500 mt-2 text-lg">
                      {court.price}
                    </p>
                    <Link to={`/court-detail/${court.id}`}>
                      <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded w-full">
                        Đặt sân
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CourtsOnSale;
