const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  bag: (
    <>
      <path d="M5.25 8.25h13.5l-1 12H6.25z" />
      <path d="M9 8.25V7a3 3 0 0 1 6 0v1.25" />
    </>
  ),
  heart: (
    <path d="M12 19.5s-7.5-4.35-7.5-9.75A4.13 4.13 0 0 1 12 7.4a4.13 4.13 0 0 1 7.5 2.35c0 5.4-7.5 9.75-7.5 9.75Z" />
  ),
  menu: (
    <>
      <path d="M3.75 8.25h16.5" />
      <path d="M3.75 15.75h16.5" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h15.5" />
      <path d="m14 6.5 5.5 5.5-5.5 5.5" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  chevron: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  trash: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V4.75h5V7" />
      <path d="M6.5 7l.9 12.25h9.2L17.5 7" />
    </>
  ),
  filter: (
    <>
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </>
  ),
  mail: (
    <>
      <rect x="3.25" y="5.75" width="17.5" height="12.5" />
      <path d="m3.75 6.5 8.25 6.25 8.25-6.25" />
    </>
  ),
  phone: (
    <path d="M6.6 3.75h2.6l1.4 4-2 1.5a11 11 0 0 0 5.15 5.15l1.5-2 4 1.4v2.6a1.85 1.85 0 0 1-2 1.85A15.6 15.6 0 0 1 4.75 5.75a1.85 1.85 0 0 1 1.85-2Z" />
  ),
  pin: (
    <>
      <path d="M12 20.75s-6.25-5.6-6.25-10.5a6.25 6.25 0 0 1 12.5 0c0 4.9-6.25 10.5-6.25 10.5Z" />
      <circle cx="12" cy="10.25" r="2.25" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  grid: (
    <>
      <path d="M4.5 4.5h6v6h-6z" />
      <path d="M13.5 4.5h6v6h-6z" />
      <path d="M4.5 13.5h6v6h-6z" />
      <path d="M13.5 13.5h6v6h-6z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />
      <path d="m9 12 2.2 2.2L15.25 10" />
    </>
  ),
  returns: (
    <>
      <path d="M4.75 9.5h10.5a4.25 4.25 0 0 1 0 8.5H9" />
      <path d="m8 5.75-3.75 3.75L8 13.25" />
    </>
  ),
  star: (
    <path d="m12 4 2.45 5.1 5.55.75-4.05 3.85 1 5.5L12 16.55 7.05 19.2l1-5.5L4 9.85l5.55-.75z" />
  ),
  diamond: (
    <>
      <path d="M6.5 4.5h11l3 4.5L12 19.5 3.5 9z" />
      <path d="M3.5 9h17" />
      <path d="m9.5 4.5-1.5 4.5 4 10.5 4-10.5-1.5-4.5" />
    </>
  ),
  truck: (
    <>
      <path d="M2.75 6.75h11v9.5h-11z" />
      <path d="M13.75 10h4l3.5 3.5v2.75h-7.5" />
      <circle cx="7" cy="17.5" r="1.75" />
      <circle cx="17.25" cy="17.5" r="1.75" />
    </>
  ),
  cash: (
    <>
      <rect x="2.75" y="6.25" width="18.5" height="11.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v5" />
      <path d="M18 9.5v5" />
    </>
  ),
  support: (
    <>
      <path d="M4.75 13.5v-1.75a7.25 7.25 0 0 1 14.5 0v1.75" />
      <path d="M4.75 13h2.5v5h-2.5z" />
      <path d="M16.75 13h2.5v5h-2.5z" />
      <path d="M19.25 18c0 1.5-1.5 2.25-4.25 2.25" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: (
    <path d="M13.5 20.5v-7h2.5l.4-3h-2.9V8.7c0-.9.3-1.45 1.55-1.45h1.5V4.6a19 19 0 0 0-2.2-.1c-2.2 0-3.75 1.35-3.75 3.8v2.2H8.1v3h2.5v7" />
  ),
  tiktok: (
    <path d="M14.25 3.75c.35 2.45 1.85 3.95 4.25 4.15v2.85a7.2 7.2 0 0 1-4.15-1.35v5.85a5.35 5.35 0 1 1-5.35-5.35c.3 0 .6.02.9.07v2.95a2.45 2.45 0 1 0 1.6 2.3V3.75z" />
  ),
  whatsapp: (
    <>
      <path d="M4.25 19.75 5.4 15.9A8.25 8.25 0 1 1 8.4 18.75z" />
      <path d="M9 8.6c.2-.45.45-.5.75-.5h.45c.15 0 .35 0 .5.4l.65 1.55c.05.15.05.3-.05.45l-.5.6c.6 1.05 1.45 1.85 2.5 2.4l.6-.55c.15-.1.3-.15.45-.05l1.55.7c.35.15.35.35.35.5v.45c0 .3-.1.6-.55.8-.5.25-1.4.35-2.75-.25a8.4 8.4 0 0 1-3.85-3.85c-.6-1.35-.35-2.3-.0-2.75Z" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 22, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
