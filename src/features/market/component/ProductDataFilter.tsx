import { Search, X, Plus } from "lucide-react";
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
import { DashboardTitle } from "@/components/shared/title";

interface StudentFilterProps {
  onSearch: (value: string) => void;
  onAddCategory: () => void;
  filterByCategory: (value: string) => void;
  onAddGift: () => void;
  onClear: () => void;
}

export const ProductDataFilter = ({
  onSearch,
  onAddCategory,
  filterByCategory,
  onAddGift,
  onClear,
}: StudentFilterProps) => {
  return (
    <div className="w-full space-y-3 py-4">
      {/* 1-QATOR: Sarlavha va Harakat tugmalari */}
      <div className="flex items-center justify-between">
        <DashboardTitle title="Sovg'alar" />
        <div className="flex items-center gap-2">
          <Button
            onClick={onAddGift}
            className="bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Sovg'a qo'shish</span>
          </Button>
          <Button
            onClick={onAddCategory}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 h-9 gap-2 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Kategoriya qo'shish</span>
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
              Faol sovg'alar
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="rounded-md px-4 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium text-muted-foreground transition-all"
            >
              Arxiv
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* O'ng tomondagi filtrlar guruhi */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Kategoriya tanlash */}
          <Select onValueChange={filterByCategory}>
            <SelectTrigger className="w-40 py-4.5 rounded-lg bg-background border-border text-foreground hover:bg-accent/50 transition-colors">
              <SelectValue placeholder="Barcha sovg'alar" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-border bg-popover text-popover-foreground">
              <SelectItem value="all">Barcha sovg'alar</SelectItem>
              <SelectItem value="7a">O'quv qurollari</SelectItem>
              <SelectItem value="8a">Kitoblar</SelectItem>
              <SelectItem value="9a">Sport tovarlari</SelectItem>
              <SelectItem value="10a">Texnika</SelectItem>
            </SelectContent>
          </Select>

          {/* Tozalash */}
          <Button
            variant="outline"
            onClick={onClear}
            className="h-9 px-3 rounded-lg border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-all gap-2"
          >
            <X size={16} />
            <span className="hidden md:inline">Tozalash</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
