export interface Project {
  slug: string
  number: string
  category: string
  name: string
  summary: string
  image: string
  tools: string[]
  link?: string
}

// Real data-analysis work by Oresajo Fiyinfoluwa Eniola.
// One representative image per project — drop your dashboard
// screenshots into /public/projects/ using the paths below.
export const PROJECTS: Project[] = [
  {
    slug: 'excel-sales-dashboard',
    number: '01',
    category: 'Excel · Dashboard',
    name: 'Sales Performance Dashboard',
    summary:
      'An interactive Excel dashboard on a retail sales dataset — calculated Revenue, COGS, Profit and Customer KPIs, then built pivot tables to surface the most profitable products and sales reps, city-level COGS and the worst-performing month. Region and Category slicers make it fully interactive.',
    image: '/projects/excel-dashboard.svg',
    tools: ['Excel', 'Pivot Tables', 'Charts', 'Slicers', 'KPIs'],
  },
  {
    slug: 'powerbi-sales-dashboard',
    number: '02',
    category: 'Power BI · Report',
    name: 'Retail Sales Power BI Report',
    summary:
      'A Power BI report built on a Products / Customers / Sales data model. Cleaned each table in Power Query, wrote DAX measures for Revenue, Cost, Profit and Total Customers, and visualised Brand by Profit, most-sold Color, Yearly Revenue and Income Level by Profit, with Region and Gender slicers.',
    image: '/projects/powerbi-dashboard.svg',
    tools: ['Power BI', 'DAX', 'Power Query', 'Data Modeling'],
  },
  {
    slug: 'excel-data-cleaning',
    number: '03',
    category: 'Excel · Data Cleaning',
    name: 'Sales Data Cleaning & Transformation',
    summary:
      'A messy orders dataset turned analysis-ready: removed duplicate rows, trimmed and standardised text, fixed casing, replaced missing values, split full names, corrected data types and invalid dates, standardised region names and rebuilt a recalculated Total Sales column.',
    image: '/projects/data-cleaning.svg',
    tools: ['Excel', 'Power Query', 'Data Cleaning', 'Text Functions'],
  },
  {
    slug: 'excel-employee-analysis',
    number: '04',
    category: 'Excel · Formulas',
    name: 'Employee Data Analysis',
    summary:
      'A formula-driven analysis of an employee dataset — used text functions to extract names and generate emails, and aggregate functions (SUM, SUMIF, SUMIFS, AVERAGEIF, AVERAGEIFS, COUNTIFS, MAXIFS) to answer targeted questions about salary by department, city, gender and experience.',
    image: '/projects/employee-analysis.svg',
    tools: ['Excel', 'Text Functions', 'SUMIFS', 'COUNTIFS', 'MAXIFS'],
  },
]

// The first three appear on the home page; the rest live on the
// "all projects" page reachable via the More button.
export const FEATURED_COUNT = 3
