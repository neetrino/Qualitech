# Նախագծի տեխնոլոգիական քարտ — Qualitech Machinery

> Լրացված է `plan.md` + `docs/BACKEND_IMPLEMENTATION_PLAN.md` հիման վրա։  
> **Ստատուս.** 🔄 ընթացքում (Phase 0 scaffold) — լրիվ stack հաստատել մինչև production hardening։

**Նախագիծ.** Qualitech Machinery վեբ կայք  
**Չափ.** B (feature-based `src/features/*`)  
**Ամսաթիվ.** 2026-04-03

---

## 1. Հիմք

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 1.1 | Նախագծի չափ | B | ✅ |
| 1.2 | Ճարտարապետություն | Feature-based | ✅ |
| 1.3 | Package manager | pnpm | ✅ |
| 1.4 | Node.js | 22.x LTS (միջավայրում) / նպատակ՝ 24.x | 🔄 |
| 1.5 | TypeScript | 5.x, strict: true | ✅ |
| 1.6 | Monorepo | — | ➖ |
| 1.7 | Git | feature branches | ✅ |
| 1.8 | Commits | Conventional Commits | ✅ |

---

## 2. Frontend

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 2.1 | Framework | Next.js 15 App Router (նպատակ՝ 16.x երբ stable) | 🔄 |
| 2.2 | Ոճեր | Tailwind CSS 4.x | ✅ |
| 2.3 | UI Kit | Քննարկել (shadcn / custom) | ⬜ |
| 2.4 | State | Server Components + useState / հետո Zustand ըստ need | 🔄 |
| 2.5 | Ձևեր | React Hook Form + Zod | 🔄 |
| 2.6 | Data | Server Components + fetch; admin-ում React Query ըստ need | 🔄 |
| 2.7 | i18n | next-intl, `ru` primary, `en` secondary, `/ru` `/en` URLs | 🔄 |
| 2.8 | SEO | Metadata API, sitemap, OG | 🔄 |

---

## 3. Backend

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 3.1 | Տիպ | Next.js Route Handlers (`src/app/api/*`) — **ոչ NestJS** | ✅ |
| 3.2 | Վալիդացիա | Zod | ✅ |
| 3.3 | API | REST JSON | ✅ |
| 3.4 | Rate limiting | Քննարկել (Vercel / middleware) | ⬜ |
| 3.7 | Upload | Cloudflare R2 (presigned կամ server upload) | 🔄 |

---

## 4. Բազային տվյալներ

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 4.1 | ՍՈՒԲԴ | PostgreSQL (Neon) | ✅ |
| 4.2 | ORM | Prisma 6.x | ✅ |
| 4.8 | Seed | `pnpm db:seed` — `prisma/seed.ts` | ✅ |

**i18n DB մոդել (նախնական).** Տրանսլյացիաներ — առանձին աղյուսակներ `locale` կոդով (`ru`, `en`), ոչ JSON blob (հարցումների և ինդեքսների հարմարության համար)։ Վերջնական սխեմա — Phase 1։

---

## 5. Ինքնություն (Admin)

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 5.1 | Admin auth | JWT (httpOnly cookie կամ Authorization) — մանրամասներ Phase 5 | 🔄 |
| 5.4 | RBAC | Մինչև առաջին փուլը — մեկ ADMIN դեր | 🔄 |
| 5.x | Գաղտնաբառ | argon2 (workspace կանոն) | 🔄 |

Public օգտատերերի login **չի** նախատեսված `plan.md`-ում։

---

## 6–8. Պահոց, ինտեգրացիաներ, DevOps

| Բաժին | Որոշում | Ստատուս |
|-------|---------|---------|
| R2 | Cloudflare R2, public URLs | ✅ |
| Email | Resend (`.env.example`-ում placeholder) — contact notify | 🔄 |
| Hosting | Vercel (խորհուրդ `plan.md`) | ✅ |
| Logging | `src/lib/logger.ts` — prod-ում Pino-ի անցումը Քննարկելի | 🔄 |

---

## 9. Թեստավորում

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 9.1 | Unit | Vitest — Phase 7+ | ⬜ |

---

## 10. Անվտանգություն

| # | Կետ | Ստատուս |
|---|-----|---------|
| 10.4 | Zod բոլոր արտաքին մուտքերի վրա | 🔄 |
| 10.7 | Գաղտնիքներ միայն env | ✅ |

CORS/CSRF — Next same-origin + admin cookie strategy — նկարագրել `docs/01-ARCHITECTURE.md`։

---

## 11. Փաստաթղթեր

| Ֆայլ | Ստատուս |
|------|---------|
| docs/BRIEF.md | ⬜ լրացնել մշակողը |
| docs/TECH_CARD.md | 🔄 այս ֆայլը |
| docs/01-ARCHITECTURE.md | 🔄 |
| .env.example | ✅ |

---

> **Հաստատում.** Փոխարինիր 🔄 → ✅ կամ корректируй որոշումները, եթե ուրիշ ես ուզում stack։
