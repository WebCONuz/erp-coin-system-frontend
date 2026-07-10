import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, SearchIcon } from "lucide-react";
import { ControlledInput } from "@/components/controls";
import { useFilter } from "../../hooks";
import { Form } from "@/components/ui/form";

interface Props {
  handleCreate: () => void;
}
export const HeaderFilter = ({ handleCreate }: Props) => {
  const { form } = useFilter();
  const currentTab = form.watch("status");

  return (
    <Form {...form}>
      <nav className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Guruhlar ro'yxati</h3>
            <div className="flex gap-x-3">
              <Tabs
                value={currentTab}
                onValueChange={(value) => form.setValue("status", value)}
                defaultValue="active"
                className="bg-muted/50 p-1 rounded-lg border border-border"
              >
                <TabsList className="bg-transparent border-none gap-1 h-8">
                  <TabsTrigger
                    value="active"
                    className="rounded-md px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
                  >
                    Faol
                  </TabsTrigger>
                  <TabsTrigger
                    value="archive"
                    className="rounded-md px-4 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
                  >
                    Arxiv
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative">
                <SearchIcon className="absolute z-2 left-2.5 top-1/2 -translate-y-1/2 text-primary/40 dark:text-gray-600" />
                <ControlledInput
                  control={form.control}
                  placeholder="Guruh nomi"
                  name="search"
                  inputClassName="pl-7 rounded-lg h-10 border border-gray-300 min-w-75"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreate}
            className="bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-lg px-4 h-10 gap-2 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Guruh qo'shish</span>
          </Button>
        </div>
      </nav>
    </Form>
  );
};
