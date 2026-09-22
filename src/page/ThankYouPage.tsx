import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useOrder } from "../hook/orders/useOrder";
import { Loader } from "../components/shared/Loader";
import { formatPrice } from "../helpers";
import supabases from "../superbase/superbase";
import { useUser } from "../hook";

export const ThankYouPage = () => {
  const { id } = useParams<{ id: string }>();
   const { data, isLoading, isError } = useOrder(id ?? "");
  const navigate = useNavigate();
  const { isLoading: isUserLoading } = useUser();
  
   useEffect(() => {
    const { data: authListener } = supabases.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/login");
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

 
  if (isError) return <div>Error al cargar la orden.</div>;

  if (isLoading || !data || isUserLoading) return <Loader />;

  return (
    <div className="flex flex-col h-screen">
      <header className="text-black flex items-center justify-center flex-col px-10 py-12">
        <Link
          to="/"
          className="text-4xl font-bold self-center tracking-tighter transition-all md:text-5xl"
        >
          <p>
            Productos
            <span className="text-cyan-600"> en oferta</span>
          </p>
        </Link>
      </header>

      <main className="container flex-1 flex flex-col items-center gap-10">
        <div className="flex gap-3 items-center">
          <p className="text-4xl">
            Gracias por tu compra! {data?.customer.fullname}
          </p>
        </div>

        <div className="border border-slate-200 w-full md:w-[600px] p-5 rounded-md space-y-3">
          <h3 className="font-medium">Tu pedido esta confirmado</h3>

          <p className="text-sm">
            Gracias por comprar con nosotros. Hemos recibido tu pedido y estamos
            trabajando para procesarlo. Te enviaremos una notificación por
            correo electrónico con los detalles de tu pedido y la información de
            seguimiento una vez que haya sido enviado.
          </p>

          <div className="space-y-0.5 text-sm">
            <p>Compra a traves de transferencia bancaria</p>
            <p>Banco Pichincha</p>
            <p>Razon Social : CelularesBaratos</p>
            <p>Ruc : 1234567890000</p>
            <p>Tipo de Cuenta : Ahorros</p>
            <p>Numero de cuenta : 1234567890</p>
          </div>

          <p className="text-sm">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
            Estamos aquí para ayudarte.
          </p>
        </div>
        <div
          className="border border-slate-200 w-full p-5 rounded-md 
         space-y-3 md:w-[600px] "
        >
          <h3 className="font-medium">Detalles de la compra</h3>
          <div className="flex flex-col gap-5">
            <ul className="space-y-3">
              {data.orderItems.map((item: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between items-center gap-3"
                >
                  <div className="flex">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-container"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <p className="font-semibold">{item?.productName}</p>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        {formatPrice(Number(item?.price))}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <p className="text-[13px] text-gray-600">
                        {item?.storage} / {item?.color_name}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                {formatPrice(data.totalAmount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col text-sm">
              <p className="font-semibold">Informacion de contacto</p>
              <p>{data?.customer.email}</p>
            </div>

            <div className="flex flex-col text-sm">
              <p className="font-semibold">Metodos de pago </p>
              <p>Deposito Bancario - {formatPrice(data.totalAmount)}</p>
            </div>

            <div className="flex flex-col text-sm">
              <p className="font-semibold">Direccion de envio</p>
              <p>{data.address.addressLine1} </p>
              <p> {data.address.addressLine2 && data.address.addressLine2}</p>
              <p>{data.address.city}</p>
              <p>{data.address.state}</p>
              <p>{data.address.postalCode}</p>
              <p>{data.address.country}</p>
            </div>

            <div className="flex flex-col text-sm">
              <p className="font-semibold">Metodo de envio</p>
              <p>Standard - Gratis</p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col justify-between items-center w-full mb-5 
        gap-3 sm:flex-row md:w-[600px] md:gap-0
        "
        >
          <Link
            className="text-white bg-black py-4 text-sm rounded-md px-5 tracking-tight
          font-semibold uppercase
          "
            to="/products"
          >
            Seguir comprando
          </Link>
        </div>
      </main>
    </div>
  );
};
