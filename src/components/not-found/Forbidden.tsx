import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-2">403 — Ruxsat yo'q</h2>
      <p className="text-gray-400 text-lg max-w-110 text-center leading-6 mb-3">
        Ushbu sahifani ko'rish uchun sizda yetarli huquq mavjud emas
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
