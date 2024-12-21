// "use client";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useForm } from "react-hook-form";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useSearchParams } from "next/navigation";
// import { Value } from "@radix-ui/react-select";
// import { motion } from "framer-motion";
// import { Star } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// export default function ReviewsForm({ locale }: { locale: string }) {
//   const params = useSearchParams();
//   const productID = Number(params.get("productID"));

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <div className="w-full">
//           <Button className="font-medium w-full mb-2" variant={"secondary"}>
//             {locale == "en" ? " Leave a Review " : "أضف تعليق"}
//           </Button>
//         </div>
//       </PopoverTrigger>
//       <PopoverContent>
//         <Form>
//           <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
//             <FormField
//               control={form.control}
//               name="comment"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {" "}
//                     {locale == "en"
//                       ? "  Leave your review here"
//                       : "أضف تعليقك هنا"}
//                   </FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="How would you describe this product"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="comment"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     {" "}
//                     {locale == "en"
//                       ? " Leave your Rating here"
//                       : "أضف تقييمك هنا"}
//                   </FormLabel>
//                   <FormControl>
//                     <Input type="hidden" placeholder="Star Rating" {...field} />
//                   </FormControl>
//                   <div className="flex">
//                     {[1, 2, 3, 4, 5].map((value) => {
//                       return (
//                         <motion.div
//                           className="relative cursor-pointer"
//                           whileTap={{ scale: 0.8 }}
//                           whileHover={{ scale: 1.2 }}
//                           key={value}
//                         >
//                           <Star
//                             key={value}
//                             onClick={() => {
//                               form.setValue("rating", value, {
//                                 shouldValidate: true,
//                               });
//                             }}
//                             className={cn(
//                               "text-primary bg-transparent transition-all duration-300 ease-in-out",
//                               form.getValues("rating") >= value
//                                 ? "fill-primary"
//                                 : "fill-muted"
//                             )}
//                           />
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 </FormItem>
//               )}
//             />
//             <Button
//               disabled={status === "executing"}
//               className="w-full"
//               type="submit"
//             >
//               {status === "executing" ? "Adding Review..." : "Add review"}
//             </Button>
//           </form>
//         </Form>
//       </PopoverContent>
//     </Popover>
//   );
// }
