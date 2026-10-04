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

export interface CategoryInput {
  name: string;
  slug: string;
  image?: File | string | null;
  is_active?: boolean;
  customer_id?: string | null;
}

const extractCategoryFilePath = (url: string) => {
  const parts = url.split("/storage/v1/object/public/category-images/");

  if (parts.length !== 2) {
    throw new Error(`URL de imagen no válida: ${url}`);
  }

  return parts[1];
};

const uploadCategoryImage = async (categoryId: string, image: File) => {
  const { data, error } = await supabases.storage
    .from("category-images")
    .upload(`${categoryId}/${categoryId}-${image.name}`, image);

  if (error) throw new Error(error.message);

  return supabases.storage.from("category-images").getPublicUrl(data.path).data
    .publicUrl;
};

export const getCategories = async (page: number) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const {
    data: categories,
    error,
    count,
  } = await supabases
    .from("categories")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return { categories, count };
};

export const getFilteredCategories = async ({
  page = 1,
  isActive,
}: {
  page: number;
  isActive?: boolean;
}) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabases
    .from("categories")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (typeof isActive === "boolean") {
    query = query.eq("is_active", isActive);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data, count };
};

export const getRecentCategories = async () => {
  const { data: categories, error } = await supabases
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    throw new Error(error.message);
  }

  return categories;
};

export const getRandomCategories = async () => {
  const { data: categories, error } = await supabases
    .from("categories")
    .select("*")
    .limit(20);

  if (error) {
    throw new Error(error.message);
  }

  const randomCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 4);

  return randomCategories;
};

export const getCategoryBySlug = async (slug: string) => {
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

export const searchCategories = async (searchTerm: string) => {
  const { data, error } = await supabases
    .from("categories")
    .select("*")
    .ilike("name", `%${searchTerm}%`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createCategory = async (categoryData: CategoryInput) => {
  try {
    const { data: category, error: categoryError } = await supabases
      .from("categories")
      .insert({
        name: categoryData.name,
        slug: categoryData.slug,
        image_url: null,
        is_active: categoryData.is_active ?? true,
        customer_id: categoryData.customer_id ?? null,
      })
      .select()
      .single();

    if (categoryError) {
      throw new Error(categoryError.message);
    }

    if (categoryData.image instanceof File) {
      const imageUrl = await uploadCategoryImage(category.id, categoryData.image);

      const { error: updateError } = await supabases
        .from("categories")
        .update({
          image_url: imageUrl,
        })
        .eq("id", category.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return { ...category, image_url: imageUrl };
    }

    if (typeof categoryData.image === "string" && categoryData.image) {
      const { data: updatedCategory, error: updateError } = await supabases
        .from("categories")
        .update({
          image_url: categoryData.image,
        })
        .eq("id", category.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      return updatedCategory;
    }

    return category;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("No se pudo guardar la categoria");
  }
};

export const deleteCategory = async (categoryId: string) => {
  const { data: category, error: categoryError } = await supabases
    .from("categories")
    .select("image_url")
    .eq("id", categoryId)
    .single();

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  const { error: categoryDeleteError } = await supabases
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (categoryDeleteError) {
    throw new Error(categoryDeleteError.message);
  }

  if (category.image_url) {
    const path = extractCategoryFilePath(category.image_url);
    const { error: storageError } = await supabases.storage
      .from("category-images")
      .remove([path]);

    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  return true;
};

export const updateCategory = async (
  categoryId: string,
  categoryData: CategoryInput,
) => {
  try {
    const { data: currentCategory, error: currentCategoryError } = await supabases
      .from("categories")
      .select("image_url")
      .eq("id", categoryId)
      .single();

    if (currentCategoryError) {
      throw new Error(currentCategoryError.message);
    }

    const existingImage = currentCategory.image_url || null;
    let imageUrl = existingImage;

    if (categoryData.image instanceof File) {
      if (existingImage) {
        const { error: deleteImageError } = await supabases.storage
          .from("category-images")
          .remove([extractCategoryFilePath(existingImage)]);

        if (deleteImageError) {
          throw new Error(deleteImageError.message);
        }
      }

      imageUrl = await uploadCategoryImage(categoryId, categoryData.image);
    } else if (typeof categoryData.image === "string") {
      imageUrl = categoryData.image;
    } else if (categoryData.image === null && existingImage) {
      const { error: deleteImageError } = await supabases.storage
        .from("category-images")
        .remove([extractCategoryFilePath(existingImage)]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }

      imageUrl = null;
    }

    const { data: updatedCategory, error: updateError } = await supabases
      .from("categories")
      .update({
        name: categoryData.name,
        slug: categoryData.slug,
        image_url: imageUrl,
        is_active: categoryData.is_active ?? true,
        customer_id: categoryData.customer_id ?? null,
      })
      .eq("id", categoryId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return updatedCategory;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("No se pudo guardar la categoria");
  }
};
