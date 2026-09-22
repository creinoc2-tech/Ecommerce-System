import { extractFilePath } from "../helpers";
import type { ProductInput } from "../interfaces";
import supabases from "../superbase/superbase";

export const getProducts = async (page: number) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const {
    data: products,
    error,
    count,
  } = await supabases
    .from("products")
    .select("* , variants(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return { products, count };
};

export const getFilteredProducts = async ({
  page = 1,
  brands = [],
}: {
  page: number;
  brands: string[];
}) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabases
    .from("products")
    .select("* , variants(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (brands.length > 0) {
    query = query.in("brand", brands);
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { data, count };
};

export const getRecentProducts = async () => {
  const { data: products, error } = await supabases
    .from("products")
    .select("* , variants(*)")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return products;
};

export const getRandomProducts = async () => {
  const { data: products, error } = await supabases
    .from("products")
    .select("* , variants(*)")
    .limit(20);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);

  return randomProducts;
};

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabases
    .from("products")
    .select("* , variants(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return data;
};

export const searchProducts = async (searchTerm: string) => {
  const { data, error } = await supabases
    .from("products")
    .select("* , variants(*)")
    .ilike("name", `%${searchTerm}%`);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return data;
};

/* ********************************* */
/*          ADMINISTRADOR            */
/* ********************************* */

export const createProduct = async (productData: ProductInput) => {
  try {
    const { data: product, error: productError } = await supabases
      .from("products")
      .insert({
        name: productData.name,
        brand: productData.brand,
        slug: productData.slug,
        features: productData.features,
        description: productData.description,
        images: [],
      })
      .select()
      .single();

    if (productError) {
      throw new Error(productError.message);
    }

    const folderName = product.id;
    const uploadedImage = await Promise.all(
      productData.images.map(async (image) => {
        const { data, error } = await supabases.storage
          .from("product-images")
          .upload(`${folderName}/${product.id}-${image.name}`, image);

        if (error) throw new Error(error.message);
        const imageUrl = ` ${
          supabases.storage.from("product-images").getPublicUrl(data.path).data
            .publicUrl
        }`;

        return imageUrl;
      }),
    );

    const { error: updateError } = await supabases
      .from("products")
      .update({
        images: uploadedImage,
      })
      .eq("id", product.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const variants = productData.variants.map((variant) => ({
      product_id: product.id,
      stock: variant.stock,
      price: variant.price,
      storage: variant.storage,
      color: variant.color,
      color_name: variant.color_name,
    }));

    const { error: variantsError } = await supabases
      .from("variants")
      .insert(variants);

    if (variantsError) {
      throw new Error(variantsError.message);
    }

    return product;
  } catch (error) {
    throw new Error("Error creating  ");
  }
};

export const deleteProduct = async (productId: string) => {
  const { error: variantsError } = await supabases
    .from("variants")
    .delete()
    .eq("product_id", productId);

  if (variantsError) {
    console.log(variantsError.message);
    throw new Error(variantsError.message);
  }

  const { data: productImages, error: productsError } = await supabases
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();

  if (productsError) {
    throw new Error(productsError.message);
  }

  const { error: productDeleteError } = await supabases
    .from("products")
    .delete()
    .eq("id", productId);

  if (productDeleteError) {
    throw new Error(productDeleteError.message);
  }

  if (productImages.images.length > 0) {
    const folderName = productId;
    const paths = productImages.images.map((image: string) => {
      const fileName = image.split("/").pop();
      return `${folderName}/${fileName}`;
    });
    const { error: storageError } = await supabases.storage
      .from("product-images")
      .remove(paths);

    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  return true;
};

export const updateProduct = async (
  productId: string,
  productData: ProductInput,
) => {
  try {

     const { data: currentProduct, error: currentProductError } = await supabases
      .from("products")
      .select("images")
      .eq("id", productId)
      .single();

    if (currentProductError) {
      throw new Error(currentProductError.message);
    }

    const existingImages = currentProduct.images || [];

    const { data: updatedProduct, error: updateError } = await supabases
      .from("products")
      .update({
        name: productData.name,
        brand: productData.brand,
        slug: productData.slug,
        features: productData.features,
        description: productData.description,
      })
      .eq("id", productId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    const folderName = productId;
    const validImages = productData.images.filter((image) => image);

    // 3.1 Identificar las imágenes que han sido eliminadas
    const imagesToDelete = existingImages.filter(
      (image: any) => !validImages.includes(image),
    );

    const filesToDelete = imagesToDelete.map(extractFilePath);

    if (filesToDelete.length > 0) {
      const { error: deleteImagesError } = await supabases.storage
        .from("product-images")
        .remove(filesToDelete);

      if (deleteImagesError) {
        throw new Error(deleteImagesError.message);
      } else {
        console.log(`Imágenes eliminadas: ${filesToDelete.join(", ")}`);
      }
    }

    const uploadedImages = await Promise.all(
      validImages.map(async (image) => {
        if (image instanceof File) {
          const { data, error } = await supabases.storage
            .from("product-images")
            .upload(`${folderName}/${productId}-${image.name}`, image);
          if (error) throw new Error(error.message);
          const imageUrl = supabases.storage
            .from("product-images")
            .getPublicUrl(data.path).data.publicUrl;
          return imageUrl;
        } else if (typeof image === "string") {
          return image;
        } else {
          throw new Error("Tipo de imagen no válido");
        }
      }),
    );

    const { error: updateImagesError } = await supabases
      .from("products")
      .update({
        images: uploadedImages,
      })
      .eq("id", productId);

    if (updateImagesError) {
      throw new Error(updateImagesError.message);
    }

    const existingVariants = productData.variants.filter(
      (variant) => variant.id,
    );
    const newVariants = productData.variants.filter((variant) => !variant.id);

    if (existingVariants.length > 0) {
      const { error: updateVariantsError } = await supabases
        .from("variants")
        .upsert(
          existingVariants.map((variant) => ({
            id: variant.id,
            product_id: productId,
            stock: variant.stock,
            price: variant.price,
            storage: variant.storage,
            color: variant.color,
            color_name: variant.color_name,
          })),
          {
            onConflict: "id",
          },
        );

      if (updateVariantsError) {
        throw new Error(updateVariantsError.message);
      }
    }

    let newVariantIds: string[] = [];
    if (newVariants.length > 0) {
      const { data, error: insertVariantsError } = await supabases
        .from("variants")
        .insert(
          newVariants.map((variant) => ({
            product_id: productId,
            stock: variant.stock,
            price: variant.price,
            storage: variant.storage,
            color: variant.color,
            color_name: variant.color_name,
          })),
        )
        .select();

      if (insertVariantsError) {
        throw new Error(insertVariantsError.message);
      }
      newVariantIds = data.map((variant) => variant.id);
    }

    const currentVariantIds = [
      ...existingVariants.map((variant) => variant.id),
      ...newVariantIds,
    ];

    const { error: deleteVariantsError } = await supabases
      .from("variants")
      .delete()
      .eq("product_id", productId)
      .not(
        "id",
        "in",
        `(${currentVariantIds.map((id) => `"${id}"`).join(",")})`,
      );

    if (deleteVariantsError) {
      throw new Error(deleteVariantsError.message);
    }

    return updatedProduct;
  } catch (error) {
    console.log(error);
  }
};
