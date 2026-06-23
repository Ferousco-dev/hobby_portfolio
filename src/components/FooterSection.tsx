const NAV_LINKS = ['About', 'Projects', 'Contact']

export default function FooterSection() {
  return (
    <footer className="bg-[#0C0C0C] border-t border-[#D7E2EA]/10 px-5 sm:px-8 md:px-10 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Name / brand */}
        <p className="text-[#D7E2EA] font-black uppercase tracking-widest text-sm">
          Feranmi Oresajo
        </p>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[#D7E2EA]/50 font-light uppercase tracking-wider text-xs transition-opacity duration-200 hover:opacity-100"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[#D7E2EA]/30 font-light text-xs">
          © {new Date().getFullYear()} Feranmi Oresajo
        </p>
      </div>
    </footer>
  )
}
