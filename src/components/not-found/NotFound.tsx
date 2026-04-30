import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <img src="/not_found.png" alt="not found" className="w-75 mb-2" />
      <h2 className="text-3xl font-extrabold mb-2">Sahifa Topilmadi!</h2>
      <p className="text-gray-400 text-lg max-w-110 text-center leading-6 mb-3">
        Bunday sahifa mavjud emas. Iltimos URL ni tekshirib qayta urinib ko'ring
      </p>
      <Button
        className="bg-primary h-10 px-4 dark:text-white cursor-pointer"
        onClick={() => navigate(-1)}
      >
        Ortga qaytish
      </Button>
    </div>
  );
};
