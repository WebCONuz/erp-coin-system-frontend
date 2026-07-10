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
  //           className="w-64 p-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg"
  //         >
  //           <div className="flex items-start gap-3 mb-3">
  //             <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-950/50 shrink-0">
  //               <UserMinus className="w-4 h-4 text-red-500" />
  //             </div>
  //             <div>
  //               <p className="font-medium text-zinc-900 dark:text-zinc-50">
  //                 Guruhdan chiqarish
  //               </p>
  //               <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
  //                 <span className="font-medium text-zinc-700 dark:text-zinc-300">
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
  //               className="flex-1 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs"
  //             >
  //               Yo'q
  //             </Button>
  //             <Button
  //               size="sm"
  //               onClick={onRemove}
  //               disabled={isRemoving}
  //               className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs"
  //             >
  //               {isRemoving ? "..." : "Ha, chiqarish"}
  //             </Button>
  //           </div>
  //         </PopoverContent>
  //       </Popover>;
};
