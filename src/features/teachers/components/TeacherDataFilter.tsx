import { Search, Plus, FileSpreadsheet, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "@/components/shared/title";

interface StudentFilterProps {
  onSearch: (value: string) => void;
  addTeacher: () => void;
  importExcel: () => void;
  exportTeacherData: () => void;
}

export const TeacherDataFilter = ({
  onSearch,
  addTeacher,
  importExcel,
  exportTeacherData,
}: StudentFilterProps) => {
  return (
    <div className="w-full space-y-3 py-4">
      {/* 1-QATOR: Sarlavha va Harakat tugmalari */}
      <div className="flex items-center justify-between">
        <DashboardTitle title="O'qituvchilar" />
        <div className="flex items-center gap-2">
          <Button
            onClick={exportTeacherData}
            className="bg-background text-gray-700 dark:text-gray-100 rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            onClick={addTeacher}
            className="bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">O'qituvchi qo'shish</span>
          </Button>
          <Button
            onClick={importExcel}
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
        <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-sm">
          <div className="pl-3 text-muted-foreground/60">
            <Search size={18} />
          </div>
          <Input
            placeholder="Qidirish..."
            className="border-none focus-visible:ring-0 w-64 h-9 placeholder:text-muted-foreground/50 bg-transparent dark:bg-[#0A0A0A]"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
