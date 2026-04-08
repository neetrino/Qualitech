# Qualitech — Backend իրականացման պլան (Next.js API)

> **Աղբյուր.** `plan.md` (տեխնիկական առաջադրանք)  
> **Կանոններ.** `.cursor/rules/` (TS strict, named exports, Zod սահմաններում, `pnpm` + Prisma, ֆայլ ≤ 300 տող, ֆունկցիա ≤ 50 տող, `any` չկա)  
> **Սահմանափակում.** `plan.md` §11 — **առանձին NestJS backend չի օգտագործվում**; backend-ը **Next.js App Router Route Handlers** (`app/api/...`) է։

---

## 1. Թիրախային API մակերես (plan.md-ից)

| Ուղի | Նպատակ |
|------|--------|
| `/api/machines` | Կատալոգ, մեկ հաստոց, (admin) CRUD |
| `/api/blog` | Ցանկ, մեկ հոդված, (admin) CRUD |
| `/api/contact` | Կապի ֆորմայի ընդունում, վալիդացիա, (ընտրովի) spam պաշտպանություն |
| `/api/admin/*` | Ադմին գործողություններ, auth, R2 upload meta |
| R2 upload flow | Admin → API → R2 → public URL → DB |

Պահել **REST + JSON**, սխալները — կառուցված պատասխան (կոդ, հաղորդագրություն, դաշտային սխալներ)։

---

## 2. Senior մակարդակի կառուցվածք (ֆայլ ≤ 300 տող)

Տրամաբանությունը՝ **բարակ handler**, հաստ service/repository շերտ, **Zod** մուտքի/ելքի սահմաններում։

Պայմանական կառուցվածք (համապատասխանեցնել repo-ի իրական feature-based layout-ին).

```
src/
  lib/
    db.ts                 # Prisma client (singleton)
    logger.ts             # prod-ում ոչ console.log
    errors/               # AppError, map to HTTP
  features/
    machines/
      machines.schemas.ts    # Zod
      machines.service.ts    # բիզնես լոգիկա
      machines.repository.ts # Prisma կանչեր (կամ service-ում բաժանված)
    blog/
    contact/
    admin/
      auth.service.ts
      r2/                   # signed upload կամ proxy upload — փուլով
  app/
    api/
      machines/[[...path]]/route.ts   # կամ բաժանված route.ts ֆայլեր — մինչև 300 տող
      blog/...
      contact/route.ts
      admin/...
```

**Կանոն.** Եթե route ֆայլը մոտենում է 300 տողին — բաժանել `handler` + `features/*` մոդուլներ։

---

## 3. Տվյալների մոդել (սևագիր — հաստատել նախքան Prisma migrate)

- **Machine** — բազմալեզու դաշտեր (կամ `Machine` + `MachineTranslation` աղյուսակներ), նկարների URL-ներ, SEO/meta, `slug` (locale-aware կամ `slug` + `locale`).
- **BlogPost** — նույն սկզբունքը, rich text (HTML/Markdown պահման ձևաչափը որոշել).
- **ContactMessage** (ընտրովի պահում) — անուն, email, հաղորդագրություն, ստեղծման ժամանակ, կարդացված դրոշմ։
- **AdminUser** / session store — JWT կամ session cookie (plan.md) — **ընտրությունը TECH_CARD + հաստատում**։

> Մինչև սխեմայի lock — համաձայնեցնել `ru`/`en` պահման մոդելը (տարանջատ տողեր vs JSON դաշտ)։

---

## 4. Անվտանգություն և սահմաններ

- Բոլոր **public** POST/PUT/PATCH — **Zod** + rate limit (ընտրովի, host-ից կախված)։
- **Admin** — auth middleware / guard route handler-ում, գաղտնի բանալիներ միայն env։
- **R2** — presigned URL կամ սերվերային upload; **ոչ** local disk prod-ում (plan.md)։
- SQL միայն Prisma-ով (parameterized)։

---

## 5. Փուլեր, ստուգիչներ (DoD) և **թույլտվության կետեր**

Յուրաքանչյուր փուլի վերջում՝ **կանգ առնել** և հարցնել մշակողից՝ *«շարունակե՞մ հաջորդ փուլը»*։  
Աշխատանքի ընթացքում այս ֆայլում նշել ավարտված կետերը **☑** 

### Փուլ 0 — Հիմք և փաստաթղթեր

- ☑ `docs/TECH_CARD.md` լրացված / հաստատված (stack, auth մոդել, i18n DB մոդել)  
- ☑ Next.js + Prisma + TS strict scaffold  
- ☑ Env նմուշ (`DATABASE_URL`, R2, JWT/session) **առանց գաղտնի արժեքների**  

**DoD.** `pnpm` install, build անցնում է, Prisma client գեներացվում է։

**⏸ Թույլտվություն՝ Փուլ 1**

---

### Փուլ 1 — DB սխեմա + միգրացիա

