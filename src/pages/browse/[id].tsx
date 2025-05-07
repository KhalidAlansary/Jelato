import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import supabase from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductPage() {
  const { user, isLoading: userLoading } = useAuth();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const router = useRouter();
  const id = parseInt(router.query.id as string);

  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
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
    enabled: !!id,
  });

  async function purchase() {
    if (!product) {
      setPurchaseError("Product not found");
      return;
    }
    const { error } = await supabase.schema("transactions").rpc("purchase", {
      listing_id: id,
      listing_category: product.category,
    });
    if (error) {
      setPurchaseError(error.message);
      return;
    }
    router.push("/profile");
  }

  async function deactivateListing() {
    if (!product) {
      setDeactivateError("Product not found");
      return;
    }
    const { error } = await supabase
      .schema("listings")
      .from("listings")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      setDeactivateError(error.message);
      return;
    }
    router.push("/sell");
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="alert"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error Loading Product</h1>
          <p className="mb-4 text-red-500">{(error as Error).message}</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !id || userLoading) {
    return (
      <div className="min-h-screen py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={router.back}
            className="mb-8"
            aria-label="Go back to previous page"
          >
            ← Back
          </Button>
          <Card className="w-full">
            <Skeleton className="w-full h-64 rounded-lg mb-6" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-32 mt-4" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="alert"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSeller = user?.id === product.seller_id;

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8"
          aria-label="Go back to previous page"
        >
          ← Back
        </Button>
        <Card className="w-full">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={`${product.title} ice cream flavor`}
              width={400}
              height={256}
              className="w-full h-64 object-cover rounded-lg mb-6 border"
            />
          )}
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{product.title}</CardTitle>
                <CardDescription className="mt-4 text-lg">
                  {product.description}
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="text-lg"
                aria-label={`Category: ${product.category}`}
              >
                {product.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">About this flavour</h3>
              <p className="text-gray-600">{product.description}</p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Stock available: {product.stock}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <div className="flex justify-between items-center w-full">
              <span className="text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {isSeller ? (
                <div className="space-x-2">
                  <Link href={`/sell/edit/${id}`}>
                    <Button variant="outline" size="lg">
                      Edit Listing
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={deactivateListing}
                  >
                    Deactivate Listing
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={purchase}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? "Out of Stock" : "Purchase"}
                </Button>
              )}
            </div>
            {purchaseError && (
              <p className="text-red-500 text-sm w-full text-center">
                {purchaseError}
              </p>
            )}
            {deactivateError && (
              <p className="text-red-500 text-sm w-full text-center">
                {deactivateError}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
