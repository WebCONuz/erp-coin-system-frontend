import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { canViewAuditLogs } from "@/ustils";
import { getControlsHeader } from "../../constants";

export const ControlsHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const contolsHeader = getControlsHeader(t, {
    canViewAuditLogs: canViewAuditLogs(user?.role),
  });

  return (
    // Tab'lar ko'paydi — tor ekranda gorizontal scroll (sahifa emas, faqat tab qatori).
    <header className="mt-2 max-w-full overflow-x-auto">
      <Tabs
        value={location.pathname}
        onValueChange={(value) => navigate(value)}
      >
        <TabsList variant="line">
          {contolsHeader.map((item, i) => (
            <TabsTrigger
              key={i}
              value={item.link}
              className="data-[state=active]:after:bg-primary data-[state=active]:text-primary transition-all"
            >
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  );
};
