import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Bag", href: "/cart" }, { label: "Checkout" }]}
        title={
          <>
            Secure <em>Checkout</em>
          </>
        }
        intro="Free delivery across Pakistan. Pay in cash when your watch arrives, or by bank transfer."
      />
      <Container>
        <CheckoutView />
      </Container>
    </>
  );
}
