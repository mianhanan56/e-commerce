import { Benefits } from "@/components/home/Benefits";
import { Categories } from "@/components/home/Categories";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { SignatureCollection } from "@/components/home/SignatureCollection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <SignatureCollection />
      <EditorialBanner />
      <Categories />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
}
