import { AppLocale, PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const PLACEHOLDER_IMAGE = "https://placehold.co/800x600/e2e8f0/64748b?text=Qualitech";

async function seedCategories(): Promise<string[]> {
  const c1 = await prisma.machineCategory.create({
    data: {
      sortOrder: 0,
      featured: true,
      published: true,
      translations: {
        create: [
          { locale: AppLocale.ru, name: "ЧПУ станки", slug: "cnc-stanki" },
          { locale: AppLocale.en, name: "CNC machines", slug: "cnc-machines" },
        ],
      },
    },
  });
  const c2 = await prisma.machineCategory.create({
    data: {
      sortOrder: 1,
      featured: true,
      published: true,
      translations: {
        create: [
          { locale: AppLocale.ru, name: "Робототехника", slug: "robototekhnika" },
          { locale: AppLocale.en, name: "Robotics", slug: "robotics" },
        ],
      },
    },
  });
  const c3 = await prisma.machineCategory.create({
    data: {
      sortOrder: 2,
      featured: true,
      published: true,
      translations: {
        create: [
          { locale: AppLocale.ru, name: "Автоматизация", slug: "avtomatizatsiya" },
          { locale: AppLocale.en, name: "Automation", slug: "automation" },
        ],
      },
    },
  });
  return [c1.id, c2.id, c3.id];
}

async function seedMachine(categoryId: string): Promise<void> {
  await prisma.machine.create({
    data: {
      slug: "demo-machine",
      categoryId,
      featured: true,
      published: true,
      sortOrder: 0,
      translations: {
        create: [
          {
            locale: AppLocale.ru,
            title: "Демо-станок",
            description:
              "<p>Краткое описание для каталога.</p><p>Полное описание оборудования для детальной страницы.</p>",
            metaTitle: "Демо-станок | Qualitech",
            metaDescription: "SEO описание на русском.",
            ogImageUrl: PLACEHOLDER_IMAGE,
          },
          {
            locale: AppLocale.en,
            title: "Demo machine",
            description:
              "<p>Short catalog description.</p><p>Full machine description for the product page.</p>",
            metaTitle: "Demo machine | Qualitech",
            metaDescription: "English SEO description.",
            ogImageUrl: PLACEHOLDER_IMAGE,
          },
        ],
      },
      images: {
        create: [{ url: PLACEHOLDER_IMAGE, alt: "Demo", sortOrder: 0, isPrimary: true }],
      },
    },
  });
}

async function seedBlog(): Promise<void> {
  const now = new Date();
  await prisma.blogPost.create({
    data: {
      published: true,
      publishedAt: now,
      translations: {
        create: [
          {
            locale: AppLocale.ru,
            title: "Добро пожаловать в блог",
            slug: "welcome-ru",
            excerpt: "Первый пост для проверки схемы.",
            content: "<p>Содержимое статьи (HTML).</p>",
            metaTitle: "Блог Qualitech",
            metaDescription: "Новости и статьи.",
          },
          {
            locale: AppLocale.en,
            title: "Welcome to the blog",
            slug: "welcome-en",
            excerpt: "First post to validate the schema.",
            content: "<p>Article body (HTML).</p>",
            metaTitle: "Qualitech blog",
            metaDescription: "News and articles.",
          },
        ],
      },
    },
  });
}

async function seedAdminIfConfigured(): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD?.trim();
  if (!email || !password) {
    return;
  }

  const syncPassword = process.env.ADMIN_SEED_SYNC_PASSWORD?.trim() === "true";
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    if (syncPassword) {
      const passwordHash = await argon2.hash(password);
      await prisma.adminUser.update({ where: { email }, data: { passwordHash } });
    }
    return;
  }

  const count = await prisma.adminUser.count();
  if (count > 0 && !syncPassword) {
    return;
  }

  const passwordHash = await argon2.hash(password);
  await prisma.adminUser.create({ data: { email, passwordHash } });
}

async function main(): Promise<void> {
  await seedAdminIfConfigured();

  const existing = await prisma.machine.count();
  if (existing > 0) {
    return;
  }

  const categoryIds = await seedCategories();
  await seedMachine(categoryIds[0]!);
  await seedBlog();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err: unknown) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
