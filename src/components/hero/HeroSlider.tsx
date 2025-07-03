"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { fadeIn } from "../../../lib/variants";
import "swiper/css";
import "swiper/css/navigation";
import CustomButton from "../button/CustomButton";
import SwiperNavButtons from "../button/SwiperNavButtons";
import { useRouter } from "next/navigation";

const HeroSlider = () => {
  const router = useRouter();

  return (
    <Swiper className="h-full">
      <SwiperSlide>
        <div className="h-full flex justify-end pt-48">
          <div className="flex flex-col items-center lg:items-start lg:max-w-[700px]">
            <motion.h1
              variants={fadeIn("up", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.2 }}
              className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-[1.1] font-extrabold text-white text-center lg:text-left mb-4"
            >
              <span className="block">Đặt lịch tập</span>
              <span className="block">luyện chuyên nghiệp</span>
            </motion.h1>
            <motion.p
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="text-white italic text-center lg:text-left mb-4"
            >
              Tiết kiệm thời gian – chủ động chọn khung giờ và huấn luyện viên
              phù hợp với bạn.
            </motion.p>
            <motion.div
              variants={fadeIn("up", 0.6)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.2 }}
            >
              <div onClick={() => router.push("/shop")}>
                <CustomButton
                  text="Bắt đầu ngay"
                  containerStyles="w-[196px] h-[62px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="h-full flex justify-end pt-48">
          <div className="flex flex-col items-center lg:items-start lg:max-w-[700px]">
            <motion.h1
              variants={fadeIn("up", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.2 }}
              className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-[1.1] font-extrabold text-white text-center lg:text-left mb-4"
            >
              <span className="block">Biến mục tiêu</span>
              <span className="block">thành hiện thực</span>
            </motion.h1>
            <motion.p
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="text-white italic text-center lg:text-left mb-4"
            >
              Hệ thống quản lý buổi tập hiện đại giúp bạn theo dõi tiến trình và
              không bỏ sót buổi nào.
            </motion.p>
            <motion.div
              variants={fadeIn("up", 0.6)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.2 }}
            >
              <div onClick={() => router.push("/shop")}>
                <CustomButton
                  text="Bắt đầu ngay"
                  containerStyles="w-[196px] h-[62px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperNavButtons
        containerStyles="absolute bottom-2 lg:bottm-0 right-0 h-[130ox] w-full lg:w-[700px] z-50 flex justify-center lg:justify-start gap-1"
        btnStyles="border border-accent text-white w-[56px] h-[56px] flex justify-center items-center hover:bg-accent transition-all duration-300"
        iconStyles="text-2xl"
      />
    </Swiper>
  );
};

export default HeroSlider;
