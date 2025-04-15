"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, DollarSign } from "lucide-react";

export default function SellPage() {
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Enter flavour title" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe your flavour..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creative">Creative Writing</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Upload Flavour image
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop your flavour file here, or click to browse
                    </p>
                    <Input type="file" className="hidden" />
                  </div>
                </div>

                <Button className="w-full">Submit Flavour</Button>
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
