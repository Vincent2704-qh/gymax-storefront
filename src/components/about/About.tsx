"use client";

import { FaUser } from "react-icons/fa";
import { IoIosPricetag } from "react-icons/io";
import { FaDumbbell } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn } from "../../../lib/variants";
import Achievements from "./Achievements";

const featured = [
  {
    icon: <FaUser />,
    title: "HLV đạt nhiều giải thưởng",
    subtile: "Đội ngũ huấn luyện viên chuyên nghiệp, được công nhận quốc tế.",
  },
  {
    icon: <IoIosPricetag />,
    title: "Chi phí hợp lý",
    subtile: "Đa dạng gói tập phù hợp mọi nhu cầu và ngân sách.",
  },
  {
    icon: <FaDumbbell />,
    title: "Trang thiết bị hiện đại",
    subtile: "Cơ sở vật chất tiên tiến, hỗ trợ tập luyện hiệu quả.",
  },
];

const About = () => {
  return (
    <section className="pt-8 pb-8 lg:pt-12 lg:pb-12" id="about">
      {" "}
      {/* <-- Rút ngắn padding */}
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-2 mb-6">
          <motion.h2
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="h2 text-center"
          >
            Về chúng tôi
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.6)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="max-w-[600px] mx-auto text-center"
          >
            GymMax cung cấp môi trường tập luyện chuyên nghiệp, giúp bạn đạt
            được mục tiêu sức khỏe và thể hình nhanh chóng.
          </motion.p>
        </div>
        <motion.div
          variants={fadeIn("up", 0.8)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10"
        >
          {featured.map((feature, index) => (
            <div
              className="flex flex-col justify-center items-center gap-4 border p-8"
              key={index}
            >
              <div className="text-4xl bg-primary-300 text-white w-[80px] h-[80px] rounded-full flex justify-center items-center">
                {feature.icon}
              </div>
              <div className="flex flex-col justify-center items-center gap-2 text-center">
                <h4 className="h4 text-accent">{feature.title}</h4>
                <p>{feature.subtile}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Thống kê thành tích */}
        <motion.div
          variants={fadeIn("up", 1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
        >
          <Achievements />
        </motion.div>
      </div>
    </section>
  );
};
export default About;
