-- Seed the projects table with Oresajo's initial work. Safe to re-run:
-- existing slugs are left untouched.
insert into public.projects
  (slug, number, category, name, summary, image_url, tools, link, featured, sort_order)
values
  (
    'excel-sales-dashboard', '01', 'Excel · Dashboard',
    'Sales Performance Dashboard',
    'An interactive Excel dashboard on a retail sales dataset — calculated Revenue, COGS, Profit and Customer KPIs, then built pivot tables to surface the most profitable products and sales reps, city-level COGS and the worst-performing month. Region and Category slicers make it fully interactive.',
    '/projects/excel-dashboard.svg',
    array['Excel','Pivot Tables','Charts','Slicers','KPIs'],
    null, true, 1
  ),
  (
    'powerbi-sales-dashboard', '02', 'Power BI · Report',
    'Retail Sales Power BI Report',
    'A Power BI report built on a Products / Customers / Sales data model. Cleaned each table in Power Query, wrote DAX measures for Revenue, Cost, Profit and Total Customers, and visualised Brand by Profit, most-sold Color, Yearly Revenue and Income Level by Profit, with Region and Gender slicers.',
    '/projects/powerbi-dashboard.svg',
    array['Power BI','DAX','Power Query','Data Modeling'],
    null, true, 2
  ),
  (
    'excel-data-cleaning', '03', 'Excel · Data Cleaning',
    'Sales Data Cleaning & Transformation',
    'A messy orders dataset turned analysis-ready: removed duplicate rows, trimmed and standardised text, fixed casing, replaced missing values, split full names, corrected data types and invalid dates, standardised region names and rebuilt a recalculated Total Sales column.',
    '/projects/data-cleaning.svg',
    array['Excel','Power Query','Data Cleaning','Text Functions'],
    null, true, 3
  ),
  (
    'excel-employee-analysis', '04', 'Excel · Formulas',
    'Employee Data Analysis',
    'A formula-driven analysis of an employee dataset — used text functions to extract names and generate emails, and aggregate functions (SUM, SUMIF, SUMIFS, AVERAGEIF, AVERAGEIFS, COUNTIFS, MAXIFS) to answer targeted questions about salary by department, city, gender and experience.',
    '/projects/employee-analysis.svg',
    array['Excel','Text Functions','SUMIFS','COUNTIFS','MAXIFS'],
    null, false, 4
  )
on conflict (slug) do nothing;
