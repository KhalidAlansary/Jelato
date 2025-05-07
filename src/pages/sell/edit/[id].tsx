"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/constants/categories";
import { productSchema as schema } from "@/constants/product";
import supabase from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormFields = z.infer<typeof schema>;

export default function EditListingPage() {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      const { data, error } = await supabase
        .schema("listings")
        .from("listings")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
  });

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        description: listing.description ?? "",
        price: listing.price,
        stock: listing.stock,
        category: listing.category,
        image_url: listing.image_url ?? "",
      });
    }
  }, [listing, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormFields) => {
      const { error } = await supabase
        .schema("listings")
        .from("listings")
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category,
          image_url: data.image_url,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing", id] });
      toast.success("Listing updated successfully");
      router.push("/sell");
    },
    onError: (error) => {
      toast.error("Failed to update listing");
      console.error(error);
    },
  });

  if (isLoading) {
    return (
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter flavour title"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <span className="text-xs text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your flavour..."
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!errors.category}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <span className="text-xs text-red-500">
                  {errors.category.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  className="pl-9"
                  step="0.01"
                  {...register("price")}
                  aria-invalid={!!errors.price}
                />
              </div>
              {errors.price && (
                <span className="text-xs text-red-500">
                  {errors.price.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register("image_url")}
                aria-invalid={!!errors.image_url}
              />
              {errors.image_url && (
                <span className="text-xs text-red-500">
                  {errors.image_url.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Enter stock quantity"
                {...register("stock")}
                aria-invalid={!!errors.stock}
              />
              {errors.stock && (
                <span className="text-xs text-red-500">
                  {errors.stock.message}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/sell")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || updateMutation.isPending}
              >
                {isSubmitting || updateMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
