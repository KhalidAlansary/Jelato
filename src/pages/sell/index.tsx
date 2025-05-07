"use client";

import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { productSchema as schema } from "@/constants/product";
import { useAuth } from "@/hooks/useAuth";
import supabase from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

type FormFields = z.infer<typeof schema>;

export default function SellPage() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  async function sell(data: FormFields) {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const { error } = await supabase
      .schema("listings")
      .from("listings")
      .insert({
        seller_id: user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        image_url: data.image_url,
        stock: data.stock,
      });

    if (error) {
      console.error("Error inserting listing:", error);
    } else {
      reset();
    }
  }

  return (
    <main className="flex-1 container py-8">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="new">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New Flavour</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>List a New Flavour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(sell)} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="title">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter flavour title"
                      {...register("title")}
                      aria-invalid={!!errors.title}
                    />
                    {errors.title && (
                      <span className="text-xs text-red-500">
                        {errors.title.message as string}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-sm font-medium"
                      htmlFor="description"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your flavour..."
                      {...register("description")}
                      aria-invalid={!!errors.description}
                    />
                    {errors.description && (
                      <span className="text-xs text-red-500">
                        {errors.description.message as string}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="category">
                      Category
                    </Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue=""
                        >
                          <SelectTrigger
                            id="category"
                            aria-invalid={!!errors.category}
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chocolate">Chocolate</SelectItem>
                            <SelectItem value="fruity">Fruity</SelectItem>
                            <SelectItem value="tropical">Tropical</SelectItem>
                            <SelectItem value="caramel">Caramel</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <span className="text-xs text-red-500">
                        {errors.category.message as string}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="price">
                      Price
                    </Label>
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
                        {errors.price.message as string}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      placeholder="Enter image URL"
                      {...register("image_url")}
                      aria-invalid={!!errors.image_url}
                    />
                    {errors.image_url && (
                      <span className="text-xs text-red-500">
                        {errors.image_url.message as string}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="stock">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="Enter stock quantity"
                      {...register("stock")}
                      aria-invalid={!!errors.stock}
                    />
                    {errors.stock && (
                      <span className="text-xs text-red-500">
                        {errors.stock.message as string}
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Flavour"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Creative Story Generator</span>
                    <Badge>Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate engaging short stories with complex characters and
                    plot twists.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">$0.1</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
