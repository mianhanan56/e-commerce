import type { Metadata } from "next";
import { TrackOrder } from "@/components/track/TrackOrder";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of your WAQT order with your order number.",
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Care"
        title={
          <>
            Track your <em>order</em>
          </>
        }
        intro="Enter the order number from your confirmation — it starts with WQ."
        crumbs={[{ label: "Help", href: "/help/shipping" }, { label: "Track Your Order" }]}
      />
      <TrackOrder />
    </>
  );
}
