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
import supabase from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

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
        .eq("id", parseInt(id as string))
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!id,
  });

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

  if (isLoading || !id) {
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-6">
            <span className="text-2xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            <Button size="lg">Add to Cart</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
