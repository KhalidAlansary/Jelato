"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import supabase from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IceCream, History, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type Listing = Database["listings"]["Tables"]["listings"]["Row"];

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const firstName = user?.user_metadata.firstName;
  const lastName = user?.user_metadata.lastName;
  const createdAt = new Date(user?.created_at as string).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
    },
  );

  const { data: recentActivity, error: recentActivityError } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("transactions")
        .rpc("recent_activity");

      if (error) throw error;
      return data;
    },
  });

  const { data: favouriteFlavours, error: favouriteflavoursError } = useQuery({
    queryKey: ["favouriteFlavours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("transactions")
        .rpc("favourite_flavours");

      if (error) throw error;
      return data;
    },
  });

  const { data: listings, isLoading: isLoadingListings } = useQuery({
    queryKey: ["user-listings", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .schema("listings")
        .from("listings")
        .select()
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  async function toggleListingStatus(id: number, isActive: boolean) {
    const { error } = await supabase
      .schema("listings")
      .from("listings")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      toast.error(`Failed to ${isActive ? "activate" : "deactivate"} listing`);
      return;
    }
    toast.success(
      `Listing ${isActive ? "activated" : "deactivated"} successfully`,
    );

    queryClient.setQueryData<Listing[]>(
      ["user-listings", user?.id],
      (oldData) => {
        return oldData?.map((listing) =>
          listing.id === id ? { ...listing, is_active: isActive } : listing,
        );
      },
    );
  }

  return (
    <ProtectedRoute>
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {firstName} {lastName}
              </h1>
              <p className="text-muted-foreground">Joined on {createdAt}</p>
            </div>
            <Button>Edit Profile</Button>
          </div>

          <Tabs defaultValue="listings">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="favourites">Favourites</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingListings ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 bg-muted rounded-lg mb-2" />
                          <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                          <div className="h-4 w-1/2 bg-muted rounded" />
                        </div>
                      ))}
                    </div>
                  ) : listings?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You haven&apos;t created any listings yet.
                      </p>
                      <Link href="/sell">
                        <Button>Create Your First Listing</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {listings?.map((listing) => (
                        <div
                          key={listing.id}
                          className="flex gap-4 p-4 border rounded-lg"
                        >
                          {listing.image_url && (
                            <Image
                              src={listing.image_url}
                              alt={listing.title}
                              width={100}
                              height={100}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">
                                  {listing.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {listing.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge
                                    variant={
                                      listing.is_active
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {listing.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                  <Badge variant="outline">
                                    ${listing.price}
                                  </Badge>
                                  <Badge variant="outline">
                                    Stock: {listing.stock}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/sell/edit/${listing.id}`}>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </Link>
                                {listing.is_active ? (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      toggleListingStatus(listing.id, false)
                                    }
                                  >
                                    Deactivate
                                  </Button>
                                ) : (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                      toggleListingStatus(listing.id, true)
                                    }
                                  >
                                    Activate
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentActivityError ? (
                      <p className="text-destructive">
                        Failed to load recent activity
                      </p>
                    ) : !recentActivity ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-12 bg-muted rounded-lg" />
                          </div>
                        ))}
                      </div>
                    ) : recentActivity.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No recent activity
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b"
                          >
                            <div>
                              <p className="font-medium">
                                {activity.activity_type === "purchase" &&
                                  "Purchased "}
                                {activity.activity_type === "Added Listing" &&
                                  "Added new listing "}
                                {activity.activity_type === "Deposit" &&
                                  "Deposited "}
                                {activity.product_name &&
                                  `"${activity.product_name}"`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  activity.activity_date,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <Badge>
                              ${activity.activity_amount.toFixed(2)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="favourites" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IceCream className="h-5 w-5" />
                    Favourite Flavours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {favouriteflavoursError ? (
                    <p className="text-destructive">
                      Failed to load favourite flavours
                    </p>
                  ) : !favouriteFlavours ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-muted rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : favouriteFlavours.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No favourite flavours yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {favouriteFlavours.map((flavour, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b"
                        >
                          <div>
                            <p className="font-medium">
                              {flavour.product_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {flavour.product_description}
                            </p>
                          </div>
                          <Badge>{flavour.product_category}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProtectedRoute>
  );
}
