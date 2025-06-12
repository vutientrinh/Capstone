"use client";

import { commonStore, profileStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { Box } from "@mui/material";
import { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";

interface Profile {
  firstName: string;
  lastName: string;
  bio: string;
  websiteUrl: string;
  avatar?: string;
  cover?: string;
}

interface ProfileErrors {
  firstName?: string;
  lastName?: string;
  websiteUrl?: string;
  [key: string]: string | undefined;
}

export const EditProfile = ({
  profile: initialProfile,
}: {
  profile: Profile;
}) => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUpdate = async ({
    avatar,
    cover,
    firstName,
    lastName,
    bio,
    websiteUrl,
  }: any) => {
    try {
      const response = await backendClient.updateUser({
        avatar,
        cover,
        firstName,
        lastName,
        bio,
        websiteUrl,
      });
      if (!response) {
        return;
      }
      dispatch(
        commonStore.actions.setSuccessMessage("Profile updated successfully")
      );

      setProfile((prev) => ({
        ...prev,
        avatar: avatar || prev.avatar,
        cover: cover || prev.cover,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        bio: bio || prev.bio,
        websiteUrl: websiteUrl || prev.websiteUrl,
      }));
    } catch (e) {
      console.error("Error updating profile:", e);
      dispatch(commonStore.actions.setErrorMessage("Failed to update profile"));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);

    // Validation
    const newErrors: ProfileErrors = {};
    if (!profile.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    if (profile.websiteUrl && !isValidUrl(profile.websiteUrl)) {
      newErrors.websiteUrl = "Please enter a valid URL";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      handleUpdate({
        avatar: profile.avatar,
        cover: profile.cover,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        websiteUrl: profile.websiteUrl,
      });
      dispatch(profileStore.actions.updateCurrentUser(profile));
      setIsSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <>
      <div className="pt-5 p-6">
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Profile updated successfully!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Website URL
            </label>
            <input
              type="text"
              name="websiteUrl"
              value={profile.websiteUrl}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.websiteUrl ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.websiteUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
            )}
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
