import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  handleCreate: () => void;
}
export const HeaderFilter = ({ handleCreate }: Props) => {
  return (
    <nav className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Guruhlar ro'yxati</h3>
          <div className="flex gap-x-3">
            <Tabs
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
            <Select onValueChange={() => console.log("---")}>
              <SelectTrigger className="w-40 h-10 py-5 rounded-lg bg-background border-border text-foreground hover:bg-accent/50 transition-colors">
                <SelectValue placeholder="Barchasi" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border bg-popover text-popover-foreground">
                <SelectItem value="all">Filiallar</SelectItem>
                <SelectItem value="7a">al-Xorazmiy</SelectItem>
                <SelectItem value="8a">Buyuk bilim</SelectItem>
              </SelectContent>
            </Select>
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
  );
};
