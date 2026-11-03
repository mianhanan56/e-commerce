import ui from "./Admin.module.scss";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ eyebrow, title, subtitle, actions }: Props) {
  return (
    <header className={ui.header}>
      <div>
        {eyebrow && <p className={ui.eyebrow}>{eyebrow}</p>}
        <h1 className={ui.title}>{title}</h1>
        {subtitle && <p className={ui.subtitle}>{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}
