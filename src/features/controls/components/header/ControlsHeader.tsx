import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contolsHeader } from "../../constants";

export const ControlsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
