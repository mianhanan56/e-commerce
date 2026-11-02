import Image from "next/image";
import { Button } from "@/components/ui/Button";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Image
          src="/images/hero-gold.jpg"
          alt="Gold dress watch with a champagne dial resting in low light"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 58vw, 100vw"
          className={styles.image}
        />
        <p className={styles.caption}>
          <span>N°01</span> Regent Two-Tone, 36mm
        </p>
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Autumn / Winter 2026 Collection</p>
        <h1 id="hero-title" className={styles.title}>
          More Than <em>Just</em> a Watch
        </h1>
        <p className={styles.lede}>
          Timepieces chosen for the way a man carries himself — considered proportions, honest
          materials and craftsmanship made to be worn for decades, not seasons.
        </p>
        <div className={styles.ctas}>
          <Button href="/shop" withArrow>
            Explore Collection
          </Button>
          <Button href="/about" variant="outlineLight">
            Discover Our Story
          </Button>
        </div>
        <dl className={styles.stats}>
          <div>
            <dt>Delivered to</dt>
            <dd>120+ cities</dd>
          </div>
          <div>
            <dt>Warranty</dt>
            <dd>1 year</dd>
          </div>
          <div>
            <dt>Rated</dt>
            <dd>4.9 / 5</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
