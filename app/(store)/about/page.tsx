import Image from "next/image";
import styles from "@/components/about/About.module.scss";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Zarvonique is a Lahore studio choosing men's watches for character and longevity, delivered free across Pakistan.",
  path: "/about",
});

const values: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "diamond",
    title: "Honest materials",
    text: "Steel, sapphire and real leather. If a watch cuts corners where you can't see, we don't stock it.",
  },
  {
    icon: "clock",
    title: "Made to last",
    text: "We choose movements we can service for decades — and we service every watch we sell, for life.",
  },
  {
    icon: "shield",
    title: "Straight dealing",
    text: "Fair prices in rupees, free delivery and cash on delivery. No hidden charges at the door.",
  },
  {
    icon: "support",
    title: "Real people",
    text: "Questions are answered by the same small team that inspects and packs your watch.",
  },
];

const steps = [
  {
    title: "Shortlist",
    text: "We review hundreds of references each season and keep only the ones with proportions that hold up on a real wrist.",
  },
  {
    title: "Wear-test",
    text: "Every candidate is worn for a month — to the office, to weddings, on the motorway — before it earns a place.",
  },
  {
    title: "Inspect",
    text: "Each watch is checked by hand: timekeeping, crown action, bracelet finishing and lume, before it leaves the studio.",
  },
  {
    title: "Deliver",
    text: "Sealed, insured and boxed, with a one-year warranty card and a phone number that a person answers.",
  },
];

const stats = [
  { value: "120+", label: "Cities delivered to" },
  { value: "1 year", label: "Movement warranty" },
  { value: "4.9 / 5", label: "Average client rating" },
  { value: "7 days", label: "Free exchange" },
];

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroMedia}>
          <Image
            src="/images/editorial-suit.jpg"
            alt="Man in a white shirt fastening a gold watch at his cuff"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={styles.image}
          />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.crumbs}>
            <Breadcrumbs crumbs={[{ label: "About Us" }]} />
          </div>
          <p className={styles.eyebrow}>Our Story · Est. Lahore</p>
          <h1 id="about-title" className={styles.heroTitle}>
            Made to keep <em>time</em>
          </h1>
          <p className={styles.lede}>
            We started Zarvonique with a simple belief: a good watch is the one thing a man wears
            every day, so it should be chosen with care — and it shouldn&apos;t cost a fortune to
            own.
          </p>
        </div>
      </section>

      <section className={styles.story} aria-labelledby="story-title">
        <div className={styles.storyInner}>
          <Reveal className={styles.storyLead}>
            <p className={styles.eyebrow}>How it began</p>
            <h2 id="story-title" className={styles.sectionTitle}>
              A small studio on <em>MM Alam Road</em>
            </h2>
          </Reveal>
          <Reveal className={styles.storyText} delay={1}>
            <p>
              Zarvonique began in 2021 at a borrowed desk in Gulberg, with a dozen watches and a
              WhatsApp number. Friends kept asking where to buy something well made that didn&apos;t
              shout — a watch for the office that could also go to a mehndi.
            </p>
            <p>
              We couldn&apos;t find the answer in Pakistan, so we built it: an edited range of
              men&apos;s watches, sourced directly, inspected by hand in Lahore and delivered free
              to your door with cash on delivery.
            </p>
            <p>
              Five years on, the desk is a studio and the dozen watches are a full range — but the
              range is still short on purpose. We would rather sell you one watch you wear for
              twenty years than five you forget in a drawer.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.values} aria-labelledby="values-title">
        <div className={styles.inner}>
          <Reveal>
            <SectionHeading
              id="values-title"
              eyebrow="What we stand for"
              title={
                <>
                  Four things we <em>won&apos;t</em> compromise
                </>
              }
            />
          </Reveal>
          <ul className={styles.valueGrid}>
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i as 0 | 1 | 2 | 3} className={styles.value}>
                <Icon name={v.icon} size={28} className={styles.valueIcon} />
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueText}>{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.process} aria-labelledby="process-title">
        <div className={styles.processInner}>
          <Reveal className={styles.processMedia}>
            <Image
              src="/images/c-classic.jpg"
              alt="Silver dress watch with a brown leather strap on a dark desk"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className={styles.image}
            />
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                id="process-title"
                eyebrow="How we choose"
                title={
                  <>
                    From hundreds to a <em>handful</em>
                  </>
                }
                tone="light"
              />
            </Reveal>
            <ol className={styles.steps}>
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i as 0 | 1 | 2 | 3} className={styles.step}>
                  <span className={styles.stepNum}>0{i + 1}</span>
                  <div>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepText}>{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.stats} aria-label="Zarvonique in numbers">
        <dl className={styles.statGrid}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i as 0 | 1 | 2 | 3} className={styles.stat}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className={styles.visit} aria-labelledby="visit-title">
        <div className={styles.visitInner}>
          <Reveal className={styles.visitMedia}>
            <Image
              src="/images/why-minimal.jpg"
              alt="Minimal silver watch with a leather strap resting on stone"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={styles.image}
            />
          </Reveal>
          <Reveal className={styles.visitContent} delay={1}>
            <p className={styles.eyebrow}>Visit the studio</p>
            <h2 id="visit-title" className={styles.sectionTitle}>
              Try it on <em>in person</em>
            </h2>
            <p className={styles.visitText}>
              Studio 4, MM Alam Road, Gulberg III, Lahore. Open Monday to Saturday, 10am to 8pm.
              Come for a coffee, try the watches on and have your bracelet sized while you wait.
            </p>
            <div className={styles.ctas}>
              <Button href="/shop" variant="dark" withArrow>
                Shop Watches
              </Button>
              <Button href="/contact" variant="outline">
                Plan a Visit
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
