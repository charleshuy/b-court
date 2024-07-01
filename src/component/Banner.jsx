import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Carousel } from "antd";

const Banner = () => {
  return (
    <div className="relative bg-[#444B5D] text-white p-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between mt-8">
        <div className="flex flex-col items-center md:items-start space-y-4 md:w-1/2">
          <div className="flex flex-col items-center md:items-start space-y-2 my-4">
            <p className="text-amber-500 text-xl font-bold">
              With easy booking and payment
            </p>

            <h1 className="text-6xl font-bold text-center md:text-left text-amber-500">
              Book Your Court and Start Playing Today
            </h1>
          </div>
          <div className="flex space-x-4 mt-4">
            <input
              type="text"
              className="px-4 py-2 rounded-full text-black"
              placeholder="Search"
              style={{ width: "300px" }}
            />
            <button className="bg-lime-500 hover:bg-amber-500 text-white px-8 py-4 h-10 flex items-center justify-center rounded-full">
              Submit Now
            </button>
          </div>
        </div>
        <div className="relative mt-8 md:mt-0 md:w-1/2 max-w-lg">
          <Carousel
            dots={false}
            arrows
            prevArrow={<AiOutlineLeft size={24} className="text-yellow-500" />}
            nextArrow={<AiOutlineRight size={24} className="text-yellow-500" />}
          >
            <div className="relative">
              <img
                src="src/assets/images/B2.avif"
                alt="Tennis"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full">
                competitive
              </div>
            </div>
            <div className="relative">
              <img
                src="src/assets/images/B1.webp"
                alt="Badminton"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full">
                casual
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Banner;
