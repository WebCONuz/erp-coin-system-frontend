import { Plus, FileSpreadsheet, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";
import { ControlledInput } from "@/components/controls";
import { useFilter } from "../hooks";
import { Form } from "@/components/ui/form";

export const TeacherDataFilter = () => {
  const { form } = useFilter();

  return (
    <Form {...form}>
      <div className="w-full space-y-3 py-4">
        {/* 1-QATOR: Sarlavha va Harakat tugmalari */}
        <div className="flex items-center justify-between">
          <DashboardTitle title="O'qituvchilar" />
          <div className="flex items-center gap-2">
            <Button
              onClick={() => "1+++"}
              className="bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">O'qituvchi qo'shish</span>
            </Button>
            <Button
              onClick={() => "2+++"}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet size={18} />
              <span className="hidden sm:inline">Exceldan yuklash</span>
            </Button>
          </div>
        </div>

        {/* 2-QATOR: Filtrlash paneli */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Tablar */}
          <Tabs
            defaultValue="active"
            className="bg-muted/50 p-1 rounded-lg border border-border"
          >
            <TabsList className="bg-transparent border-none gap-1 h-8">
              <TabsTrigger
                value="active"
                className="rounded-md px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
              >
                Faol o'qituvchilar
              </TabsTrigger>
              <TabsTrigger
                value="archive"
                className="rounded-md px-4 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
              >
                Arxiv
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Qidiruv */}
          <div className="relative">
            <SearchIcon className="absolute z-2 left-2.5 top-1/2 -translate-y-1/2 text-primary/40 dark:text-gray-600" />
            <ControlledInput
              control={form.control}
              placeholder="Qidirish"
              name="search"
              inputClassName="pl-7 rounded-lg h-10 border border-gray-300 min-w-75"
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
