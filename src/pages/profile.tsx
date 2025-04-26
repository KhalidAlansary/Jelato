"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon, IceCream, History, Settings } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="flex-1 container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">John&apos;s Ice Cream</h1>
            <p className="text-muted-foreground">Joined December 2023</p>
            <div className="flex items-center gap-2 mt-2">
              <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>4.9 Rating</span>
              <span className="text-muted-foreground">• 50 Reviews</span>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </div>

        <Tabs defaultValue="activity">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

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
                    <label className="text-sm font-medium">Display Name</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      defaultValue="John's Ice Cream"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Email Notifications
                    </label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span>New flavour releases</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span>New reviews</span>
                      </label>
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
  );
}
