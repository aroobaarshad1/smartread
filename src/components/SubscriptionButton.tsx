// components/SubscriptionButton.tsx
"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";

type Props = { isPro: boolean };

const SubscriptionButton = ({ isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handleSubscription}
      variant={isPro ? "default" : "premium"}
      className="w-full mb-4"
    >
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
      {!isPro && (
        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white text-[#41B3A2]">
          PRO
        </span>
      )}
    </Button>
  );
};

export default SubscriptionButton;