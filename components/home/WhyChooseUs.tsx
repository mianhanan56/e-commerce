import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./WhyChooseUs.module.scss";

const reasons = [
  {
    title: "Quality Products",
    text: "Every watch is inspected by hand before it leaves our studio.",
  },
  {
    title: "Carefully Selected Designs",
    text: "A short, edited range — no filler, no fast fashion.",
  },
  { title: "Reliable Delivery", text: "Insured, tracked shipping to over 120 cities." },
  { title: "Customer Satisfaction", text: "7-day exchange and a full year of warranty cover." },
];

export function WhyChooseUs() {
  return (
    <section id="why" className={styles.section} aria-labelledby="why-title">
      <div className={styles.inner}>
        <Reveal className={styles.media}>
          <Image
            src="/images/why-minimal.jpg"
            alt="Minimal silver watch with a brown leather strap resting on dark stone"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={styles.image}
          />
        </Reveal>

        <div className={styles.content}>
          <Reveal>
            <SectionHeading
              id="why-title"
              eyebrow="Our Promise"
              title={
                <>
                  Why Choose <em>WAQT</em>
                </>
              }
            />
          </Reveal>
          <ol className={styles.list}>
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i as 0 | 1 | 2 | 3} className={styles.item}>
                <span className={styles.num}>0{i + 1}</span>
                <div>
                  <h3 className={styles.title}>{r.title}</h3>
                  <p className={styles.text}>{r.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
