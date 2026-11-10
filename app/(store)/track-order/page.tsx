import { TrackOrder } from "@/components/track/TrackOrder";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Track Your Order",
  description:
    "Check the status of your Zarvonique order with your order number and phone or email.",
  path: "/track-order",
});

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
        intro="Enter the order number from your confirmation — it starts with ZV."
        crumbs={[{ label: "Help", href: "/help/shipping" }, { label: "Track Your Order" }]}
      />
      <TrackOrder />
    </>
  );
}
