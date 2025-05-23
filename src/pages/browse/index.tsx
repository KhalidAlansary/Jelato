"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, type Category } from "@/constants/categories";
import supabase from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Listing = Database["listings"]["Tables"]["listings"]["Row"];
type sortMethod = "recent" | "price-low" | "price-high";

export default function BrowsePage() {
  const [category, setCategory] = useState<Category>("chocolate");
  const [sortBy, setSortBy] = useState<sortMethod>("recent");

  const { data, isLoading, error } = useQuery({
    queryKey: [`listings_${category}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("listings")
        .from(`listings_${category}`)
        .select();
      if (error) throw error;
      return data;
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const filteredListings = data?.filter(
    (listing) =>
      listing.stock > 0 &&
      listing.is_active &&
      listing.title.toLowerCase().includes(query?.toLowerCase() ?? "") &&
      listing.category === category,
  );

  let sortedListings;
  if (sortBy === "recent") {
    sortedListings = filteredListings?.reverse();
  } else if (sortBy === "price-low") {
    sortedListings = filteredListings?.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    sortedListings = filteredListings?.sort((a, b) => b.price - a.price);
  }

  return (
    <main className="flex-1 container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-6" aria-label="Filter options">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" aria-hidden="true" />
              Filters
            </h2>
            <div className="space-y-2">
              <Label htmlFor="category-select" className="text-sm font-medium">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as Category)}
              >
                <SelectTrigger
                  id="category-select"
                  aria-label="Select category"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort-select" className="text-sm font-medium">
                Sort By
              </Label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as sortMethod)}
              >
                <SelectTrigger id="sort-select" aria-label="Select sort option">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Flavours Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <Form className="flex gap-2 w-full max-w-md" action="/browse">
              <Input
                name="q"
                placeholder="Search flavours..."
                className="flex-1"
                aria-label="Search flavours"
              />
              <Button aria-label="Search">Search</Button>
            </Form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <div className="w-full h-40 bg-muted animate-pulse rounded-lg mb-4" />
                    <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="h-4 w-1/4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                  </CardFooter>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500">
                Error loading listings
              </div>
            ) : sortedListings ? (
              sortedListings.map((listing: Listing) => (
                <Card key={listing.id} className="flex flex-col">
                  <CardHeader>
                    {listing.image_url && (
                      <Image
                        src={listing.image_url}
                        alt={listing.title}
                        width={400}
                        height={160}
                        className="w-full h-40 object-cover rounded-lg mb-4 border"
                      />
                    )}
                    <CardTitle className="flex justify-between items-start gap-2">
                      <span>{listing.title}</span>
                      <Badge variant="secondary">{listing.category}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {listing.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Stock: {listing.stock}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Seller ID: {listing.seller_id}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-lg font-bold">${listing.price}</span>
                    <Link href={`/browse/${listing.id}`}>
                      <Button className="cursor-pointer">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                No listings found
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
