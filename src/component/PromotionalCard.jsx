const promotions = [
  {
    id: 1,
    img: "src/assets/images/waystation2.2.png",
    label: "Most Sales OFF",
    description: "40% OFF",
    tagColor: "bg-green-500",
    descriptionColor: "bg-orange-500",
  },
  {
    id: 2,
    img: "src/assets/images/waystation2.2.png",
    label: "Most Rated",
    description: "Free Water and AirCon",
    tagColor: "bg-orange-500",
    descriptionColor: "bg-gray-800",
  },
  {
    id: 3,
    img: "src/assets/images/waystation2.2.png",
    label: "Most Ordered",
    description: "Spacious and Social",
    tagColor: "bg-yellow-500",
    descriptionColor: "bg-green-500",
  },
];

const PromotionalCard = () => {
  return (
    <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {promotions.map((promotion) => (
        <div
          key={promotion.id}
          className="relative rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all duration-300"
        >
          <div className="overflow-hidden">
            <img
              src={promotion.img}
              alt={promotion.label}
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
            />
          </div>
          <div className={`w-full p-4 ${promotion.descriptionColor}`}>
            <div
              className={`text-white p-2 rounded-md inline-block ${promotion.tagColor}`}
            >
              {promotion.label}
            </div>
            <div className="text-white text-lg font-bold mt-2">
              {promotion.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromotionalCard;
