"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { StarIcon, Filter } from "lucide-react";
import { useState } from "react";

const flavours = [
  {
    id: 1,
    title: "Choco Lava Delight",
    description:
      "Rich chocolate ice cream with a molten fudge core and brownie chunks.",
    price: 5.99,
    category: "Chocolate",
    rating: 4.9,
    seller: "SweetTreats",
  },
  {
    id: 2,
    title: "Berry Bliss",
    description:
      "A refreshing mix of strawberry, blueberry, and raspberry swirls.",
    price: 4.99,
    category: "Fruity",
    rating: 4.8,
    seller: "BerryWorld",
  },
  {
    id: 3,
    title: "Tropical Paradise",
    description: "A tropical blend of mango, pineapple, and coconut flavors.",
    price: 5.49,
    category: "Tropical",
    rating: 4.6,
    seller: "TropiCool",
  },
  {
    id: 4,
    title: "Caramel Crunch",
    description:
      "Creamy caramel ice cream with crunchy toffee bits and caramel swirls.",
    price: 5.99,
    category: "Caramel",
    rating: 4.8,
    seller: "CaramelKing",
  },
];

export default function BrowsePage() {
  const [priceRange, setPriceRange] = useState([0, 10]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-64 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chocolate">Chocolate</SelectItem>
                <SelectItem value="fruity">Fruity</SelectItem>
                <SelectItem value="tropical">Tropical</SelectItem>
                <SelectItem value="caramel">Caramel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range ($)</label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10}
              step={0.1}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0].toFixed(2)}</span>
              <span>${priceRange[1].toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select defaultValue="recent">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
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
          <Input placeholder="Search flavours..." className="max-w-md" />
          <Button>Search</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flavours.map((flavour) => (
            <Card key={flavour.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-start gap-2">
                  <span>{flavour.title}</span>
                  <Badge variant="secondary">{flavour.category}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {flavour.description}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2">
                  <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">{flavour.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Seller: {flavour.seller}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-lg font-bold">${flavour.price}</span>
                <Button>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
