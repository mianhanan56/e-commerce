import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Benefits.module.scss";

const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: "diamond", title: "Premium Quality", text: "Sapphire-coated glass, steel cases" },
  { icon: "truck", title: "Free Delivery", text: "In 5–7 working days" },
  { icon: "cash", title: "Cash on Delivery", text: "Pay when your watch arrives" },
  { icon: "support", title: "Customer Support", text: "Real people, seven days a week" },
];

export function Benefits() {
  return (
    <section className={styles.benefits} aria-label="Store benefits">
      <ul className={styles.list}>
        {benefits.map((b, i) => (
          <Reveal as="li" key={b.title} delay={i as 0 | 1 | 2 | 3} className={styles.item}>
            <Icon name={b.icon} size={28} className={styles.icon} />
            <div>
              <h3 className={styles.title}>{b.title}</h3>
              <p className={styles.text}>{b.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
