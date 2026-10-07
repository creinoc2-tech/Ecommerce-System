import React, { useState, type FC } from "react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validator";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ImagePreview {
  file?: File;
  previewUrl: string;
}

interface Props {
  setValue?: UseFormSetValue<ProductFormValues>;
  errors?: FieldErrors<ProductFormValues>;
  initialImages?: string[];
  multiple?: boolean;
  onImagesChange?: (images: Array<File | string>) => void;
}

export const UploaderImages: FC<Props> = ({
  setValue,
  errors,
  initialImages = [],
  multiple = true,
  onImagesChange,
}) => {
  const [images, setImages] = useState<ImagePreview[]>([]);

  React.useEffect(() => {
    if (initialImages.length > 0 && images.length === 0) {
      setImages(initialImages.map((image) => ({ previewUrl: image })));
      setValue?.("images", initialImages, { shouldValidate: true });
    }
  }, [initialImages, images.length, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      const updatedImages = multiple
        ? [...images, ...newImages]
        : newImages.slice(0, 1);
      const values = updatedImages.map(
        (image) => image.file || image.previewUrl,
      );

      if (!multiple) {
        images.forEach((image) => {
          if (image.file) URL.revokeObjectURL(image.previewUrl);
        });
      }
      setImages(updatedImages);
      setValue?.("images", values, { shouldValidate: true });
      onImagesChange?.(values);
    }
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const removedImage = images[index];
    const updatedImages = images.filter((_, i) => i !== index);
    if (removedImage?.file) URL.revokeObjectURL(removedImage.previewUrl);
    const values = updatedImages.map(
      (image) => image.file || image.previewUrl,
    );
    setImages(updatedImages);
    setValue?.("images", values, { shouldValidate: true });
    onImagesChange?.(values);
  };

  return (
    <>
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        multiple={multiple}
        id="image-upload-input"
        className="sr-only"
      />

      <div className="flex flex-wrap items-start gap-4">
        {(multiple || images.length === 0) && (
          <label
            htmlFor="image-upload-input"
            className="group flex h-36 w-36 cursor-pointer select-none flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white transition-colors duration-150 hover:bg-gray-50/75"
          >
            <svg
              aria-hidden="true"
              className="mb-2 h-12 w-12 text-[#9ca3af] transition-colors duration-150 group-hover:text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 5a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2H4zm0 2h16v10H4V7zm3 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm10.5 7h-11l3.5-4.5 2.5 3 2.5-3 2.5 4.5z"></path>
              <path d="M19 3H5a2 2 0 00-2 2h18a2 2 0 00-2-2z" opacity="0.4"></path>
            </svg>
            <span className="text-xs font-normal text-[#6b7280]">
              image upload
            </span>
          </label>
        )}

        {images.map((image, index) => (
          <div key={index} className="relative">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5">
              <img
                src={image.previewUrl}
                alt={`Preview ${index}`}
                className="h-full w-full rounded-lg object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute -right-2 -top-2 z-10 transition-all hover:scale-110"
            >
              <IoIosCloseCircleOutline size={20} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>
      {errors?.images && (
        <p className="mt-1 text-xs text-red-500">{errors.images.message}</p>
      )}
    </>
  );
};
