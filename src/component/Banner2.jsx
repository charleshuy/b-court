const AdvancedBooking = () => {
  return (
    <div className="relative bg-yellow-500 text-white py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h2 className="text-4xl  font-bold mb-4 text-white">Plays Weakly?</h2>
          <h2 className="text-6xl font-bold mb-4">Booked in Advanced Today!</h2>
          <p className="text-gray-200 mb-8">
            The generated Lorem Ipsum is therefore always free from repetition
            injected humour, or non-characteristic words etc.
          </p>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-yellow-500 transition duration-300">
            BOOK
          </button>
        </div>
        <div>
          <img
            src="src/assets/images/biglogo2.png"
            alt="Logo"
            className="w-96"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedBooking;
