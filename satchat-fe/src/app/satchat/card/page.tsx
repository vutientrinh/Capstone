"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const PerformancePostCard = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index: any) => {
    setCurrentSlide(index);
  };

  // Performance optimization sections data
  const sections = [
    {
      title: "SELECTIVE RENDERING",
      description:
        "Deploy only visible elements to optimize rendering performance",
      color: "#ff7b24",
    },
    {
      title: "CODE SPLITTING",
      description:
        "Split a bigger application bundle into multiple smaller bundles for efficient loading",
      color: "#2bc6ff",
    },
    {
      title: "COMPRESSION",
      description: "Compress files before sending them over the network",
      color: "#eaff00",
    },
    {
      title: "DYNAMIC IMPORTS",
      description:
        "Load code modules dynamically based on user actions to optimize the initial loading times",
      color: "#00ff66",
    },
    {
      title: "PRE-FETCHING",
      description:
        "Proactively fetch or cache resources that are likely to be needed in the near future",
      color: "#ff4040",
    },
    {
      title: "LOADING SEQUENCE",
      description:
        "Load critical resources and above the fold content first to improve user experience",
      color: "#ff44e3",
    },
    {
      title: "TREE SHAKING",
      description:
        "Remove code that will never be used from the final JS bundle",
      color: "#00ffea",
    },
    {
      title: "PRIORITY-BASED LOADING",
      description:
        "Load resources that the page will need before they are needed",
      color: "#ff44e3",
    },
  ];

  return (
    <div className="max-w-lg mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      {/* Post Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div>
          <div className="text-white text-lg font-bold">
            Frontend Performance Cheatsheet
          </div>
          <div className="text-gray-400 text-sm">ByteByteGo</div>
        </div>
        <button className="text-white text-2xl bg-transparent border-none cursor-pointer">
          ×
        </button>
      </div>

      {/* Image Slider */}
      <div className="relative h-64 bg-gray-800">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className="min-w-full h-full flex items-center justify-center"
            >
              <img
                src={`/api/placeholder/600/400`}
                alt={`Frontend Performance Cheatsheet - Slide ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white border-none outline-none cursor-pointer"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white border-none outline-none cursor-pointer"
        >
          ❯
        </button>
      </div>

      {/* Performance Sections */}
      <div className="p-4">
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center mb-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: section.color }}
              />
              <div className="text-white font-bold text-sm">
                {section.title}
              </div>
            </div>
            <div className="pl-5 text-gray-400 text-sm">
              {section.description}
            </div>
          </div>
        ))}
      </div>

      {/* Interaction Bar */}
      <div className="flex justify-between items-center p-4 border-t border-gray-800">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-gray-400 bg-transparent border-none cursor-pointer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 10v12l10-6-10-6z" />
            </svg>
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 bg-transparent border-none cursor-pointer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 bg-transparent border-none cursor-pointer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
            <span>Repost</span>
          </button>
        </div>
        <button className="flex items-center gap-2 text-gray-400 bg-transparent border-none cursor-pointer">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          <span>Send</span>
        </button>
      </div>

      {/* Comment Section */}
      <div className="p-4 border-t border-gray-800">
        {/* Comment Input */}
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-600"></div>
          <div className="flex-1 flex items-center bg-gray-800 rounded-full px-4">
            <input
              type="text"
              placeholder={t("posts.AddComment")}
              className="flex-1 bg-transparent border-none text-white py-2 outline-none"
            />
            <button className="bg-transparent border-none text-gray-400 text-lg cursor-pointer">
              😊
            </button>
            <button className="bg-transparent border-none text-gray-400 text-lg cursor-pointer">
              📷
            </button>
          </div>
        </div>

        {/* Comments Header */}
        <div className="flex justify-between mb-4">
          <div className="text-white">Most relevant</div>
          <button className="bg-transparent border-none text-gray-400 cursor-pointer">
            ▼
          </button>
        </div>

        {/* Comment */}
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600"></div>
          <div>
            <div className="font-bold text-white mb-1">RBM Software</div>
            <div className="text-gray-400 mb-2">
              This is a solid breakdown of frontend performance optimization!
              From code splitting and tree shaking to preloading and dynamic
              imports, these techniques help ensure a smooth, responsive user
              experience.
            </div>
            <div className="flex gap-4 text-gray-500 text-sm">
              <div className="cursor-pointer">Like</div>
              <div className="cursor-pointer">Reply</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePostCard;
