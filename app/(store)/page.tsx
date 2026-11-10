import { Benefits } from "@/components/home/Benefits";
import { FeaturedWatches } from "@/components/home/FeaturedWatches";
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEFAULT_DESCRIPTION, HOME_TITLE, organizationJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: HOME_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <Benefits />
      <FeaturedWatches />
      <WhyChooseUs />
    </>
  );
}
