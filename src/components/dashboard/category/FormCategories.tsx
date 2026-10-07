import { useEffect, useMemo, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategoryFormValues,
} from "../../../lib/validator";
import { IoIosArrowBack } from "react-icons/io";
import { FaCloudArrowUp } from "react-icons/fa6";
import { useCreateCategory } from "../../../hook/category/useCreateCategory";
import { InputCategories } from "./InputFormCategories";
import { generateSlug } from "../../../helpers";
import { Loader } from "../../shared/Loader";
import { UploaderImages } from "../products/UploaderImages";
import { useUpdateCategory } from "../../../hook/category/useUpdateCategory";
import { useCategoryBySlug } from "../../../hook/category/useCategoryBySlug";

interface Props {
  titleForm: string;
}

export const FormCategories: FC<Props> = ({ titleForm }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const { mutate: createCategory, isPending } = useCreateCategory();

  const { category, isLoading } = useCategoryBySlug(slug || "");
  const categoryImageUrl = Array.isArray(category?.image_url)
    ? category.image_url[0]
    : category?.image_url;
  const categoryImageUrls = useMemo(
    () => (categoryImageUrl ? [categoryImageUrl] : []),
    [categoryImageUrl],
  );
   console.log("categoryImageUrls", categoryImageUrls);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  const { mutate: updateCategory } = useUpdateCategory(category?.id || "");

  const onSubmit = handleSubmit((data) => {
    if (slug) {
      updateCategory({
        name: data.name,
        slug: data.slug,
        image: data.image_url,
      });
    } else {
      createCategory({
        name: data.name,
        slug: data.slug,
        image: data.image_url,
      });
    }
  });

  const watchName = watch("name");

  useEffect(() => {
    if (category && !isLoading) {
      setValue("name", category.name);
      setValue("slug", category.slug);
      setValue("image_url", categoryImageUrl ?? null);
    }
  }, [category, categoryImageUrl, isLoading, setValue]);

  useEffect(() => {
    if (!watchName) return;
    const ganeratedSlug = generateSlug(watchName);
    setValue("slug", ganeratedSlug, { shouldValidate: true });
  }, [watchName, setValue]);

  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-md border border-slate-200 bg-white p-1.5 shadow-sm transition-all group hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack
            size={18}
            className="transition-all group-hover:scale-125"
          />
        </button>
        <h2 className="text-2xl font-bold capitalize tracking-tighter">
          {titleForm}
        </h2>
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full space-y-6 rounded-xl border border-gray-200/90 bg-white p-8 shadow-sm"
      >
        <InputCategories
          placeholder="Ingrese el nombre de la categoría"
          label="Category Name"
          type="text"
          name="name"
          register={register}
          errors={errors}
          required
        />

        <InputCategories
          type="text"
          label="Slug"
          name="slug"
          placeholder="iphone-13-pro-max"
          register={register}
          errors={errors}
        />

        <div className="pt-1">
          <h2 className="mb-4 text-xl font-bold text-[#1e293b]">
            Media And Published
          </h2>
          <UploaderImages
            multiple={false}
            initialImages={categoryImageUrls}
            onImagesChange={(images) =>
              setValue(
                "image_url",
                images[0] instanceof File ? images[0] : null,
                { shouldValidate: true },
              )
            }
          />
        </div>

        <div className="pt-3">
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#085df5] text-sm font-bold uppercase tracking-wide text-white shadow-sm transition duration-150 hover:bg-[#0751d8] active:scale-[0.99]"
            type="submit"
          >
            <FaCloudArrowUp className="h-5 w-5 text-white" />
            <span>Publish And View</span>
          </button>
        </div>
      </form>
    </div>
  );
};
