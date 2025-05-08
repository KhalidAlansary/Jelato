"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import supabase from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { StarIcon, IceCream, History, Settings, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const firstName = user?.user_metadata.firstName;
  const lastName = user?.user_metadata.lastName;
  const createdAt = new Date(user?.created_at as string).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
    },
  );

  const { data: listings, isLoading } = useQuery({
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

  async function deactivateListing(id: number) {
    const { error } = await supabase
      .schema("listings")
      .from("listings")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      toast.error("Failed to deactivate listing");
      return;
    }
    toast.success("Listing deactivated successfully");
  }

  async function activateListing(id: number) {
    const { error } = await supabase
      .schema("listings")
      .from("listings")
      .update({ is_active: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to activate listing");
      return;
    }
    toast.success("Listing activated successfully");
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
              <div className="flex items-center gap-2 mt-2">
                <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>4.9 Rating</span>
                <span className="text-muted-foreground">• 50 Reviews</span>
              </div>
            </div>
            <Button>Edit Profile</Button>
          </div>

          <Tabs defaultValue="listings">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
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
                  {isLoading ? (
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
                                      deactivateListing(listing.id)
                                    }
                                  >
                                    Deactivate
                                  </Button>
                                ) : (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => activateListing(listing.id)}
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
                    <div className="space-y-4">
                      {/* Activity Items */}
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">
                            Purchased &quot;Choco Lava Delight&quot;
                          </p>
                          <p className="text-sm text-muted-foreground">
                            2 days ago
                          </p>
                        </div>
                        <Badge>$5.99</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">
                            Reviewed &quot;Berry Bliss&quot;
                          </p>
                          <p className="text-sm text-muted-foreground">
                            5 days ago
                          </p>
                        </div>
                        <Badge>5 Stars</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IceCream className="h-5 w-5" />
                    Favorite Flavours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">Choco Lava Delight</p>
                        <p className="text-sm text-muted-foreground">
                          Rich chocolate ice cream with a molten fudge core.
                        </p>
                      </div>
                      <Badge>Chocolate</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">Minty Wonderland</p>
                        <p className="text-sm text-muted-foreground">
                          Cool mint ice cream with dark chocolate chips.
                        </p>
                      </div>
                      <Badge>Mint</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Display Name
                      </Label>
                      <Input
                        type="text"
                        className="w-full mt-1"
                        defaultValue="John's Ice Cream"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Email Notifications
                      </Label>
                      <div className="mt-2 space-y-2">
                        <Label className="flex items-center gap-2">
                          <Input type="checkbox" defaultChecked />
                          <span>New flavour releases</span>
                        </Label>
                        <Label className="flex items-center gap-2">
                          <Input type="checkbox" defaultChecked />
                          <span>New reviews</span>
                        </Label>
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProtectedRoute>
  );
}
