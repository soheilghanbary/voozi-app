# Next Tasks

Persian (fa, RTL) invoice management dashboard — stack: Next.js 16 (App Router, Turbopack) · better-auth · orpc 2.0.0-beta.35 · Drizzle · TanStack Table v9 · Base UI · Tailwind v4 · Biome.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## DX (Developer Experience) Logic

- [ ] Automate DB migrations flow — document that `db:push` is required after schema changes (no `__drizzle_migrations` table tracked in repo); add `prebuild`/`predev` script check or a `db:migrate` note in README.
- [ ] Add unit tests for feature utils: `format.ts` (number/currency/date with Persian locale), zod schemas (`invoice-schema`, `customer-schema`, `product-schema`), `userInitials`.
- [ ] Add API route-handler tests (orpc) for mutations/queries: validation errors, owner-scoping, 401 when unauthenticated.
- [ ] Add a deterministic seed script (`src/server/db/seed.ts`) for dev: a test user + sample customers/products/invoices; run via `bun run db:seed`.
- [ ] Wire `bun run check` script (biome + typecheck + build) and run it in `pre-commit`/CI.
- [ ] Centralize error handling: map `ORPCError` codes to Persian toast messages in a shared client helper (used by all forms/tables).
- [ ] Standardize orpc procedure definitions with shared `protectedProcedure` (auth + owner scoping) — replace duplicated `authenticate` logic across `src/features/*/api`.
- [ ] Extract the repeated table scaffolding (toolbar/search/pagination/row-selection/column-visibility) into shared composables — three features duplicate the same hooks/utils.
- [ ] Add ADR/notes for the print-page PDF approach (no server-side PDF lib) and the `export const instant = false` requirement for dynamic RSC pages.
- [ ] Improve proxy matcher coverage (`src/proxy.ts` only guards `/dashboard/:path*`); decide and guard any public user-facing routes (profile, shared invoice links).

## UI (Interface) Logic

- [ ] Skeleton/suspense states across all data pages (invoices, customers, products) — consistent with `UserMenu` skeleton pattern; use React Suspense for page-level loading.
- [ ] Empty states for tables, forms and the dashboard (nice illustration/icon + CTA to create first item).
- [ ] Loading + disabled states on all submit buttons in forms; disable submit while pending; prevent double-submit on Enter.
- [ ] Global confirm dialog consistency: reuse one composable for delete/undo flows (currently inline in invoice data table).
- [ ] Toast/notification system wired to mutation outcomes (success/error from orpc client) — currently missing app-wide.
- [ ] Sortable/filterable column headers on customer & product tables (mirror `data-table-column-header` used in invoice table).
- [ ] `ModeToggle` + theme persistence polish; ensure print sheet is immune to dark mode (verify invoice print keeps light palette).
- [ ] Combobox/Select for customer and product pickers inside invoice items — better than raw inputs; add searchable chips for multi-select.
- [ ] Form-level cleanup: consistent `Card` head/foot, `Link` back-buttons, and `router.refresh()` after create/update everywhere.
- [ ] Verify Base UI render-prop patterns (`nativeButton={false}` + `render={<Link/>}`) across all action menus; fix any remaining anchors that cause full reloads.

## UX (User Experience) Logic

- [ ] Persian locale everywhere: numbers (`fa-IR`), currency (Toman), date formatting — centralize in a shared `lib/format` used by tables/PDF/forms.
- [ ] Responsive audit pass: verify sidebar/table/form pages at 125%/150% zoom on common widths (customers fix was the first pass; apply to profile, settings, login).
- [ ] Keyboard-first flows: `Ctrl/Cmd+K` command palette for navigation (dashboard, invoices, customers, products, settings).
- [ ] Loading feedback on navigation (top progress bar) and on `router.refresh()` after mutations.
- [ ] Breadcrumbs on dashboard sub-pages (dashboard › customers › edit) for orientation.
- [ ] Print preview UX: «خروجی PDF» button alignment in header, hint that browser "Save as PDF" is used; keep toolbar hidden on print.
- [ ] Direct share link for an invoice print preview (`/invoices/:id/print`) — logo/business branding in the header block.
- [ ] Guard against accidental data loss: confirm before destructive actions, `isPending` disabled states, optimistic UI + rollback on failure.
- [ ] Table density/pagination UX: rows-per-page selector, "selected N items" bar with Undo/clear on search.

## User-Needed Features

- [ ] **Settings page** (`/dashboard/settings` is a placeholder): sections for profile (name/email/avatar via better-auth `updateUser`), business info (name, logo, tax id, footer note) used in invoice PDF, and notifications toggles.
- [ ] **Real dashboard (`/dashboard`)**: KPI cards (total invoices, revenue this month, top customers, low-stock products) + recent invoices table + simple charts (`recharts`).
- [ ] **Invoice improvements**: sequence number auto-increment per user, due-date field, paid/unpaid tracking (was removed — decide if re-added alongside `type`), discount/tax lines.
- [ ] **PDF branding**: use business info from Settings in print document (logo, header, footer, terms), Persian digit formatting in totals.
- [ ] **Bulk actions parity**: multi-select + bulk delete for customers and products (invoice already has it); add duplicate & download-PDF batch actions.
- [ ] **Duplicate row-actions**: «کپی» (duplicate invoice/customer/product) and «پیش نمایش» where applicable.
- [ ] **Auth UX**: forgot/reset password, email verification, Google social sign-in button state, session expiry warning modal.
- [ ] **Notifications**: seed the notification bell with real events (created invoice, due dates) via a `notifications` table or better-auth hooks.
- [ ] **Product extras**: unit-of-measure, min/max stock warnings, price history — surfaced as badges/columns.
- [ ] **Customer extras**: balance/debt per customer (مجموع فاکتورها), contact quick actions, default discount.

## Architecture / Data

- [ ] Registration of standard feature router (`src/features/*/api/router.ts`) — review ownership + `ownerId` columns consistency across tables.
- [ ] Ensure cascade behavior: deleting a customer/product referenced by invoice items — decide FK policy (restrict vs cascade) and enforce in Drizzle schema.
- [ ] Type-safe `RouterOutput` helpers so client components infer result types without `any`.
- [ ] Introduce a `lib/currency`, `lib/date` and `lib/errors` shared modules; remove per-feature duplicated `format.ts`.
- [ ] Consider moving the print page data fetch behind a single server query shared with the edit page to avoid duplicated totals logic.

## Testing / QA

- [ ] Global `bun run check` suite (biome, typecheck, build) as the acceptance gate for every PR.
- [ ] Playwright smoke tests: login, create customer, create invoice, print page render, mobile sidebar close, user menu dropdown.
- [ ] Manual QA checklist: RTL spacing, zoom 125%, dark mode, empty DB, seeded DB, DST/timezone for due dates.