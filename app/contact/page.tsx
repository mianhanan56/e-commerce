import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import styles from "@/components/contact/Contact.module.scss";
import { Faq } from "@/components/help/HelpContent";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/data/help";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit the WAQT studio in Gulberg, Lahore, or reach us by phone, WhatsApp or email.",
};

const channels: { icon: IconName; label: string; value: string; href?: string; note?: string }[] = [
  {
    icon: "pin",
    label: "Studio",
    value: "Studio 4, MM Alam Road, Gulberg III, Lahore",
    href: "https://maps.google.com/?q=MM+Alam+Road+Gulberg+III+Lahore",
  },
  { icon: "phone", label: "Phone", value: "+92 300 000 0000", href: "tel:+923000000000" },
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: "+92 300 000 0000",
    href: "https://wa.me/923000000000",
    note: "Fastest — usually within the hour",
  },
  { icon: "mail", label: "Email", value: "hello@waqt.pk", href: "mailto:hello@waqt.pk" },
  { icon: "clock", label: "Hours", value: "Mon – Sat, 10am – 8pm", note: "Closed Sundays" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="We're here to help"
        title={
          <>
            Get in <em>touch</em>
          </>
        }
        intro="Questions about a watch, an order or a gift? Our team in Lahore answers every message personally."
        crumbs={[{ label: "Contact" }]}
      />

      <section className={styles.main}>
        <Reveal as="div" className={styles.details}>
          <ul className={styles.channels}>
            {channels.map((c) => (
              <li key={c.label} className={styles.channel}>
                <Icon name={c.icon} size={22} className={styles.channelIcon} />
                <div>
                  <p className={styles.channelLabel}>{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className={styles.channelValue}
                      {...(c.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className={styles.channelValue}>{c.value}</p>
                  )}
                  {c.note && <p className={styles.channelNote}>{c.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" delay={1} className={styles.formCard}>
          <h2 className={styles.formTitle}>Send us a message</h2>
          <p className={styles.formIntro}>We reply within one working day.</p>
          <ContactForm />
        </Reveal>
      </section>

      <section className={styles.faq} aria-labelledby="contact-faq-title">
        <div className={styles.faqInner}>
          <div>
            <p className={styles.eyebrow}>Before you write</p>
            <h2 id="contact-faq-title" className={styles.faqTitle}>
              Common <em>questions</em>
            </h2>
            <Link href="/help/faq" className={styles.faqLink}>
              View all FAQs <Icon name="arrow" size={16} />
            </Link>
          </div>
          <Faq items={faqs.slice(0, 4)} />
        </div>
      </section>
    </>
  );
}
