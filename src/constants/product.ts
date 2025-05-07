import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["chocolate", "fruity", "tropical", "caramel"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  image_url: z.string().url("Invalid URL"),
  stock: z.coerce.number().min(1, "Stock must be greater than 0"),
});
