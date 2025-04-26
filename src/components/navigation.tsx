"use client";

import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import supabase from "@/utils/supabase/client";
import {
  Menu,
  Search,
  Wallet,
  IceCreamCone,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navigation() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  async function signout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 text-primary"
          >
            <IceCreamCone className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Jelato</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/browse"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Sell
            </Link>
            <Link
              href="/governance"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Governance
            </Link>
            <Link
              href="/profile"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Profile
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Access site navigation options
            </SheetDescription>
            <nav className="grid gap-6 px-2 py-6">
              <Link href="/browse" className="hover:text-foreground/80">
                Browse
              </Link>
              <Link href="/sell" className="hover:text-foreground/80">
                Sell
              </Link>
              <Link href="/governance" className="hover:text-foreground/80">
                Governance
              </Link>
              <Link href="/profile" className="hover:text-foreground/80">
                Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Flavours..."
              className="pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted"></div>
          ) : user ? (
            <>
              <Link href="/wallet" className="hidden md:flex">
                <Button variant="outline" className="ml-auto hidden md:flex">
                  <Wallet className="mr-2 h-4 w-4" />
                  View Wallet
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="justify-start px-2"
                onClick={signout}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden md:flex">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="hidden md:flex">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
