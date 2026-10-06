import { useEffect, useMemo, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategoryFormValues,
} from "../../../lib/validator";
import { IoIosArrowBack } from "react-icons/io";
import { useCreateCategory } from "../../../hook/category/useCreateCategory";
import { SectionFormCategorie } from "./SectionFormCategorie";
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
    <div className="flex flex-col gap-6 relative ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 transition-all  group
                        hover:bg-slate-105 "
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack
              size={18}
              className="transition-all group-hover:scale-125"
            />
          </button>
          <h2 className="font-bold tracking-tighter text-2xl capitalize ">
            {titleForm}
          </h2>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max flex-1"
      >
        <SectionFormCategorie
          titleSection="Detalles de la categoría"
          className="lg:col-span-2 lg:row-span-2"
        >
          <InputCategories
            placeholder="Ingrese el nombre de la categoría"
            label="Nombre de la categoría"
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
        </SectionFormCategorie>

        <SectionFormCategorie titleSection="Imagenes del Categoría">
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
        </SectionFormCategorie>

        <div className="flex gap-3 absolute top-0 right-0">
          <button
            className="btn-secondary-outline cursor-pointer hover:bg-slate-100"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>

          <button
            className="btn-primary
                cursor-pointer hover:bg-slate-900"
            type="submit"
          >
            Guardar Productos
          </button>
        </div>
      </form>
    </div>
  );
};
