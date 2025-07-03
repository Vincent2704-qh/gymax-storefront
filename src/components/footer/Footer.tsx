"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import CustomButton from "../button/CustomButton";

const Footer = () => {
  return (
    <footer className="bg-primary-300 text-white pt-12">
      <div className="container mx-auto pb-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Cột 1: Giới thiệu */}
          <div className="flex flex-col gap-4">
            <Link href={"#"}>
              <Image src={"/img/logo.png"} width={120} height={60} alt="Logo" />
            </Link>
            <p className="text-sm max-w-sm">
              Hệ thống phòng gym hàng đầu Việt Nam với trang thiết bị hiện đại
              và đội ngũ huấn luyện viên chuyên nghiệp.
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-lg text-accent mt-1 flex-shrink-0" />
                <span className="text-sm">
                  Số 128, Bùi Xương Trạch, Khương Đình, Thanh Xuân, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-lg text-accent" />
                <span className="text-sm">0375 321 910</span>
              </li>
              <li>
                <Link
                  href="mailto:lienhe@gymmax.vn"
                  className="flex items-center gap-3 hover:text-accent transition-all"
                >
                  <FaEnvelope className="text-lg text-accent" />
                  <span className="text-sm">lienhe@gymmax.vn</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2: Liên kết nhanh + Mạng xã hội */}
          <div>
            <h4 className="h4 text-accent mb-4">Liên kết nhanh</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={"#"}
                  className="text-sm hover:text-accent transition-all"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href={"#"}
                  className="text-sm hover:text-accent transition-all"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href={"#"}
                  className="text-sm hover:text-accent transition-all"
                >
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link
                  href={"#"}
                  className="text-sm hover:text-accent transition-all"
                >
                  Huấn luyện viên
                </Link>
              </li>
              <li>
                <Link
                  href={"#"}
                  className="text-sm hover:text-accent transition-all"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="text-accent mb-3 font-semibold">
                Theo dõi chúng tôi
              </h5>
              <div className="flex gap-4">
                <Link href={"#"} className="hover:text-accent transition-all">
                  <FaFacebook className="text-xl" />
                </Link>
                <Link href={"#"} className="hover:text-accent transition-all">
                  <FaTwitter className="text-xl" />
                </Link>
                <Link href={"#"} className="hover:text-accent transition-all">
                  <FaYoutube className="text-xl" />
                </Link>
              </div>
            </div>
          </div>

          {/* Cột 3: Đối tác thanh toán */}

          <div className="space-y-4">
            <div>
              <h4 className="h4 text-accent mb-4">Đăng ký nhận tin</h4>
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  Đăng ký để nhận thông tin về các chương trình khuyến mãi và
                  tips tập luyện mới nhất.
                </p>
                <form className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Địa chỉ email của bạn"
                    className="h-[45px] outline-none px-4 text-primary-300 flex-1 rounded"
                  />
                  <CustomButton
                    containerStyles="h-[45px] px-6 whitespace-nowrap"
                    text="Đăng ký"
                  />
                </form>
              </div>
            </div>
            <div>
              <h4 className="h4 text-accent mb-4">Đối tác thanh toán</h4>
              <div className="grid grid-cols-3 gap-4 items-center">
                <Image src="/img/momo.png" alt="MoMo" width={60} height={60} />

                <Image
                  src="/img/paypal.png"
                  alt="PayPal"
                  width={60}
                  height={60}
                />

                <Image
                  src="/img/vnpay.png"
                  alt="VNPay"
                  width={60}
                  height={60}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-white border-t border-white/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <span>&copy; 2024 GymMax. Tất cả quyền được bảo lưu.</span>
            <div className="flex gap-6">
              <Link href={"#"} className="hover:text-accent transition-all">
                Chính sách bảo mật
              </Link>
              <Link href={"#"} className="hover:text-accent transition-all">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
