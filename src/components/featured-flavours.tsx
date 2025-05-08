import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import supabase from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function FeaturedFlavours() {
  const { data } = useQuery({
    queryKey: ["featured-flavours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("listings")
        .from("listings")
        .select()
        .order("id", { ascending: false })
        .limit(3);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  const featuredFlavours = data ?? [];

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
              {flavour.image_url && (
                <Image
                  src={flavour.image_url}
                  alt={flavour.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg mb-4 border"
                />
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/product/${flavour.id}`}>
                      <CardTitle className="hover:text-primary transition-colors">
                        {flavour.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="mt-2">
                      {flavour.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{flavour.category}</Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${flavour.price.toFixed(2)}
                </span>
                <Link href={`/browse/${flavour.id}`}>
                  <Button>View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
