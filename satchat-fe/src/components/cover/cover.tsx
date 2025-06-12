import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { IMGAES_URL } from "@/global-config";

type CoverImageProps = {
  src?: string;
  alt?: string;
  canEdit?: boolean;
  onChangeCover?: (file: File) => void;
};

export const CoverImage: React.FC<CoverImageProps> = ({
  src,
  alt = "cover",
  canEdit = false,
  onChangeCover,
}) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUpdateCover = async (file: File) => {
    try {
      const response: any = await backendClient.setCover(file);
      console.log("response", response);
      if (!response) {
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      dispatch(
        commonStore.actions.setSuccessMessage("Cover updated successfully")
      );
    } catch (error) {
      console.error("Error uploading avatar:", error);
      dispatch(commonStore.actions.setErrorMessage("Failed to update cover"));
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpdateCover(selectedFile);
    }
  };

  return (
    <div className="relative w-full h-[11.25rem] overflow-hidden rounded-lg shadow-lg">
      <Image
        src={previewUrl || (src ? IMGAES_URL + src : "/img/default_cover.jpg")}
        width={1024}
        height={200}
        alt={alt}
        style={{ width: "100%", height: "auto", maxHeight: "11.25rem" }}
        className="object-cover"
      />

      {canEdit && (
        <>
          <button
            className="absolute top-2 right-2 z-10 bg-black/50 text-white px-3 py-1 rounded hover:bg-black transition"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Cover
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};
