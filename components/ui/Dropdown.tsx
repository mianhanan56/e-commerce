"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "./Dropdown.module.scss";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  className?: string;
};

// Styled single-select listbox: arrow keys, Home/End, Enter/Space, Escape, outside click.
export function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: Props<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const openMenu = () => {
    setActive(selected);
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const choose = (i: number) => {
    if (options[i].value !== value) onChange(options[i].value);
    close();
  };

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      " ": () => choose(active),
      Escape: () => close(),
    };
    if (e.key === "Tab") return close(false);
    if (!keys[e.key]) return;
    e.preventDefault();
    keys[e.key]();
  };

  return (
    <div
      ref={rootRef}
      className={[styles.root, open && styles.open, className].filter(Boolean).join(" ")}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKey}
      >
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{options[selected].label}</span>
        <Icon name="chevron" size={16} className={styles.chevron} />
      </button>

      <ul
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        className={styles.menu}
        onKeyDown={onListKey}
      >
        {options.map((o, i) => (
          <li
            key={o.value}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === selected}
            className={`${styles.option} ${i === active ? styles.active : ""}`}
            onPointerEnter={() => setActive(i)}
            onClick={() => choose(i)}
          >
            {o.label}
            {i === selected && <Icon name="check" size={14} className={styles.check} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
