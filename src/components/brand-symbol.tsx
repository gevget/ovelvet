export function BrandSymbol({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 2.4 32.4 10.55v14.9L18 33.6 3.6 25.45v-14.9L18 2.4Z" />
      <circle cx="18" cy="18" r="9.7" />
      <circle cx="18" cy="18" r="6.2" />
    </svg>
  );
}
