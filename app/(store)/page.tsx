import { Benefits } from "@/components/home/Benefits";
import { FeaturedWatches } from "@/components/home/FeaturedWatches";
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedWatches />
      <WhyChooseUs />
    </>
  );
}
