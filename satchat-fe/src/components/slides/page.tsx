"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { IMGAES_URL } from "@/global-config";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slides = ({ images }: any) => {
  return (
    <section className="py-2">
      <div className="container">
        <Swiper
          navigation
          pagination={{ type: "fraction" }}
          modules={[Navigation, Pagination]}
          className="h-150 w-full rounded-lg"
        >
          {images.map((image: any, index: any) => (
            <SwiperSlide key={index}>
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src={IMGAES_URL + image}
                  alt={"slide"}
                  width={1000}
                  height={1000}
                  priority={true}
                  className="block h-auto w-auto max-w-full max-h-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Slides;
