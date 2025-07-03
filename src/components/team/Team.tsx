"use client";

import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "../button/CustomButton";

import { motion } from "framer-motion";
import { fadeIn } from "../../../lib/variants";
import { useUserList } from "./hooks/useUserList";

const Team = () => {
  const {
    loading,
    userList,
    pagination,
    filters,
    onChangePage,
    onChangeSearch,
    redirectToUserDetail,
  } = useUserList({
    filter: {
      limit: 4, // Hiển thị đúng 4 người
      role: [2],
    },
  });

  return (
    <section className="py-12 xl:h-[110vh]" id="team">
      <div className="mx-auto container h-full flex flex-col items-center justify-center">
        <motion.h2
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="h2 text-center mb-4"
        >
          Nhân viên của chúng tôi
        </motion.h2>

        <motion.div
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 mb-12"
        >
          {userList?.map((trainer, index) => (
            <div className="flex flex-col items-center text-center" key={index}>
              <div className="relative w-[320px] h-[360px] mx-auto mb-4">
                <Image
                  src={trainer?.avatar || "/images/default-avatar.jpg"}
                  fill
                  alt={trainer?.name || "Huấn luyện viên"}
                  className="object-cover rounded-md"
                />
              </div>
              <h4 className="h4 mb-2">{trainer?.name}</h4>
              <p className="uppercase text-xs tracking-[3px] mb-2">
                Huấn luyện viên
              </p>
              <div className="flex gap-12 justify-center">
                {[FaFacebook, FaTwitter, FaYoutube].map((Icon, i) => (
                  <Link
                    href="#"
                    key={i}
                    className="hover:text-accent transition-all"
                  >
                    <Icon className="text-lg" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.2 }}
        >
          <CustomButton
            containerStyles="w-[196px] h-[62px]"
            text="Xem tất cả"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
