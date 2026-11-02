import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./EditorialBanner.module.scss";

export function EditorialBanner() {
  return (
    <section className={styles.banner} aria-labelledby="occasion-title">
      <div className={styles.media}>
        <Image
          src="/images/editorial-suit.jpg"
          alt="Man in a white shirt and suspenders adjusting a gold watch at his cuff"
          fill
          sizes="100vw"
          className={styles.image}
        />
      </div>

      <Reveal className={styles.panel}>
        <p className={styles.issue}>
          <span>The Edit</span>
          <span>Issue 04</span>
        </p>
        <h2 id="occasion-title" className={styles.title}>
          Designed for <em>Every</em> Occasion
        </h2>
        <p className={styles.text}>
          The wedding season, the Monday meeting, the long drive north. One watch that reads right
          in every room — pressed cuff or rolled sleeve.
        </p>
        <Button href="/collections" variant="light" withArrow>
          Explore Watches
        </Button>
      </Reveal>
    </section>
  );
}
