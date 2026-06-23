interface LiveProjectButtonProps {
  href?: string
  className?: string
}

export default function LiveProjectButton({
  href,
  className = '',
}: LiveProjectButtonProps) {
  const base =
    `rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors duration-200 hover:bg-[#D7E2EA]/10 ${className}`

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        Live Project
      </a>
    )
  }

  return <button className={base}>Live Project</button>
}
