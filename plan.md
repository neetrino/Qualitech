📄 ՏԵԽՆԻԿԱԿԱՆ ԱՌԱՋԱԴՐԱՆՔ
Qualitech Machinery Վեբ Կայք
1. Ընդհանուր նկարագրություն (Overview)

Նախագծի նպատակն է ստեղծել ժամանակակից, արագ և հուսալի վեբ կայք Qualitech Machinery բրենդի համար, որը նախատեսված է՝

հաստոցների ներկայացման
բրենդի իմիջի բարձրացման
հաճախորդների ներգրավման համար
Կայքի հիմնական պահանջներ
Բարձր UX (User Experience)
Արագ բեռնավորում (performance optimized)
Responsive (mobile / tablet / desktop)
SEO-friendly կառուցվածք
Հեշտ ընդլայնվող (scalable architecture)
2. Կայքի կառուցվածք (Site Structure)
Գլխավոր էջ (Home)
Մեր մասին (About Us)
Հաստոցներ (Machines / Catalog)
Բլոգ (Blog)
Կապ (Contact)
3. Գլխավոր էջ (Home Page)
3.1 Hero / Banner
Մեծ ֆոնային նկար կամ վիդեո
Վերնագիր + ենթավերնագիր
CTA (օր.՝ "Տեսնել հաստոցները")
3.2 Featured Machines
3 հիմնական հաստոց
Նկար
Անուն
Կարճ նկարագրություն
"Մանրամասներ" կոճակ
3.3 Մեր մասին (Preview)
Կարճ տեքստ
Նկար կամ իկոններ
"Կարդալ ավելին"
3.4 Ինչու ընտրել մեզ
3–4 առավելություն
Իկոն
Վերնագիր
Նկարագրություն
3.5 Բլոգ
4 վերջին հոդված
Նկար
Վերնագիր
Կարճ նկարագրություն
Ամսաթիվ
3.6 Footer
Կոնտակտներ
Սոցիալական հղումներ
Google Map
Կարևոր էջերի հղումներ
4. Հաստոցների էջ (Machines)
4.1 Կատեգորիաներ
3 հիմնական բաժին
Սեղմելիս բացվում է ենթաբաժին
4.2 Listing
Նկար
Անուն
Կարճ նկարագրություն
4.3 Single Product Page
Gallery (մեծ նկարներ)
Լիարժեք նկարագրություն
Տեխնիկական տվյալներ
CTA (կապ / հարցում ուղարկել)
5. Մեր մասին էջ (About)
Ընկերության պատմություն
Առաքելություն
Արժեքներ
Նկարներ
Վստահության բլոկ (փորձ, գործընկերներ)
6. Բլոգ (Blog)
6.1 Blog Listing
Հոդվածների ցանկ
Pagination կամ infinite scroll
6.2 Blog Single
Վերնագիր
Նկար
Լիարժեք տեքստ
Ամսաթիվ
7. Կապի էջ (Contact)
Հեռախոսահամար
Email
Հասցե
Google Maps
Կապի ֆորմա
Անուն
Email
Հաղորդագրություն
8. Admin Panel
8.1 Machines Management
Add / Edit / Delete հաստոցներ
Դաշտեր՝
Title
Description
Images (R2 storage)
Meta Title
Meta Description
Open Graph Image
8.2 Blog Management
Add / Edit / Delete հոդվածներ
Rich text editor
Նկարներ (R2 storage)
9. Լեզուներ (Internationalization)

Կայքը պետք է լինի բազմալեզու՝

Ռուսերեն (Primary)
Անգլերեն (Secondary)
URL կառուցվածք
/ru/...
/en/...

👉 Language switcher պարտադիր

i18n համակարգ

Լեզուներ:

Ռուսերեն (ru) — Հիմնական (Primary)

Անգլերեն (en) — Երկրորդային (Secondary)

URL Կառուցվածք:

example.com/ru/...

example.com/en/...

Translation Logic
UI text → JSON ֆայլերից
Dynamic content → Database-ից
10. SEO Պահանջներ
Dynamic meta tags
Open Graph support
Sitemap.xml
Robots.txt
SEO-friendly URLs
Image alt tags
🚀 11. ՏԵԽՆԻԿԱԿԱՆ ՄԱՍ
Architecture

Կայքը պետք է կառուցված լինի fullstack լուծմամբ՝

👉 Next.js

Frontend + Backend միասին
App Router
API Routes → backend logic
Backend (API)
/api/machines
/api/blog
/api/contact
/api/admin/*
Database

👉 Neon

PostgreSQL (serverless)
Cloud-hosted
ORM
Prisma
Data Flow

Next.js API → Prisma → Neon DB

Authentication
Admin login
Protected routes /admin
JWT կամ session
🖼️ 12. Image Storage

Բոլոր նկարները պահվում են՝

👉 Cloudflare R2

Պահանջներ
Upload միայն R2
Չկա local storage
Public URL-ներ
Upload Flow
Admin upload
Next.js API
Upload → R2
URL → DB
Folder structure
/machines/
/blog/
/uploads/
⚡ Performance
next/image optimization
Lazy loading
Code splitting
ISR (optional)
🔐 Security
Form validation
API validation
Anti-spam (reCAPTCHA optional)
Secure endpoints
🚀 Deployment
Vercel (recommended)
կամ VPS
13. Լրացուցիչ (Optional)
Google Analytics
Pixel tracking
Live chat
✅ ՎԵՐՋՆԱԿԱՆ ԱՄՓՈՓՈՒՄ

Այս նախագիծը պետք է լինի՝

✅ Fullstack Next.js application
✅ Backend → Next.js API Routes
✅ Database → Neon PostgreSQL
✅ Images → Cloudflare R2
✅ Translations → JSON (i18n)
❌ Առանձին backend (NestJS) ՉԻ օգտագործվում