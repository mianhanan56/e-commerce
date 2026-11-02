"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.scss";

type Props = {
  children: React.ReactNode;
  as?: "div" | "section" | "li" | "article";
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
};

export function Reveal({ children, as: Tag = "div", className, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [styles.reveal, styles[`d${delay}`], visible && styles.visible, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref as React.Ref<never>} className={cls}>
      {children}
    </Tag>
  );
}
