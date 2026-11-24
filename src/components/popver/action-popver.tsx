// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

interface PopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const ActionPopver = ({ isOpen }: PopoverProps) => {
  return <>Popover {String(isOpen)}</>;
  // <Popover open={isOpen} onOpenChange={onOpenChange}>
  //         <PopoverTrigger asChild>
  //          {children}
  //         </PopoverTrigger>
  //         <PopoverContent
  //           align="end"
  //           className="w-64 p-4 bg-card border-border shadow-lg"
  //         >
  //           <div className="flex items-start gap-3 mb-3">
  //             <div className="p-1.5 rounded-full bg-destructive-soft shrink-0">
  //               <UserMinus className="w-4 h-4 text-destructive" />
  //             </div>
  //             <div>
  //               <p className="font-medium text-foreground">
  //                 Guruhdan chiqarish
  //               </p>
  //               <p className="text-muted-foreground mt-0.5">
  //                 <span className="font-medium text-foreground">
  //                   {student.fullName}
  //                 </span>{" "}
  //                 ni guruhdan chiqarasizmi?
  //               </p>
  //             </div>
  //           </div>
  //           <div className="flex gap-2">
  //             <Button
  //               variant="outline"
  //               size="sm"
  //               onClick={() => onOpenChange(false)}
  //               disabled={isRemoving}
  //               className="flex-1 border-border text-foreground hover:bg-muted text-xs"
  //             >
  //               Yo'q
  //             </Button>
  //             <Button
  //               size="sm"
  //               onClick={onRemove}
  //               disabled={isRemoving}
  //               className="flex-1 bg-destructive hover:bg-destructive text-white text-xs"
  //             >
  //               {isRemoving ? "..." : "Ha, chiqarish"}
  //             </Button>
  //           </div>
  //         </PopoverContent>
  //       </Popover>;
};
