import { useForm } from "react-hook-form";
import { InputAddress } from "./InputAddress";
import { addressSchema, type AddressFormValues } from "../../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemsCheckout } from "./ItemsCheckout";
import { useCreateOrders } from "../../hook/orders/useCreateOrders";
import { useCartStore } from "../../store/cart.store";

export const FormCheckout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema) });

  const { mutate: createOrders, isPending } = useCreateOrders();
  const cleanCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);

  const onSubmit = (data: any) => {
    const orderInput = {
      address: data,
      cartItems: cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalAmount,
    };

    createOrders(orderInput, {
      onSuccess: () => {
        cleanCart();
      },
    });
  };

  if (isPending) {
    return (
      <div
        className="flex flex-col gap-3 h-screen items-center
         justify-center "
      >
        <p className="text-sm font-medium">Procesando tu pedido...</p>
      </div>
    );
  }

  return (
    <div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold  tracking-normal">
            Entrega a domicilio
          </h3>

          <InputAddress
            register={register}
            errors={errors}
            name="addressLine1"
            placeholder="Dirección principal "
          />

          <InputAddress
            register={register}
            errors={errors}
            name="addressLine2"
            placeholder="Dirección secundaria(opcional) "
          />

          <InputAddress
            register={register}
            errors={errors}
            name="state"
            placeholder="Estado / Provincia / Región "
          />

          <InputAddress
            register={register}
            errors={errors}
            name="city"
            placeholder="Ciudad"
          />

          <InputAddress
            register={register}
            errors={errors}
            name="postalCode"
            placeholder="Código Postal (opcional) "
          />

          <select
            className="border border-slate-200 rounded-md p-3"
            {...register("country")}
          >
            <option value="Ecuador">Ecuador</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Metodo de envio </p>
          <div
            className="flex  justify-between items-center text-sm
            border border-slate-600 bg-stone-100 py-4 rounded-md px-6"
          >
            <span className="font-semibold">Standard</span>
            <span className="font-semibold">Gratis</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className="flex justify-between items-center text-sm border  
            border-slate-600 bg-stone-100 py-4 rounded-ss-md rounded-se-md px-6
            "
          >
            <span>Deposito Bancario </span>
          </div>

          <div
            className=" bg-stone-100 text-[13px] p-5 space-y-0.5
             border border-gray-200 rounded-es-md rounded-ee-md"
          >
            <p>Compra a traves de transferencia bancaria</p>
            <p>Banco Pichincha</p>
            <p>Razon Social : CelularesBaratos</p>
            <p>Ruc : 1234567890000</p>
            <p>Tipo de Cuenta : Ahorros</p>
            <p>Numero de cuenta : 1234567890</p>
            <p>
              La informacion sera compartida con el banco al finalizar la
              compra.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-semibold text-3xl">Resumen del pedido</h3>
          <ItemsCheckout />
        </div>

        <button
          type="submit"
          className="bg-black text-white py-3.5 font-bold tracking-wide rounded-md mt-2"
        >
          Finalizar Pedido
        </button>
      </form>
    </div>
  );
};
