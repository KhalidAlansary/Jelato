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
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const featuredFlavours = [
  {
    id: 1,
    title: "Choco Lava Delight",
    description:
      "Rich chocolate ice cream with a molten fudge core and brownie chunks.",
    price: "$5.99",
    category: "Chocolate",
    rating: 4.9,
    details:
      "Indulge in the ultimate chocolate experience! Our Choco Lava Delight features a creamy chocolate base, a gooey molten fudge center, and generous brownie chunks. Perfect for true chocolate lovers seeking a decadent treat.",
    ingredients: ["Milk", "Cocoa", "Fudge", "Brownie Chunks", "Sugar", "Cream"],
    allergy: "Contains dairy, eggs, and gluten.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Berry Bliss",
    description:
      "A refreshing mix of strawberry, blueberry, and raspberry swirls.",
    price: "$4.99",
    category: "Fruity",
    rating: 4.8,
    details:
      "Enjoy a burst of summer with Berry Bliss! This flavor combines the sweetness of strawberries, the tartness of raspberries, and the juiciness of blueberries for a refreshing, fruity delight.",
    ingredients: [
      "Milk",
      "Strawberries",
      "Blueberries",
      "Raspberries",
      "Sugar",
      "Cream",
    ],
    allergy: "Contains dairy.",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Tropical Paradise",
    description: "A tropical blend of mango, pineapple, and coconut flavors.",
    price: "$5.49",
    category: "Tropical",
    rating: 4.6,
    details:
      "Escape to paradise! Tropical Paradise is a creamy blend of mango, pineapple, and coconut, transporting you to a sunny beach with every bite.",
    ingredients: ["Milk", "Mango", "Pineapple", "Coconut", "Sugar", "Cream"],
    allergy: "Contains dairy and coconut.",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const product = featuredFlavours.find((flavour) => flavour.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        <Button variant="ghost" onClick={() => router.back()} className="mb-8">
          ← Back
        </Button>
        <Card className="w-full">
          {product.image && (
            <Image
              src={product.image}
              alt={product.title}
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
              <Badge variant="secondary" className="text-lg">
                {product.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-yellow-500 mb-6">
              <StarIcon className="h-6 w-6 fill-current" />
              <span className="text-xl font-medium">{product.rating}</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">About this flavour</h3>
              <p className="text-gray-600">{product.details}</p>
              <h4 className="text-lg font-semibold mt-4">Ingredients</h4>
              <ul className="list-disc list-inside text-gray-500">
                {product.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
              <p className="text-sm text-red-500 mt-2">{product.allergy}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-6">
            <span className="text-2xl font-bold">{product.price}</span>
            <Button size="lg">Add to Cart</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
