import { IMGAES_URL } from "@/global-config";
import { FC } from "react";

const Images: FC<any> = (props: any) => {
  const { data, onClick } = props;

  console.log("data", data);
  const handleClickImage = (index: number) => {
    onClick(index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((slide: any, index: any) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow duration-300 group"
        >
          <img
            src={slide.src}
            alt={slide.title}
            className="w-full h-64 object-cover"
            onClick={() => handleClickImage(index)}
          />
          <a
            href={slide.src}
            download
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-1 shadow transition"
            title="Download"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Images;
