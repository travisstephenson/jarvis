import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, strokeWidth = 2, ...p }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...p,
  };
}

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 2 4 5v7c0 4.5 3.4 8.5 8 10 4.6-1.5 8-5.5 8-10V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>
);
export const ScanIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
);
export const FileTextIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);
export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
export const LockIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}><polyline points="20 6 9 17 4 12"/></svg>
);
export const CheckCircleIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
export const XIcon = (p: IconProps) => (
  <svg {...base(p)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}><polyline points="9 18 15 12 9 6"/></svg>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}><polyline points="15 18 9 12 15 6"/></svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}><polyline points="6 9 12 15 18 9"/></svg>
);
export const AlertTriangleIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
export const SparklesIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3Z"/><path d="M19 14l-.6 1.8L17 16l1.4.6L19 18l.6-1.4L21 16l-1.4-.6L19 14Z"/><path d="M5 16l-.6 1.8L3 18l1.4.6L5 20l.6-1.4L7 18l-1.4-.6L5 16Z"/></svg>
);
export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
);
export const ZapIcon = (p: IconProps) => (
  <svg {...base(p)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
export const DollarSignIcon = (p: IconProps) => (
  <svg {...base(p)}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
export const ScaleIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
);
