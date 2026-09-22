import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { productSchema, type ProductFormValues } from "../../../lib/validator";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router";
import { SectionFormProduct } from "./SectionFormProduct";
import { InputFormProduct } from "./InputFormProduct";
import { FeaturesInput } from "./FeaturesInput";
import { generateSlug } from "../../../helpers";
import { VariantsInput } from "./VariantsInput";
import { UploaderImages } from "./UploaderImages";
import { Editors } from "./Editor";
import { useCreateProducts } from "../../../hook/products/UseCreateProducts";
import { Loader } from "../../shared/Loader";
import { useUpdateProduct } from "../../../hook/products/useUpdateProduct";
import { useProductsData } from "../../../hook/products/useProductsData";
interface Props {
  titleForm: string;
}

export const FormProducts: FC<Props> = ({ titleForm }) => {
  const navigate = useNavigate();
  const { mutate :createProduct , isPending } = useCreateProducts();
  const { slug } = useParams<{ slug: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema) });

  const { product, isLoading } = useProductsData(slug || "");
  const { mutate: updateProduct } =
    useUpdateProduct(product?.id || "");

 const onSubmit = handleSubmit(data => {
		const features = data.features.map(feature => feature.value);

		if (slug) {
			updateProduct({
				name: data.name,
				brand: data.brand,
				slug: data.slug,
				variants: data.variants,
				images: data.images,
				description: data.description,
				features,
			});
		} else {
			createProduct({
				name: data.name,
				brand: data.brand,
				slug: data.slug,
				variants: data.variants,
				images: data.images,
				description: data.description,
				features,
			});
		}
	});
  const watchName = watch("name");

  useEffect(() => {
    if (product && !isLoading) {
      setValue("name", product.name);
      setValue("slug", product.slug);
      setValue("brand", product.brand);
      setValue(
        "features",
        product.features.map((feature: string) => ({ value: feature })),
      );
      setValue("description", product.description);
      setValue("images", product.images);
      setValue(
        "variants",
        product.variants.map((variant: any) => ({
          id: variant.id,
          stock: variant.stock,
          price: variant.price,
          storage: variant.storage,
          color: variant.color,
          color_name: variant.color_name,
        })),
      );
    }
  }, [product, isLoading, setValue]);

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
        <SectionFormProduct
          titleSection="Detalles del producto"
          className="lg:col-span-2 lg:row-span-2"
        >
          <InputFormProduct
            placeholder="Ingrese el nombre del producto"
            label="Nombre del producto"
            type="text"
            name="name"
            register={register}
            errors={errors}
            required
          />
          <FeaturesInput control={control} errors={errors} />
        </SectionFormProduct>

        <SectionFormProduct>
          <InputFormProduct
            type="text"
            label="Slug"
            name="slug"
            placeholder="iphone-13-pro-max"
            register={register}
            errors={errors}
          />

          <InputFormProduct
            type="text"
            label="Marca"
            name="brand"
            placeholder="Apple"
            register={register}
            errors={errors}
            required
          />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Variantes  del producto"
          className="lg:col-span-2 h-fit"
        >
          <VariantsInput
            control={control}
            errors={errors}
            register={register}
          />
        </SectionFormProduct>

        <SectionFormProduct titleSection="Imagenes del producto">
          <UploaderImages
            setValue={setValue}
            errors={errors}
            initialImages={product?.images}
          />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Descripción del producto"
          className="col-span-full"
        >
          <Editors
            setValue={setValue}
            errors={errors}
            initialContent={product?.description}
          />
        </SectionFormProduct>

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
