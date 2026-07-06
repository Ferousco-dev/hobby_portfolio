import FadeIn from './FadeIn'

interface Service {
  number: string
  name: string
  description: string
}

const SERVICES: Service[] = [
  {
    number: '01',
    name: 'Data Cleaning & Preparation',
    description:
      'Turning messy datasets into analysis-ready tables \u2014 removing duplicates, fixing text and casing, handling missing values, standardising categories and correcting data types with Excel and Power Query.',
  },
  {
    number: '02',
    name: 'Excel Dashboards & Reporting',
    description:
      'Building interactive Excel dashboards with pivot tables, KPIs, charts and slicers that let stakeholders explore revenue, profit and performance at a glance.',
  },
  {
    number: '03',
    name: 'Power BI Dashboards',
    description:
      'Designing Power BI reports on clean data models \u2014 DAX measures, drill-downs and slicers that turn tables into decisions across regions, products and customers.',
  },
  {
    number: '04',
    name: 'DAX & Data Modeling',
    description:
      'Structuring relationships between tables and writing DAX measures for revenue, cost, profit and customer metrics so numbers stay accurate as filters change.',
  },
  {
    number: '05',
    name: 'Data Visualization & Insights',
    description:
      'Choosing the right chart for the question and translating analysis into clear, honest visuals and recommendations that non-technical people can act on.',
  },
]

export default function ServicesSection() {
  return (
    <section
      id="skills"
      className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Skills
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
