'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { ArrowLeft, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CashOutPage() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const router = useRouter();

  const coins = 12540;
  const conversionRate = 1000;
  const usd = (coins / conversionRate).toFixed(2);
  const cooldown = 12;
  const verified = true;

  const transactions = [
    { id: 1, amount: "$10.00", date: "Oct 01, 2025", status: "Paid" },
    { id: 2, amount: "$15.00", date: "Sep 01, 2025", status: "Approved" },
    { id: 3, amount: "$10.00", date: "Aug 01, 2025", status: "Rejected" },
  ];

  const renderForm = () => {
    if (selectedMethod === "paypal") {
      return (
        <div className="space-y-3">
          <label className="text-sm text-gray-400">PayPal Email</label>
          <Input type="email" placeholder="you@example.com" className="bg-[#1E1E1E] border-gray-700 text-white" />
        </div>
      );
    }
    if (selectedMethod === "cashapp") {
      return (
        <div className="space-y-3">
          <label className="text-sm text-gray-400">Cash App Username</label>
          <Input type="text" placeholder="$yourcashapp" className="bg-[#1E1E1E] border-gray-700 text-white" />
        </div>
      );
    }
    if (selectedMethod === "bank") {
      return (
        <div className="space-y-3">
          <label className="text-sm text-gray-400">Account Holder Name</label>
          <Input type="text" placeholder="Full Name" className="bg-[#1E1E1E] border-gray-700 text-white" />
          <label className="text-sm text-gray-400">Routing Number</label>
          <Input type="text" placeholder="123456789" className="bg-[#1E1E1E] border-gray-700 text-white" />
          <label className="text-sm text-gray-400">Account Number</label>
          <Input type="text" placeholder="000123456789" className="bg-[#1E1E1E] border-gray-700 text-white" />
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
        <Header />
        <main className="container mx-auto max-w-md px-4 pt-20 sm:pt-24 flex-1 pb-16 md:pb-24">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="text-white/70 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>
            <div className="flex items-center gap-4 mb-8">
                <Wallet
                    className="h-10 w-10 text-primary"
                    style={{ filter: 'drop-shadow(0 0 10px hsla(var(--primary), 0.7))' }}
                />
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Cash Out</h1>
                    <p className="text-md sm:text-lg text-white/70">
                        Convert your earned coins to real money.
                    </p>
                </div>
            </div>
      <Card className="w-full max-w-md bg-[#121212] border border-gray-800 rounded-2xl shadow-2xl p-6">
        <Tabs defaultValue="cashout">
          <TabsList className="grid grid-cols-2 bg-[#1E1E1E] rounded-xl mb-4">
            <TabsTrigger value="cashout">Cash Out</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="cashout">
            <div
              className="text-center mb-6"
            >
              <h1 className="text-2xl font-bold mb-1">💸 Cash Out Your Coins</h1>
              <p className="text-sm text-gray-400">
                Convert your earned coins to real money
              </p>
            </div>

            <CardContent className="bg-[#1E1E1E] p-4 rounded-xl mb-6 text-center">
              <p className="text-lg">Your Balance:</p>
              <p className="text-4xl font-extrabold text-amber-400">
                {coins.toLocaleString()} 🪙
              </p>
              <p className="text-gray-400 mt-1">1,000 coins = $1 USD</p>
            </CardContent>

            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">
                Amount to Cash Out (Coins)
              </label>
              <Input
                type="number"
                className="bg-[#1E1E1E] border-gray-700 text-white"
                defaultValue={10000}
              />
              <p className="mt-1 text-right text-gray-400">≈ ${usd} USD</p>
            </div>

            {cooldown > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl text-center py-2 mb-3 text-sm text-red-400">
                🕓 Next cash-out available in {cooldown} days
              </div>
            )}

            {!verified && (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl text-center py-2 mb-3 text-sm text-yellow-400">
                ⚠️ Account not verified — please verify before cashing out.
              </div>
            )}

            <Button
              onClick={() => setShowPayoutModal(true)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black text-lg font-semibold rounded-xl py-6 mt-2"
            >
              Select Payout Method
            </Button>

            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>Minimum: 10,000 coins ($10)</p>
              <p>Cooldown: 30 days per withdrawal</p>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Progress to next cash-out:</p>
              <Progress value={(coins / 10000) * 100} className="bg-gray-700 h-2" />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <h2 className="text-xl font-bold mb-3">📜 Cash Out History</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-[#1E1E1E] p-3 rounded-xl border border-gray-800 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-white">{tx.amount}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      tx.status === "Paid"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "Rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
        <DialogContent className="bg-[#1a1a1a] border border-gray-800 text-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center mb-2">
              {selectedMethod ? `Link ${selectedMethod.toUpperCase()} Account` : "Select Payout Method"}
            </DialogTitle>
          </DialogHeader>

          {!selectedMethod ? (
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={() => setSelectedMethod("paypal")} className="bg-blue-500 hover:bg-blue-400 w-full rounded-xl py-3 text-black font-semibold">
                PayPal
              </Button>
              <Button onClick={() => setSelectedMethod("cashapp")} className="bg-green-500 hover:bg-green-400 w-full rounded-xl py-3 text-black font-semibold">
                Cash App
              </Button>
              <Button onClick={() => setSelectedMethod("bank")} className="bg-gray-500 hover:bg-gray-400 w-full rounded-xl py-3 text-black font-semibold">
                Bank Transfer
              </Button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {renderForm()}
              <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl py-3">
                Save & Continue
              </Button>
              <Button variant="ghost" onClick={() => setSelectedMethod(null)} className="text-gray-400 w-full">
                ← Back to Methods
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
    </div>
  );
}
