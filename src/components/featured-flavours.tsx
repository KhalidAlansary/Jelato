import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";

const featuredFlavours = [
  {
    id: 1,
    title: "Choco Lava Delight",
    description:
      "Rich chocolate ice cream with a molten fudge core and brownie chunks.",
    price: "$5.99",
    category: "Chocolate",
    rating: 4.9,
  },
  {
    id: 2,
    title: "Berry Bliss",
    description:
      "A refreshing mix of strawberry, blueberry, and raspberry swirls.",
    price: "$4.99",
    category: "Fruity",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Tropical Paradise",
    description: "A tropical blend of mango, pineapple, and coconut flavors.",
    price: "$5.49",
    category: "Tropical",
    rating: 4.6,
  },
];
export function FeaturedFlavours() {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Featured Flavours
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredFlavours.map((flavour) => (
            <Card
              key={flavour.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{flavour.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {flavour.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{flavour.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-yellow-500">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{flavour.rating}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-lg font-bold">{flavour.price}</span>
                <Button>Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
