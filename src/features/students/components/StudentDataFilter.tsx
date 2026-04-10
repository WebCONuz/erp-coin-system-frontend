import { Search, X, ArrowUpDown, Plus, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitle } from "../../../components/shared/title";

interface StudentFilterProps {
  onSearch: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onClassFilter: (value: string) => void;
  onClear: () => void;
  onAddStudent: () => void;
  onImportExcel: () => void;
}

export const StudentDataFilter = ({
  onSearch,
  onPhoneChange,
  onClassFilter,
  onClear,
  onAddStudent,
  onImportExcel,
}: StudentFilterProps) => {
  return (
    <div className="w-full space-y-3 py-4">
      {/* 1-QATOR: Sarlavha va Harakat tugmalari */}
      <div className="flex items-center justify-between">
        <DashboardTitle title="O'quvchilar" />
        <div className="flex items-center gap-2">
          <Button
            onClick={onAddStudent}
            className="bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-bl-lg px-4 h-9 gap-2 transition-all"
          >
            <Plus size={18} />
            Talaba qo'shish
          </Button>
          <Button
            onClick={onImportExcel}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-bl-lg px-4 h-9 gap-2 transition-all"
          >
            <FileSpreadsheet size={18} />
            Exceldan ma'lumot qo'shish
          </Button>
        </div>
      </div>

      {/* 2-QATOR: Filtrlash paneli */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tablar */}
        <Tabs
          defaultValue="active"
          className="bg-white p-0.5 rounded-lg border"
        >
          <TabsList className="bg-transparent border-none gap-1">
            <TabsTrigger
              value="active"
              className="rounded-sm px-3 py-1 data-[state=active]:bg-gray-50 data-[state=active]:shadow-sm text-sm font-medium"
            >
              Faol o'quvchilar
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="rounded-sm px-4 py-1 data-[state=active]:bg-gray-50 data-[state=active]:shadow-sm text-sm font-medium"
            >
              Arxiv
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* O'ng tomondagi filtrlar guruhi */}
        <div className="flex items-center gap-2">
          {/* Kombinatsiyalashgan qidiruv inputi (Name + Phone) */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-200 transition-all">
            <div className="pl-3 text-gray-400">
              <Search size={18} />
            </div>
            <Input
              placeholder="Qidirish..."
              className="border-none focus-visible:ring-0 w-45 h-9 placeholder:text-gray-400"
              onChange={(e) => onSearch(e.target.value)}
            />
            <div className="w-px h-6 bg-gray-200"></div>
            <Input
              placeholder="+998 901234567"
              className="border-none focus-visible:ring-0 w-45 h-9 placeholder:text-gray-400"
              onChange={(e) => onPhoneChange(e.target.value)}
            />
          </div>

          {/* Sinf tanlash */}
          <Select onValueChange={onClassFilter}>
            <SelectTrigger className="w-40 py-4.5 rounded-lg bg-white border-gray-200">
              <SelectValue placeholder="Barcha sinflar" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">Barcha sinflar</SelectItem>
              <SelectItem value="7a">7-A sinf</SelectItem>
              <SelectItem value="8a">8-A sinf</SelectItem>
              <SelectItem value="9a">9-A sinf</SelectItem>
            </SelectContent>
          </Select>

          {/* Saralash (Sort) tugmalari */}
          <div className="flex items-center border border-gray-200 rounded-lg bg-white p-0.5 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7.5 px-3 gap-2 text-xs text-slate-600 hover:bg-slate-50"
            >
              Ism <ArrowUpDown size={14} className="text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7.5 px-3 gap-2 text-xs text-slate-600 hover:bg-slate-50"
            >
              Sinf <ArrowUpDown size={14} className="text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7.5 px-3 gap-2 text-xs text-slate-600 hover:bg-slate-50"
            >
              Coin <ArrowUpDown size={14} className="text-gray-400" />
            </Button>
          </div>

          {/* Tozalash */}
          <Button
            variant="outline"
            onClick={onClear}
            className="h-9 px-4 rounded-lg border-gray-200 text-slate-600 hover:bg-slate-50 gap-2"
          >
            <X size={18} />
            Tozalash
          </Button>
        </div>
      </div>
    </div>
  );
};
