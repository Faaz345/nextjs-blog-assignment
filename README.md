# Feature-rich Blog Platform (Next.js + TypeScript + Redux Toolkit + Tailwind)

This project implements a production-grade blog platform using the Next.js Pages Router (chosen to satisfy explicit `getServerSideProps` requirement and the requested `/pages/*` layout), TypeScript, Redux Toolkit, and Tailwind CSS.

- Data persistence via local JSON files in `/data` (no backend service).
- Blog list with search, filters, sorting, pagination and URL synchronization.
- Blog detail with SSR (via `getServerSideProps`) and 404 handling.
- Create blog with inline creation of categories, tags, and authors.
- Delete blog with confirmation modal and JSON updates.

See inline comments across the codebase for rationale and tradeoffs.