- ☑ Prisma մոդելներ (machines, blog, contact, admin-related)  
- ☑ Միգրացիա Neon-ի վրա (dev) — `prisma/migrations/20260403140000_init`  
- ☑ Seed (ընտրովի) — `prisma/seed.ts` (idempotent եթե արդեն կան machines)  

**DoD.** `prisma migrate` / `db push` (ընտրած workflow), տվյալ կարդալ/գրել smoke test։

**⏸ Թույլտվություն՝ Փուլ 2**

---

### Փուլ 2 — Հաստոցների public API

- ☑ `GET` ցանկ + ֆիլտր/կատեգորիա (ընդլայնել plan.md-ի հիման վրա)  
- ☑ `GET` մեկ հաստոց `slug` + `locale` (կամ agreed key)  
- ☑ Zod query params, համաչափ error response  

**DoD.** Ձեռքով կամ թեստով կանչեր, 404/400 ճիշտ կորպուս։

**⏸ Թույլտվություն՝ Փուլ 3**

---

### Փուլ 3 — Բլոգի public API

- ☑ Listing + pagination  
- ☑ Single post  

**DoD.** Նույնը ինչ Փուլ 2։

**⏸ Թույլտվություն՝ Փուլ 4**

---

### Փուլ 4 — Contact API

- ☑ `POST /api/contact` — Zod, spam layer (ընտրովի reCAPTCHA verify)  
- ☑ Պահպանում DB կամ email webhook (TECH_CARD-ով)  

**DoD.** Վալիդացիայի սխալներ դաշտային, հաջողություն idempotent-safe։

**⏸ Թույլտվություն՝ Փուլ 5**

---

### Փուլ 5 — Admin auth + պաշտպանված admin API

- ☑ Login, session/JWT, httpOnly cookie կամ agreed մոդել  
- ☑ `admin` CRUD machines/blog (կամ բաժանված route-եր)  
- ☑ Auth guard բոլոր admin ուղիներին  

**DoD.** Անանուն հարցումը 401/403, լեգիտիմ session-ով՝ հաջող։

**⏸ Թույլտվություն՝ Փուլ 6**

---

### Փուլ 6 — R2 upload

- ☑ Upload meta / presigned URL flow — `POST /api/admin/upload/presign` (presigned PUT, `machines/` / `blog/` key prefixes)  
- ☑ Չափի սահմանափակում (`byteLength` ≤ 10MB, ստորագրված `Content-Length`), content-type whitelist (jpeg, png, webp, gif, svg)  
- ☑ DB-ում URL — առկա ադմին CRUD-ով (`images[].url`, `ogImageUrl`); presign պատասխանի `publicUrl`-ը գրել PATCH/CREATE մարմնում  

**DoD.** Ֆայլ բեռնում → public URL → DB դաշտում երևում է։

**⏸ Թույլտվություն՝ Փուլ 7**

---

### Փուլ 7 — Օպս և որակ

- ☑ Logger — production-ում մեկ տող JSON (`level`, `message`, `time`, meta); dev-ում ընթեռնելի  
- ☑ Request id — `src/middleware.ts` (`/api/*`), `x-request-id` request/response-ում; API error լոգերում `logMetaWithRequest`  
- ☑ Unit smoke — Vitest (`pnpm test` / `npm test`), Zod + R2 URL helper  
- ☑ `docs/API.md` — կարճ ուղիների աղյուսակ + R2 presign հոսք  

**DoD.** CI (եթե կա) կանաչ, կամ տեղական `lint` + `test` անցնում է։

**⏸ Ավարտ — full backend slice պատրաստ**

---

## 6. Համապատասխանություն քո կանոններին (ամփոփ)

| Կանոն | Ինչպես ենք պահում |
|--------|-------------------|
| Ֆայլ ≤ 300 տող | feature մոդուլներ, բարակ `route.ts` |
| TS strict, ոչ `any` | Zod `infer`, explicit types սահմաններում |
| Named exports | բոլոր նոր մոդուլներ |
| Վալիդացիա | Zod բոլոր արտաքին մուտքերի վրա |
| Գաղտնիքներ | միայն env |
| plan.md | Next.js API, ոչ NestJS |

---

## 7. Հաջորդ քայլ (քեզանից)

1. Հաստատիր, որ այս պլանը **ընդունելի** է (կամ նշիր փոփոխություններ)։  
2. Հաստատիր **Փուլ 0**-ի նախապայմանները (`TECH_CARD`, project size A/B/C `.cursor`-ում)։  
3. Երբ գրես *«հաստատված է, սկսիր Փուլ 0»* — կկատարեմ միայն այդ փուլը, **☑** կնշեմ համապատասխան տողերը, և **կկանգնեմ** հաջորդ թույլտվության համար։

---

**Տարբերակ.** 1.0 · **Ամսաթիվ.** 2026-04-03
