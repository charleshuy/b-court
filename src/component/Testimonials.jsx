import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const statistics = [
  {
    id: 1,
    title: "SATISFIED CUSTOMERS",
    value: "1963",
    icon: "👥",
  },
  {
    id: 2,
    title: "QUALITY OF SERVICE",
    value: "99%",
    icon: "👥",
  },
  {
    id: 3,
    title: "QUALITY CERTIFICATES",
    value: "33",
    icon: "👥",
  },
  {
    id: 4,
    title: "AVAILABLE PRODUCTS",
    value: "789",
    icon: "👥",
  },
];

const testimonials = [
  {
    id: 1,
    text: "Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s.",
    name: "Client Name",
    profession: "Profession",
    image: "https://via.placeholder.com/150",
    rating: 5,
  },
  {
    id: 2,
    text: "Lorem Ipsum is simply dummy text of the printing Ipsum has been the industry's standard dummy text ever since the 1500s.",
    name: "Client Name",
    profession: "Profession",
    image: "https://via.placeholder.com/150",
    rating: 5,
  },
];

const Testimonials = () => {
  const renderArrow = (type) => (
    <div
      className="absolute top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg cursor-pointer"
      style={{ [type]: "-20px" }}
    >
      {type === "left" ? (
        <LeftOutlined className="text-xl text-orange-500" />
      ) : (
        <RightOutlined className="text-xl text-orange-500" />
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {statistics.map((stat) => (
          <div
            key={stat.id}
            className="text-center p-8 bg-gray-100 rounded-lg shadow-lg"
          >
            <div className="text-4xl mb-4">{stat.icon}</div>
            <div className="text-2xl font-bold text-yellow-500 mb-2">
              {stat.title}
            </div>
            <div className="text-4xl font-bold text-gray-700">{stat.value}</div>
          </div>
        ))}
      </div>
      <h2 className="text-3xl font-semibold text-center mb-4">
        Our Testimonial
      </h2>
      <h3 className="text-2xl font-semibold text-center text-yellow-500 mb-12">
        Our Client Saying!
      </h3>
      <div className="relative">
        <Carousel
          arrows
          nextArrow={renderArrow("right")}
          prevArrow={renderArrow("left")}
          slidesToShow={2}
          slidesToScroll={1}
          infinite
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4">
              <div className="relative bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-600 mb-8">{testimonial.text}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500">{testimonial.profession}</p>
                    <div className="text-yellow-500">
                      {Array(testimonial.rating).fill("⭐")}
                    </div>
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

export default Testimonials;
