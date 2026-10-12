export default function Icon({ name, className = "size-5" }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M21 11.6a8.8 8.8 0 0 1-13 7.7L3 21l1.7-4.8A8.8 8.8 0 1 1 21 11.6Z" />
        <path d="M8.3 7.8c.2-.5.4-.5.8-.5h.4c.2 0 .4.1.5.4l.8 2c.1.3 0 .5-.2.7l-.6.7c-.2.2-.1.5 0 .7.6 1.1 1.5 2 2.7 2.6.3.1.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l2 .9c.3.1.5.3.5.5 0 .3-.2 1.5-.7 2-.5.6-1.3.9-2.1.9-.7 0-1.6-.3-3.1-1-1.8-.8-4.3-3.1-5-5.4-.3-1.1-.1-2.5.5-3.3Z" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" />
        <path d="M12 11v10" />
      </>
    ),
    tag: (
      <>
        <path d="M20 13 13 20l-9-9V4h7l9 9Z" />
        <circle cx="8.5" cy="8.5" r="1.2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5" />
        <path d="M14 8l4 4-4 4M18 12H9" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    edit: (
      <>
        <path d="m14 5 5 5" />
        <path d="m4 20 4.5-1 10-10a2 2 0 0 0-3-3l-10 10L4 20Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M5 14v6h14v-6" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    store: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="M3 10 5 4h14l2 6" />
        <path d="M3 10c0 2 3 3 4.5 1 1.5 2 3.5 2 5 0 1.5 2 3.5 2 5 0 1.5 2 3.5 1 3.5-1" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}
