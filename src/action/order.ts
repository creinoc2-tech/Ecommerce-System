import type { OrderInput } from "../interfaces";
import supabases from "../superbase/superbase";

export const createOrder = async (order: OrderInput) => {
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

    console.log(customerData);

    if (errorCustomer) {
      throw new Error(errorCustomer.message);
    }

    const customerId = customerData?.id;

    for (const item of order.cartItems) {
      const { data: variantData, error: variantError } = await supabases
        .from("variants")
        .select("stock")
        .eq("id", item.variantId)
        .single();

      if (variantError) {
        throw new Error(
          "No se pudo obtener la variante: " + variantError.message,
        );
      }

      if (variantData.stock < item.quantity) {
        throw new Error(`No hay suficiente stock para 
                el producto con ID: ${item.variantId}`);
      }
    }

    console.log(order);

    const { data: addressData, error: addressError } = await supabases
      .from("addresses")
      .insert({
        customer_id: customerId,
        addresses_line1: order.address.addressLine1,
        addresses_line2: order.address.addressLine2,
        city: order.address.city,
        state: order.address.state,
        postal_code: order.address.postalCode,
        country: order.address.country,
      })
      .select()
      .single();

    if (addressError) {
      throw new Error(
        "No se pudo insertar la dirección: " + addressError.message,
      );
    }

    const { data: orderData, error: orderError } = await supabases
      .from("orders")
      .insert({
        customer_id: customerId,
        address_id: addressData.id,
        total_amount: order.totalAmount,
        status: "Pending",
      })
      .select()
      .single();

    if (orderError) {
      throw new Error("No se pudo crear la orden: " + orderError.message);
    }

    const orderItems = order.cartItems.map((item) => ({
      order_id: orderData.id,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabases
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      throw new Error(
        "No se pudo crear los items de la orden: " + orderItemsError.message,
      );
    }

    for (const item of order.cartItems) {
      const { data: variantData } = await supabases
        .from("variants")
        .select("stock")
        .eq("id", item.variantId)
        .single();

      if (!variantData) {
        throw new Error("No se encontro la variante");
      }

      const newStock = variantData.stock - item.quantity;

      const { error: updateStockError } = await supabases
        .from("variants")
        .update({
          stock: newStock,
        })
        .eq("id", item.variantId);

      if (updateStockError) {
        throw new Error("No se pudo actualizar el stock");
      }
    }

    return orderData;
  } catch (error) {
    console.log(error);
  }
};

export const getOrdersByCustomerId = async () => {
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

  const { data: ordersData, error: ordersError } = await supabases
    .from("orders")
    .select("id, total_amount, status, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error(
      "No se pudieron obtener las ordenes: " + ordersError.message,
    );
  }

  return ordersData;
};

export const getOrderById = async (orderId: string) => {
  const { data, error: errorUser } = await supabases.auth.getUser();
  if (errorUser) {
    throw new Error(errorUser.message);
  }
  const userId = data.user?.id;
  console.log("esto es mi user", userId);

  const { data: customerData, error: errorCustomer } = await supabases
    .from("customers")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (errorCustomer) {
    throw new Error(errorCustomer.message);
  }
  const customerId = customerData?.id;

  const { data: orderData, error: orderError } = await supabases
    .from("orders")
    .select(
      "* , addresses(*) , customers(full_name , email), order_items(quantity , price ,variants(storage , color_name , products(name , images) ) )  ",
    )
    .eq("customer_id", customerId)
    .eq("id", orderId)
    .single();

  console.log(" del usuario order", orderData);

  if (orderError) {
    throw new Error(orderError.message);
  }

  const ordenFormateada = {
    customer: {
      fullname: orderData?.customers?.full_name,
      email: orderData?.customers?.email,
    },
    totalAmount: orderData?.total_amount,
    status: orderData?.status,
    createdAt: orderData?.created_at,
    address: {
      addressLine1: orderData?.addresses?.addresses_line1,
      addressLine2: orderData?.addresses?.addresses_line2,
      city: orderData?.addresses?.city,
      state: orderData?.addresses?.state,
      postalCode: orderData?.addresses?.postal_code,
      country: orderData?.addresses?.country,
    },
    orderItems: orderData?.order_items?.map((items: any) => ({
      quantity: items.quantity,
      price: items.price,
      color_name: items.variants?.color_name,
      storage: items.variants?.storage,
      productName: items.variants?.products?.name,
      productImage: items.variants?.products?.images?.[0],
    })),
  };

  return ordenFormateada;
};

/* ********************************** */
/*            ADMINISTRADOR           */
/* ********************************** */
export const getAllOrders = async () => {
  const { data, error } = await supabases
    .from("orders")
    .select("id, total_amount, status, created_at, customers(full_name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  return data.map((order) => ({
    ...order,
    customers: Array.isArray(order.customers)
      ? (order.customers[0] ?? null)
      : order.customers,
  }));
};

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const { error } = await supabases
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getOrderByIdAdmin = async (orderId: string) => {
  const { data: orderData, error: orderError } = await supabases
    .from("orders")
    .select(
      "* , addresses(*) , customers(full_name , email), order_items(quantity , price ,variants(storage , color_name , products(name , images) ) )  ",
    )
    .eq("id", orderId)
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const ordenFormateada = {
    customer: {
      fullname: orderData?.customers?.full_name,
      email: orderData?.customers?.email,
    },
    totalAmount: orderData?.total_amount,
    status: orderData?.status,
    createdAt: orderData?.created_at,
    address: {
      addressLine1: orderData?.addresses?.addresses_line1,
      addressLine2: orderData?.addresses?.addresses_line2,
      city: orderData?.addresses?.city,
      state: orderData?.addresses?.state,
      postalCode: orderData?.addresses?.postal_code,
      country: orderData?.addresses?.country,
    },
    orderItems: orderData?.order_items?.map((items: any) => ({
      quantity: items.quantity,
      price: items.price,
      color_name: items.variants?.color_name,
      storage: items.variants?.storage,
      productName: items.variants?.products?.name,
      productImage: items.variants?.products?.images?.[0],
    })),
  };

  return ordenFormateada;
};
