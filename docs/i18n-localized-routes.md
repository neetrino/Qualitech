# Localized public routes (`en` / `ru`)

Marketing pages expose the active locale in the **URL path**. APIs stay under `/api/*` without a locale prefix.

## Current patterns

| Page    | URL pattern           | Examples        |
|---------|------------------------|-----------------|
| Home    | `/{locale}`            | `/ru`, `/en`    |
| Contact | `/{locale}/contact`    | `/ru/contact`, `/en/contact` |

- **`/`** → redirects to `/{locale}` using the `NEXT_LOCALE` cookie, default **`ru`**.
- **`/contact`** → redirects to `/{locale}/contact` the same way.

Implementation: `src/middleware.ts` (redirects + cookie sync on localized hits).

Shared helpers and path checks: `src/lib/i18n/locale-routes.ts`.  
Language switcher updates the path when you are on a localized page: `src/shared/layout/language-switcher.tsx`.

## Adding another localized page

1. **App Router:** add `src/app/[locale]/<segment>/page.tsx` (or nested segments). Resolve copy with `params.locale`, validate with `isHomeLocaleSegment()` from `@/lib/i18n/locale-routes`, call `notFound()` if invalid.

2. **Links:** add a small helper next to the others, e.g. `blogHref(locale)` → `/${locale}/blog`, and use it from the header / CTAs instead of hardcoding paths.

3. **Middleware:** include the new paths in `middleware` so they run the cookie sync (today the regex matches only `/{locale}` and `/{locale}/contact` — extend it or add explicit branches, and extend `config.matcher` if those URLs were not matched before).

4. **Language switcher:** if users should stay on the same logical page when switching language, detect the pathname (regex or prefix) and `router.push` to the equivalent URL with the new locale, same as home and contact.

5. **Strings:** prefer `locales/en/<Feature>.json` and `locales/ru/<Feature>.json` plus a `load*Messages(locale)` loader (see `contact.messages.ts`).

Keep **admin** and **API** routes locale-agnostic unless product requirements say otherwise.
