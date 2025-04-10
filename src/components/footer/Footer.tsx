"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <footer className="bg-primary-300 pt-24">
      <div className="container mx-auto pb-24">
        <div className="text-white grid grid-cols-1 xl:grid-cols-4 gap-x-8 gap-y-12">
          <div className="flex flex-col gap-4">
            <Link href={"#"}>
              <Image src={"/img/logo.png"} width={117} height={55} alt="" />
            </Link>
            <p className="max-w-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
              placeat, fuga praesentium, facere magnam iure laudantium provident
              non, rerum velit consequuntur inventore illo dicta! Iste, veniam
              quibusdam. Doloribus, est nostrum.
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-xl text-accent" />
                <span>
                  {" "}
                  CÔNG TY TNHH THỂ THAO GYM MAX Số 128, phố Bùi Xương Trạch,
                  phường Khương Đình, quận Thanh Xuân, Thành phố Hà Nội Giấy
                  chứng nhận DKKD số 0107923723 sở Kế Hoạch và Đầu Tư Hà Nội cấp
                  ngày 17/07/2017
                </span>
              </li>
              <li className="flex items-center gap-4">
                <FaPhoneAlt className="text-xl text-accent" />
                <span>0375321910</span>
              </li>
              <li>
                <Link href={"#"} className="flex items-center gap-4">
                  <FaEnvelope className="text-xl text-accent" />
                  <span>lienhe@gymmax.vn</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="h4 text-accent mb-4">Recent blog poster</h4>
            <div className="border-b border-dotted border-gray-400 flex flex-col gap-3 pb-3 mb-4">
              <Link className="hover:text-accent transition-all" href={"#"}>
                <h5 className="h5 leading-snug">
                  How to stay motivated for all exercises
                </h5>
                <p className="text-gray-400 text-[12px] tracking-[3px] uppercase">
                  September 22, 2024
                </p>
              </Link>
            </div>
            <div className="border-b border-dotted border-gray-400 flex flex-col gap-3 pb-3 mb-4">
              <Link className="hover:text-accent transition-all" href={"#"}>
                <h5 className="h5 leading-snug">
                  How to stay motivated for all exercises
                </h5>
                <p className="text-gray-400 text-[12px] tracking-[3px] uppercase">
                  September 22, 2024
                </p>
              </Link>
            </div>
            <div className="flex flex-col gap-3 pb-3 mb-4">
              <Link className="hover:text-accent transition-all" href={"#"}>
                <h5 className="h5 leading-snug">
                  How to stay motivated for all exercises
                </h5>
                <p className="text-gray-400 text-[12px] tracking-[3px] uppercase">
                  September 22, 2024
                </p>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="h4 text-accent mb-4">Google Map</h4>
          </div>
          <div>
            <h4 className="h4 text-accent mb-4">Newsletter</h4>
            <div className="flex flex-col gap-4">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
                magni, hic possimus, accusantium veniam dolores ut libero
                perferendis nulla illum molestias, tenetur earum porro vitae
                modi quidem quod natus? A?
              </p>
              <form>
                <input
                  type="text"
                  placeholder="Your email address"
                  className="h-[50px] outline-none px-4 text-primary-300"
                />
                <CustomButton containerStyles="h-[50px] px-8" text="Send" />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="text-white border-t border-white/20 py-12">
        <div className="container mx-auto h-full">
          <div>
            <span>&copy; Copyright 2024 Fitphysique</span>
            <ul>
              <li>
                <Link
                  href={"#"}
                  className="text-white hover:text-accent transition-all"
                ></Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
