"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Dropzone from "react-dropzone";

const ImagePreview = ({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) => (
  <div className="relative w-full max-h-[400px] rounded-md border">
    <button
      className="absolute top-[-10px] right-[-25px] z-15"
      onClick={onRemove}
    >
      <XCircleIcon className="h-5 w-5 fill-black text-white" />
    </button>
    <Image
      src={url}
      height={400}
      width={400}
      alt=""
      className="rounded-md w-full h-full object-contain"
    />
  </div>
);

export default function InputDropzone({
  onFileChange,
}: {
  onFileChange: (file: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mt-2">
          {previewUrl ? (
            <ImagePreview
              url={previewUrl}
              onRemove={() => {
                setPreviewUrl(null);
                onFileChange(null);
              }}
            />
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                const file = acceptedFiles[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setPreviewUrl(imageUrl);
                  onFileChange(file);
                }
              }}
              accept={{
                "image/png": [".png", ".jpg", ".jpeg", ".webp"],
              }}
              maxFiles={1}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border border-dashed border-gray-400 flex items-center justify-center rounded-md w-full h-72 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <input {...getInputProps()} id="profile" />
                  <div className="flex flex-col items-center text-center px-4">
                    <ImageIcon
                      className="h-16 w-16 text-gray-600 mb-2"
                      strokeWidth={1.25}
                    />
                    <p className="text-sm text-gray-700">
                      Nhấn để chọn hoặc kéo thả hình ảnh vào khung này.
                    </p>
                  </div>
                </div>
              )}
            </Dropzone>
          )}
        </div>
      </div>
    </div>
  );
}
