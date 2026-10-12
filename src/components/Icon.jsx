/* Small inline line-icon set (no icon library needed). */
const P = {
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
    </>
  ),
  beard: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0v2.5c0 5-2.7 9.5-6 9.5s-6-4.5-6-9.5Z" />
      <path d="M8.5 14c1-.8 2.2-1.2 3.5-1.2s2.5.4 3.5 1.2" />
      <path d="M9.5 9.5h.01M14.5 9.5h.01" />
    </>
  ),
  face: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 10.5c.6-.6 1.4-.6 2 0M14 10.5c.6-.6 1.4-.6 2 0" />
      <path d="M9 15c1.6 1.3 4.4 1.3 6 0" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 2.5h4v3h-4z" />
      <path d="M9 5.5h6l1 3V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20V8.5z" />
      <path d="M8 12h8M8 17h8" />
    </>
  ),
  jar: (
    <>
      <rect x="5" y="8.5" width="14" height="12.5" rx="2" />
      <path d="M7 3.5h10v5H7z" />
      <path d="M9 14h6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 21.5s8-4 8-10V5l-8-3-8 3v6.5c0 6 8 10 8 10Z" />
      <path d="m9 11.5 2 2 4-4" />
    </>
  ),
  star: (
    <path d="m12 2.8 2.9 5.9 6.4.9-4.6 4.5 1.1 6.4L12 17.5l-5.8 3 1.1-6.4-4.6-4.5 6.4-.9Z" />
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12.2 2.8 2.8L16 9.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.4" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2c2.1.7 3.5 2.8 3.5 5.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </>
  ),
  phone: (
    <path d="M21.5 16.4v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.6 3.7 2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.6 9.4a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5 4.8 16.6A8.5 8.5 0 1 1 8 19.4Z" />
      <path d="M9.2 8.3c-.4 2.9 3 6.6 6.4 6.3l.7-1.4-1.8-.9-.9.7c-1-.4-2-1.4-2.4-2.4l.7-.9-.9-1.8Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M17 7h.01" />
    </>
  ),
  facebook: (
    <path
      d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  tiktok: (
    <path
      d="M14 3.5v10.7a3.2 3.2 0 1 1-2.8-3.2v-3.2A6.3 6.3 0 1 0 17.2 14V9.1c1.1.7 2.2 1.1 3.3 1.2V7.1c-2-.3-3.2-1.7-3.4-3.6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  crown: <path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5Z" />,
  sparkle: (
    <path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5M5.3 5.3l3.2 3.2M15.5 15.5l3.2 3.2M5.3 18.7l3.2-3.2M15.5 8.5l3.2-3.2" />
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.6 14.2-1.6 7.3 5-2.8 5 2.8-1.6-7.3" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17.5" rx="2" />
      <path d="M9 2.5h6V6H9zM9 11h6M9 15h6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  money: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  chart: <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={"ico " + className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {P[name]}
    </svg>
  );
}

/* Five gold stars for a rating value */
export function Stars({ value = 5, size = 14 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={n <= value ? "on" : "off"}
          aria-hidden="true"
        >
          <path d="m12 2.8 2.9 5.9 6.4.9-4.6 4.5 1.1 6.4L12 17.5l-5.8 3 1.1-6.4-4.6-4.5 6.4-.9Z" />
        </svg>
      ))}
    </span>
  );
}

/* Shop social links (Instagram / Facebook / TikTok) */
export function Socials({ settings, className = "" }) {
  return (
    <div className={"socials " + className} aria-label="Social media links">
      {[
        ["instagram", "Instagram"],
        ["facebook", "Facebook"],
        ["tiktok", "TikTok"],
      ].map(([k, label]) =>
        settings[k] ? (
          <a key={k} href={settings[k]} target="_blank" rel="noreferrer" aria-label={label} title={label}>
            <Icon name={k} size={16} />
          </a>
        ) : null,
      )}
    </div>
  );
}
