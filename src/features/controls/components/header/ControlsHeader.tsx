import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getControlsHeader } from "../../constants";

export const ControlsHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const contolsHeader = getControlsHeader(t);

  return (
    <header className="mt-2">
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
