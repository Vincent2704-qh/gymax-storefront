"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../../../lib/variants";
import CustomButton from "../button/CustomButton";
import { useServiceList } from "./hooks/useServiceList";
import { Label } from "../ui/label";

const Classes = () => {
  const {
    loading,
    serviceList,
    pagination,
    filters,
    onChangePage,
    onChangeSearch,
    redirectToServiceDetail,
  } = useServiceList({
    filter: {
      limit: 4,
    },
  });

  // Loading state
  if (loading) {
    return (
      <section id="trending">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="relative w-full h-[300px] lg:h-[485px] flex flex-col justify-center items-center bg-gray-200 animate-pulse"
            >
              <div className="z-30 max-w-[380px] text-center flex flex-col items-center justify-center gap-4">
                <div className="h-8 bg-gray-300 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
                <div className="w-[164px] h-[46px] bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="trending">
      <motion.div
        variants={fadeIn("up", 0.6)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        {serviceList?.map((service, index) => {
          return (
            <div
              key={service.id || index}
              className="relative w-full h-[300px] lg:h-[485px] flex flex-col justify-center items-center cursor-pointer"
            >
              <div className="bg-black/50 absolute w-full h-full top-0 z-10"></div>
              <Image
                src={service.sImage || "/img/classes/fitness.jpg"}
                fill
                className="object-cover"
                alt={service.productTitle || "Service"}
              />
              <div className="z-30 max-w-[380px] text-center flex flex-col items-center justify-center gap-4">
                <motion.h3
                  variants={fadeIn("up", 0.4)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.2 }}
                  className="h3 text-accent capitalize"
                >
                  {service.productTitle}
                </motion.h3>
                <motion.p
                  variants={fadeIn("up", 0.6)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.2 }}
                  className="text-white line-clamp-3"
                >
                  {service.productDesc || "Discover our amazing service"}
                </motion.p>
                <motion.div
                  variants={fadeIn("up", 0.8)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <CustomButton
                    containerStyles="w-[164px] h-[46px]"
                    text="Xem chi tiết"
                  />
                </motion.div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {!loading && (!serviceList || serviceList.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No trending services available at the moment.
          </p>
        </div>
      )}
    </section>
  );
};

export default Classes;
