import FadeIn from './FadeIn'

interface Service {
  number: string
  name: string
  description: string
}

const SERVICES: Service[] = [
  {
    number: '01',
    name: 'Mobile App Development',
    description:
      'Building cross-platform mobile applications with Flutter & Dart \u2014 beautiful UI, smooth performance, and a consistent experience across iOS and Android.',
  },
  {
    number: '02',
    name: 'Frontend Development',
    description:
      'Crafting responsive, modern web interfaces with HTML5, CSS3, and JavaScript that look sharp and work flawlessly on every screen size.',
  },
  {
    number: '03',
    name: 'UI/UX Design',
    description:
      'Designing intuitive, user-centered interfaces that balance aesthetics with functionality \u2014 making apps feel effortless to use.',
  },
  {
    number: '04',
    name: 'Firebase Integration',
    description:
      'Setting up authentication, real-time databases, cloud storage, and serverless functions to power your mobile and web applications.',
  },
  {
    number: '05',
    name: 'REST API Integration',
    description:
      'Connecting apps to third-party services and custom backends with clean, reliable data flows and robust error handling.',
  },
]

export default function ServicesSection() {
  return (
    <section
      className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Services
      </h2>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((service, i) => (
          <FadeIn
            key={service.number}
            delay={i * 0.1}
            className="flex items-start gap-5 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
            style={{
              borderTop: '1px solid rgba(12, 12, 12, 0.15)',
              ...(i === SERVICES.length - 1
                ? { borderBottom: '1px solid rgba(12, 12, 12, 0.15)' }
                : {}),
            }}
          >
            <span
              className="text-[#0C0C0C] font-black leading-none shrink-0"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {service.number}
            </span>
            <div className="flex flex-col gap-3 pt-1 sm:pt-2 md:pt-4">
              <h3
                className="text-[#0C0C0C] font-medium uppercase leading-tight"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {service.name}
              </h3>
              <p
                className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl"
                style={{
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                  opacity: 0.6,
                }}
              >
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
