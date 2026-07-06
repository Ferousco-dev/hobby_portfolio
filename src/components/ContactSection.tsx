import { Mail, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import FadeIn from "./FadeIn";
import ContactButton from "./ContactButton";

const EMAIL = "fiyinfoluwaoresajo@gmail.com";
const PHONE = "08114409571";

// Official X (formerly Twitter) logo.
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "X",
    href: "https://x.com/heisfiyin_",
    icon: XIcon,
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    icon: Mail,
  },
  {
    label: "Call",
    href: `tel:+234${PHONE.slice(1)}`,
    icon: Phone,
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/234${PHONE.slice(1)}`,
    icon: MessageCircle,
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 md:pt-40 pb-20 sm:pb-28 overflow-hidden"
    >
      {/* Subtle radial glow behind heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(182,0,168,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center gap-12 sm:gap-16">
        {/* Heading */}
        <div className="flex flex-col items-center gap-5">
          <FadeIn
            as="p"
            delay={0}
            y={20}
            className="text-[#D7E2EA]/50 font-light uppercase tracking-[0.3em] text-sm sm:text-base"
          >
            Available for work
          </FadeIn>

          <FadeIn
            as="h2"
            delay={0.1}
            y={40}
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 12vw, 140px)" }}
          >
            Let's Talk
          </FadeIn>

          <FadeIn
            as="p"
            delay={0.2}
            y={20}
            className="text-[#D7E2EA]/60 font-light leading-relaxed max-w-[480px]"
            style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.25rem)" }}
          >
            Got data that needs making sense of? Whether it's an Excel
            dashboard, a Power BI report, or cleaning up a messy dataset —
            I'd love to hear about it.
          </FadeIn>
        </div>

        {/* Big email link */}
        <FadeIn delay={0.3} y={20}>
          <a
            href={`mailto:${EMAIL}`}
            className="group flex items-center gap-3 text-[#D7E2EA] font-medium transition-opacity duration-200 hover:opacity-70"
            style={{ fontSize: "clamp(0.9rem, 2.2vw, 1.5rem)" }}
          >
            {EMAIL}
            <ArrowUpRight
              size={20}
              className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </a>
        </FadeIn>

        {/* Phone */}
        <FadeIn delay={0.35} y={20} className="-mt-6 sm:-mt-10">
          <a
            href={`tel:+234${PHONE.slice(1)}`}
            className="text-[#D7E2EA]/60 font-light tracking-wide transition-opacity duration-200 hover:opacity-100 hover:text-[#D7E2EA]"
            style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.15rem)" }}
          >
            {PHONE}
          </a>
        </FadeIn>

        {/* Social icon row */}
        <FadeIn delay={0.4} y={20} className="flex items-center gap-4">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center gap-2 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA]/70 px-5 py-2.5 text-sm font-medium uppercase tracking-widest transition-colors duration-200 hover:border-[#D7E2EA]/60 hover:text-[#D7E2EA]"
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
