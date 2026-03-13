import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { BaseButton } from "../Common/Buttons";
import { useRouter } from "next/navigation";

const OrderSummary = () => {
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  return (
    <div className="lg:max-w-[455px] w-full flex flex-col">
      {/* TITLE */}
      <h3 className="text-xl font-semibold text-dark mb-6">
        Resumen de la orden
      </h3>

      {/* BOX */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* TOTAL */}
          <div className="flex items-center justify-between pt-5 mb-5">
            <p className="font-medium text-lg text-dark">Total</p>

            <p className="font-medium text-lg text-dark text-right">
              ${totalPrice}
            </p>
          </div>

          {/* BUTTON */}
          <BaseButton
            type="button"
            onClick={() => router.push("/register-sale")}
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Continuar
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
