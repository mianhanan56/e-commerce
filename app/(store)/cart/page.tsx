import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Your Bag");

export default function CartPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Bag" }]}
        title={
          <>
            Your <em>Bag</em>
          </>
        }
      />
      <Container>
        <CartView />
      </Container>
    </>
  );
}
