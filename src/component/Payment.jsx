import { Input, DatePicker } from "antd";

const Payment = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-bold mb-4 text-green-400">
        Thanh Toán
      </h2>
      <div className="flex">
        <div className="w-1/2 p-4">
          <img src="src/assets/images/tuonganh.tester.png" />
        </div>
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-2">
            Sân bóng ĐH Giao Thông Vận Tải
          </h1>
          <p className="text-gray-600">Khu vực: Quận Đống Đa - Hà Nội</p>
          <p className="text-gray-600">Số sân: 5</p>

          <p className="text-lg font-semibold mt-2">Giá: VNĐ</p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Thông tin cá nhân</h3>
          <Input placeholder="Tên" className="mb-2" />
          <Input placeholder="Email" className="mb-2" />
          <Input placeholder="Thứ" className="mb-2" />
          <Input placeholder="Thời gian đã chọn" className="mb-2" />
          <Input placeholder="Số tháng đăng ký" className="mb-2" />
          <DatePicker placeholder="Ngày bắt đầu" className="w-full mb-4" />

          <h3 className="text-xl font-semibold mt-4 mb-2">
            Quét mã QR để thanh toán
          </h3>
          <img
            src="https://via.placeholder.com/150"
            alt="QR Code"
            className="mx-auto"
            style={{ width: "256px", height: "256px" }}
          />
          <p className="text-gray-600 text-center mt-2">
            Vui lòng quét mã QR để thanh toán. Đợi phản hồi trong vòng 5 - 10
            phút.
          </p>
          <button className="bg-green-400 w-full p-2 rounded my-10">
            Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
