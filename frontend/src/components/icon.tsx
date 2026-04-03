import type { SVGProps } from "react";

type IconName =
  | "wallet"
  | "bolt"
  | "security"
  | "mail"
  | "lock"
  | "eye"
  | "eyeOff"
  | "arrowRight"
  | "grid"
  | "checkCircle"
  | "person"
  | "phone"
  | "reset"
  | "verified"
  | "speed"
  | "upload"
  | "arrowLeft"
  | "help"
  | "receipt"
  | "dashboard"
  | "users"
  | "settings"
  | "admin"
  | "download"
  | "addCircle"
  | "payments"
  | "hourglass"
  | "more"
  | "contactCard"
  | "chevronRight"
  | "bell"
  | "home"
  | "plus"
  | "box"
  | "preview"
  | "userCircle"
  | "basket"
  | "trash"
  | "send"
  | "pdf"
  | "trendUp"
  | "search"
  | "filter"
  | "chevronLeft"
  | "sparkles"
  | "share"
  | "history"
  | "edit";

function BaseIcon({
  children,
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Icon({
  name,
  className
}: {
  name: IconName;
  className?: string;
}) {
  switch (name) {
    case "wallet":
      return (
        <BaseIcon className={className}>
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h10.75A2.75 2.75 0 0 1 19 7.75V9H6.5A2.5 2.5 0 0 0 4 11.5v5A2.5 2.5 0 0 0 6.5 19H19a2 2 0 0 0 2-2v-6.5A1.5 1.5 0 0 0 19.5 9H6.5" />
          <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
        </BaseIcon>
      );
    case "bolt":
      return (
        <BaseIcon className={className}>
          <path d="M13 2 6 13h5l-1 9 8-12h-5l0-8Z" />
        </BaseIcon>
      );
    case "security":
      return (
        <BaseIcon className={className}>
          <path d="M12 3 5 6v5c0 5 3.2 8.4 7 10 3.8-1.6 7-5 7-10V6l-7-3Z" />
          <path d="m9.5 12 1.7 1.7 3.3-3.7" />
        </BaseIcon>
      );
    case "mail":
      return (
        <BaseIcon className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </BaseIcon>
      );
    case "lock":
      return (
        <BaseIcon className={className}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
        </BaseIcon>
      );
    case "eye":
      return (
        <BaseIcon className={className}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </BaseIcon>
      );
    case "eyeOff":
      return (
        <BaseIcon className={className}>
          <path d="m3 3 18 18" />
          <path d="M10.6 6.3A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a17.6 17.6 0 0 1-4.1 4.5" />
          <path d="M6.6 6.7C3.8 8.3 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8" />
        </BaseIcon>
      );
    case "arrowRight":
      return (
        <BaseIcon className={className}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </BaseIcon>
      );
    case "grid":
      return (
        <BaseIcon className={className}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </BaseIcon>
      );
    case "checkCircle":
    case "verified":
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.2 2.2 2.2 4.8-5" />
        </BaseIcon>
      );
    case "person":
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </BaseIcon>
      );
    case "phone":
      return (
        <BaseIcon className={className}>
          <path d="M7 4h3l1 4-2 1.5a15 15 0 0 0 5.5 5.5L16 13l4 1v3a2 2 0 0 1-2.2 2A17 17 0 0 1 5 6.2 2 2 0 0 1 7 4Z" />
        </BaseIcon>
      );
    case "reset":
      return (
        <BaseIcon className={className}>
          <path d="M20 11a8 8 0 1 1-2.3-5.7" />
          <path d="M20 4v5h-5" />
        </BaseIcon>
      );
    case "speed":
      return (
        <BaseIcon className={className}>
          <path d="M4 14a8 8 0 1 1 16 0" />
          <path d="m12 14 4-4" />
          <path d="M12 14 9 9" />
        </BaseIcon>
      );
    case "upload":
      return (
        <BaseIcon className={className}>
          <path d="M12 16V6" />
          <path d="m8 10 4-4 4 4" />
          <path d="M5 18h14" />
        </BaseIcon>
      );
    case "arrowLeft":
      return (
        <BaseIcon className={className}>
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </BaseIcon>
      );
    case "help":
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.9.9-1.8 1.3-1.8 3" />
          <circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none" />
        </BaseIcon>
      );
    case "receipt":
      return (
        <BaseIcon className={className}>
          <path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5L5 21V5a2 2 0 0 1 2-2Z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </BaseIcon>
      );
    case "dashboard":
      return (
        <BaseIcon className={className}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </BaseIcon>
      );
    case "users":
      return (
        <BaseIcon className={className}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M4 19a5 5 0 0 1 10 0" />
          <path d="M14 19a4 4 0 0 1 6 0" />
        </BaseIcon>
      );
    case "settings":
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V21a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V3a2 2 0 1 1 4 0v.2a1 1 0 0 0 .7.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H21a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.7 1 1 0 0 0 .2 1.1Z" />
        </BaseIcon>
      );
    case "admin":
      return (
        <BaseIcon className={className}>
          <path d="M12 3 5 6v5c0 5 3.2 8.4 7 10 3.8-1.6 7-5 7-10V6l-7-3Z" />
          <path d="M10 11h4" />
          <path d="M12 9v4" />
        </BaseIcon>
      );
    case "download":
      return (
        <BaseIcon className={className}>
          <path d="M12 4v10" />
          <path d="m8 10 4 4 4-4" />
          <path d="M5 20h14" />
        </BaseIcon>
      );
    case "addCircle":
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </BaseIcon>
      );
    case "payments":
      return (
        <BaseIcon className={className}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 15h2" />
          <path d="M14 15h4" />
        </BaseIcon>
      );
    case "hourglass":
      return (
        <BaseIcon className={className}>
          <path d="M7 3h10" />
          <path d="M7 21h10" />
          <path d="M8 3c0 4 4 4 4 9s-4 5-4 9" />
          <path d="M16 3c0 4-4 4-4 9s4 5 4 9" />
        </BaseIcon>
      );
    case "more":
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="5" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none" />
        </BaseIcon>
      );
    case "contactCard":
      return (
        <BaseIcon className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8" cy="11" r="2" />
          <path d="M5.5 16a3 3 0 0 1 5 0" />
          <path d="M13 10h4" />
          <path d="M13 14h4" />
        </BaseIcon>
      );
    case "chevronRight":
      return (
        <BaseIcon className={className}>
          <path d="m9 6 6 6-6 6" />
        </BaseIcon>
      );
    case "bell":
      return (
        <BaseIcon className={className}>
          <path d="M15 17H5.5a1 1 0 0 1-.8-1.6l1.3-1.7V10a6 6 0 1 1 12 0v3.7l1.3 1.7a1 1 0 0 1-.8 1.6H15" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </BaseIcon>
      );
    case "home":
      return (
        <BaseIcon className={className}>
          <path d="m3 11 9-7 9 7" />
          <path d="M5 10v10h14V10" />
        </BaseIcon>
      );
    case "plus":
      return (
        <BaseIcon className={className}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </BaseIcon>
      );
    case "box":
      return (
        <BaseIcon className={className}>
          <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
          <path d="M12 12 4 7.5" />
          <path d="M12 12l8-4.5" />
          <path d="M12 12v9" />
        </BaseIcon>
      );
    case "preview":
      return (
        <BaseIcon className={className}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </BaseIcon>
      );
    case "userCircle":
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7.5 17a5 5 0 0 1 9 0" />
        </BaseIcon>
      );
    case "basket":
      return (
        <BaseIcon className={className}>
          <path d="M5 10h14l-1.5 9h-11Z" />
          <path d="M9 10 12 5l3 5" />
        </BaseIcon>
      );
    case "trash":
      return (
        <BaseIcon className={className}>
          <path d="M4 7h16" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M6 7l1 12h10l1-12" />
          <path d="M9 7V4h6v3" />
        </BaseIcon>
      );
    case "send":
      return (
        <BaseIcon className={className}>
          <path d="M21 3 10 14" />
          <path d="m21 3-7 18-4-7-7-4 18-7Z" />
        </BaseIcon>
      );
    case "pdf":
      return (
        <BaseIcon className={className}>
          <path d="M7 3h7l5 5v13H7Z" />
          <path d="M14 3v6h6" />
          <path d="M9 16h1.5a1.5 1.5 0 0 0 0-3H9v5" />
          <path d="M13 18v-5h1.2a1.8 1.8 0 0 1 0 3.6H13" />
          <path d="M18 13h-2v5" />
        </BaseIcon>
      );
    case "trendUp":
      return (
        <BaseIcon className={className}>
          <path d="M4 16 10 10l4 4 6-8" />
          <path d="M14 6h6v6" />
        </BaseIcon>
      );
    case "search":
      return (
        <BaseIcon className={className}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.2-4.2" />
        </BaseIcon>
      );
    case "filter":
      return (
        <BaseIcon className={className}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </BaseIcon>
      );
    case "chevronLeft":
      return (
        <BaseIcon className={className}>
          <path d="m15 6-6 6 6 6" />
        </BaseIcon>
      );
    case "sparkles":
      return (
        <BaseIcon className={className}>
          <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" />
          <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />
          <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8Z" />
        </BaseIcon>
      );
    case "share":
      return (
        <BaseIcon className={className}>
          <circle cx="18" cy="5" r="2.2" />
          <circle cx="6" cy="12" r="2.2" />
          <circle cx="18" cy="19" r="2.2" />
          <path d="m8 11 8-5" />
          <path d="m8 13 8 5" />
        </BaseIcon>
      );
    case "history":
      return (
        <BaseIcon className={className}>
          <path d="M4 12a8 8 0 1 0 2.3-5.7" />
          <path d="M4 4v5h5" />
          <path d="M12 8v5l3 2" />
        </BaseIcon>
      );
    case "edit":
      return (
        <BaseIcon className={className}>
          <path d="M4 20h4l10-10-4-4L4 16v4Z" />
          <path d="m12.5 5.5 4 4" />
        </BaseIcon>
      );
    default:
      return null;
  }
}
