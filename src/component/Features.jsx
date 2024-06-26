import {
  FaTrophy,
  FaShieldAlt,
  FaExchangeAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaTrophy size={100} className="text-yellow-500" />,
    title: "Hold Champion Ship",
    description: "Hold and Manage your contest",
  },
  {
    icon: <FaShieldAlt size={100} className="text-yellow-500" />,
    title: "Security Payment",
    description: "100% security payment",
  },
  {
    icon: <FaExchangeAlt size={100} className="text-yellow-500" />,
    title: "24h Return Policy",
    description: "Refund up to 100%",
  },
  {
    icon: <FaPhoneAlt size={100} className="text-yellow-500" />,
    title: "24/7 Support",
    description: "Support every time fast",
  },
];

const Features = () => {
  return (
    <div className=" py-12 ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-64">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow justify-between"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
