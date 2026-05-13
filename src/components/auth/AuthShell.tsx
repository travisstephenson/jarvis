"use client";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex items-start sm:items-center justify-center py-10 sm:py-16 px-4 bg-[color:var(--color-background)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold m-0">{title}</h1>
          {subtitle && <p className="text-sm text-[color:var(--color-muted-foreground)] mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 rounded-lg border border-[color:var(--color-border-strong)] bg-white px-3 text-[15px] placeholder:text-[color:var(--color-muted-foreground)] focus:border-[color:var(--color-primary)]"
      />
    </label>
  );
}

export function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C33.6 5.8 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C33.6 5.8 29 4 24 4 16.4 4 9.8 8.3 6.3 14.7Z"/>
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.3 2-6.9 2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.7 16.2 44 24 44Z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6 5C40.9 35.6 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5Z"/>
    </svg>
  );
}
