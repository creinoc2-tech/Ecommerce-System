import type { ICategories } from "../interfaces/category.interface";
import supabases from "../superbase/superbase";

export const getCategorySlug = async (slug: string) => {
  const { data, error } = await supabases
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getRecentCategory = async () => {
  const { data: products, error } = await supabases
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    throw new Error(error.message);
  }

  return products;
};

export const CreateCategory = async (categories: ICategories) => {
  try {
    const { data, error: errorUser } = await supabases.auth.getUser();
    if (errorUser) {
      throw new Error(errorUser.message);
    }
    const userId = data.user?.id;

    const { data: customerData, error: errorCustomer } = await supabases
      .from("customers")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (errorCustomer) {
      throw new Error(errorCustomer.message);
    }

    const customerId = customerData?.id;

    const { data: createCategory, error: errorCategory } = await supabases
      .from("categories")
      .insert({
        customer_id: customerId,
        name: categories.name,
        slug: categories.slug,
        image_url: [],
        is_active: categories.is_active,
      })
      .select()
      .single();

    if (errorCategory) {
      throw new Error(errorCategory.message);
    }

    const folderName = createCategory.id;
    const uploadedImage = await Promise.all(
      categories.image_url.map(async (image) => {
        const { data, error } = await supabases.storage
          .from("categorias-productos")
          .upload(`${folderName}/${createCategory.id}-${image.name}`, image);

        if (error) throw new Error(error.message);
        const imageUrl = supabases.storage
          .from("categorias-productos")
          .getPublicUrl(data.path).data.publicUrl;

        return imageUrl;
      }),
    );

    const { error: updateError } = await supabases
      .from("categories")
      .update({
        images: uploadedImage,
      })
      .eq("id", createCategory.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return createCategory;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("No se pudo crear la orden");
  }
};

export const deleteProduct = async (category: string) => {
  const { data: CategorieImages, error: productsError } = await supabases
    .from("categories")
    .select("image_url")
    .eq("id", category)
    .single();

  if (productsError) {
    throw new Error(productsError.message);
  }

  const { error: productDeleteError } = await supabases
    .from("categories")
    .delete()
    .eq("id", category);

  if (productDeleteError) {
    throw new Error(productDeleteError.message);
  }

  if (CategorieImages.image_url.length > 0) {
    const folderName = category;
    const paths = CategorieImages.image_url.map((image: string) => {
      const fileName = image.split("/").pop();
      return `${folderName}/${fileName}`;
    });
    const { error: storageError } = await supabases.storage
      .from("categorias-productos")
      .remove(paths);

    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  return true;
};
