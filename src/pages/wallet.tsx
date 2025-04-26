"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  History,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProtectedRoute } from "@/components/protected-route";

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Wallet</h1>
            <p className="text-muted-foreground">
              Manage your funds and view transaction history
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$5.00</div>
                <p className="text-muted-foreground mt-2">
                  Available for purchases and transactions
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    document.getElementById("deposit-form")?.focus()
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Funds
                </Button>
              </CardFooter>
            </Card>

            {/* Deposit Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Deposit Funds
                </CardTitle>
                <CardDescription>Add to your wallet balance</CardDescription>
              </CardHeader>
              <form>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount">Amount (USD)</Label>
                    <Input
                      id="deposit-form"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Deposit
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "tx1",
                    type: "deposit",
                    description: "Deposit to wallet",
                    date: new Date(),
                    amount: 1.25,
                  },
                  {
                    id: "tx2",
                    type: "purchase",
                    description: "Purchase NFT #1234",
                    date: new Date(Date.now() - 86400000),
                    amount: 0.85,
                  },
                  {
                    id: "tx3",
                    type: "sale",
                    description: "Sale of artwork",
                    date: new Date(Date.now() - 172800000),
                    amount: 2.5,
                  },
                ].map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.type === "deposit" ? (
                        <div className="bg-green-100 p-2 rounded-full">
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        </div>
                      ) : transaction.type === "purchase" ? (
                        <div className="bg-red-100 p-2 rounded-full">
                          <ArrowDownLeft className="h-5 w-5 text-red-600" />
                        </div>
                      ) : (
                        <div className="bg-blue-100 p-2 rounded-full">
                          <ArrowUpRight className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date.toLocaleDateString()} at{" "}
                          {transaction.date.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          transaction.type === "deposit" ||
                          transaction.type === "sale"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "deposit" ||
                        transaction.type === "sale"
                          ? "+"
                          : "-"}
                        {transaction.amount.toFixed(2)} $
                      </span>
                      <Badge
                        variant={
                          transaction.type === "deposit"
                            ? "outline"
                            : transaction.type === "purchase"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {transaction.type === "deposit"
                          ? "Deposit"
                          : transaction.type === "purchase"
                            ? "Purchase"
                            : "Sale"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  );
}
