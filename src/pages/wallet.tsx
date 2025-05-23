"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import supabase from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallet, ArrowUpRight, ArrowDownLeft, History } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
});

type FormFields = z.infer<typeof schema>;

export default function WalletPage() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const {
    data: balance,
    isLoading: balanceIsLoading,
    error: balanceError,
  } = useQuery({
    queryKey: ["balance", user],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data?.balance ?? 0;
    },
  });
  if (balanceError) {
    console.error("Error fetching balance:", balanceError);
  }

  const {
    data: recentTransactions,
    error: transactionsError,
    isLoading: transactionsIsLoading,
  } = useQuery({
    queryKey: ["recentTransactions", user],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .schema("transactions")
        .rpc("recent_transactions");

      if (error) throw error;
      return data;
    },
  });

  async function deposit({ amount }: FormFields) {
    const { data: newBalance, error } = await supabase
      .schema("transactions")
      .rpc("deposit", { amount });

    if (error) {
      console.error("Error depositing funds:", error);
    } else {
      queryClient.setQueryData(["balance", user], newBalance);
      queryClient.invalidateQueries({ queryKey: ["recentTransactions", user] });
      reset();
    }
  }

  if (balanceIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
                <div className="text-4xl font-bold">${balance?.toFixed(2)}</div>
                <p className="text-muted-foreground mt-2">
                  Available for purchases and transactions
                </p>
              </CardContent>
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
              <form onSubmit={handleSubmit(deposit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      {...register("amount")}
                      aria-invalid={errors.amount ? "true" : "false"}
                    />
                    {errors.amount && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Depositing..." : "Deposit"}
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
              {transactionsIsLoading ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Loading transactions...
                  </p>
                </div>
              ) : transactionsError ? (
                <div className="text-center py-4">
                  <p className="text-destructive">Error loading transactions</p>
                </div>
              ) : recentTransactions?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions?.map((transaction, index) => (
                    <div
                      key={`${transaction.transaction_type}-${transaction.transaction_date}-${index}`}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {transaction.transaction_type === "Depositted" ? (
                          <div className="bg-green-100 p-2 rounded-full">
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          </div>
                        ) : transaction.transaction_type === "purchase" ? (
                          <div className="bg-red-100 p-2 rounded-full">
                            <ArrowDownLeft className="h-5 w-5 text-red-600" />
                          </div>
                        ) : (
                          <div className="bg-blue-100 p-2 rounded-full">
                            <ArrowUpRight className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {transaction.transaction_type === "Depositted"
                              ? "Deposit to wallet"
                              : transaction.product_name || "Transaction"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              transaction.transaction_date,
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              transaction.transaction_date,
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            transaction.transaction_type === "Depositted" ||
                            transaction.transaction_type === "sold"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.transaction_type === "Depositted" ||
                          transaction.transaction_type === "sold"
                            ? "+"
                            : "-"}
                          {transaction.transaction_amount.toFixed(2)} $
                        </span>
                        <Badge
                          variant={
                            transaction.transaction_type === "Depositted"
                              ? "outline"
                              : transaction.transaction_type === "purchase"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {transaction.transaction_type === "Depositted"
                            ? "Deposit"
                            : transaction.transaction_type === "purchase"
                              ? "Purchase"
                              : "Sale"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  );
}
