import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";

export interface ToolbarTab {
  value: string;
  label: string;
}

interface Props {
  title: string;
  description?: string;
  titleAs?: "h1" | "h2";
  addLabel?: string;
  onAdd?: () => void;
  tabs?: ToolbarTab[];
  tab?: string;
  onTabChange?: (value: string) => void;
  /** O'ng tomondagi filtrlar (qidiruv, select). */
  children?: ReactNode;
}

/**
 * Ro'yxat sahifasining standart sarlavhasi: nom + asosiy amal,
 * ostida holat tablari va filtrlar. Telefonda filtrlar to'liq kenglikda.
 */
export const ListToolbar = ({
  title,
  description,
  titleAs = "h1",
  addLabel,
  onAdd,
  tabs,
  tab,
  onTabChange,
  children,
}: Props) => (
  <div className="w-full space-y-4">
    <div className="flex items-center justify-between gap-3">
      <DashboardTitle title={title} description={description} as={titleAs} />
      {onAdd && (
        <Button
          onClick={onAdd}
          className="h-9 shrink-0 gap-2 px-3.5"
          aria-label={addLabel}
        >
          <Plus className="size-4" aria-hidden />
          <span className="hidden sm:inline">{addLabel}</span>
        </Button>
      )}
    </div>

    {(tabs || children) && (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {tabs && (
          <Tabs value={tab ?? tabs[0]?.value} onValueChange={onTabChange}>
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <TabsList className="h-auto gap-0.5 rounded-xl border bg-card p-1">
                {tabs.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="h-8 flex-none rounded-lg px-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary-soft data-[state=active]:text-primary data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary-soft"
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        )}
        {children && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {children}
          </div>
        )}
      </div>
    )}
  </div>
);
