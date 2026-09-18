import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start sm:justify-center px-4 pt-16 pb-10 sm:py-10 bg-bg-primary dark:bg-black">
      <Outlet />
    </div>
  );
}
