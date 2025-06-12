"use client";

import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [websiteurl, setWebsiteurl] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(["USER"]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const handleRegister = async () => {
      try {
        const response: any = await backendClient.register(
          {
            username,
            email,
            password,
            role,
          },
          {
            firstname,
            lastname,
            websiteurl,
            bio,
          }
        );
        if (!response) {
          return;
        }
        dispatch(
          commonStore.actions.setSuccessMessage("User registered successfully")
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } catch (error) {
        console.log(error);
        dispatch(commonStore.actions.setErrorMessage("Error registering user"));
      }
    };

    handleRegister();
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="flex-1 p-10 flex flex-col">
        <div className="text-2xl font-bold text-indigo-600 mb-16">
          Connected
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold mb-2 text-[var(--foreground)]">
              Create an account
            </h1>
            <p className="text-gray-500">
              To continue, fill out your personal info
            </p>
          </div>

          <div>
            <div className="flex gap-4 mb-5">
              <div className="flex-1">
                <label
                  htmlFor="firstname"
                  className="block mb-2 text-sm text-[var(--foreground)]"
                >
                  First name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="firstname"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John"
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastname"
                  className="block mb-2 text-sm text-[var(--foreground)]"
                >
                  Last name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="lastname"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Doe"
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-[var(--foreground)]"
              >
                Username <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="best_wizard421"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-[var(--foreground)]"
              >
                E-mail <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="email@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="websiteurl"
                className="block mb-2 text-sm text-[var(--foreground)]"
              >
                Website URL
              </label>
              <input
                type="url"
                id="websiteurl"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com"
                onChange={(e) => setWebsiteurl(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="bio"
                className="block mb-2 text-sm text-[var(--foreground)]"
              >
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell us about yourself"
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-[var(--foreground)]"
              >
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="************"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm text-[var(--foreground)]"
              >
                Repeat password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirm-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="************"
                  required
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  {confirmPasswordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <div className="mt-5 mb-5 text-sm text-gray-500">
              By clicking Continue, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Terms and Conditions
              </a>
              , confirm you have read our{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Policy Privacy Notice
              </a>
              .
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-indigo-600 text-white rounded-md text-base font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-5"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
