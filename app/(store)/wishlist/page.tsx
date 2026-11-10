import { WishlistView } from "@/components/cart/WishlistView";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Wishlist");

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Wishlist" }]}
        title={
          <>
            Saved <em>Watches</em>
          </>
        }
        intro="The pieces you've set aside. They'll be here when you're ready."
      />
      <Container>
        <WishlistView />
      </Container>
    </>
  );
}
