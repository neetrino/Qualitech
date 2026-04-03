import { AppLocale, PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const PLACEHOLDER_IMAGE = "https://placehold.co/800x600/e2e8f0/64748b?text=Qualitech";

async function seedCategories(): Promise<{ id: string }> {
  const category = await prisma.machineCategory.create({
    data: {
      sortOrder: 0,
      translations: {
        create: [
          {
            locale: AppLocale.ru,
            name: "Станки",
            slug: "stanki",
          },
          {
            locale: AppLocale.en,
            name: "Machines",
            slug: "machines",
          },
        ],
      },
    },
  });
  return category;
}

async function seedMachine(categoryId: string): Promise<void> {
  await prisma.machine.create({
    data: {
      categoryId,
      featured: true,
      published: true,
      sortOrder: 0,
      translations: {
        create: [
          {
            locale: AppLocale.ru,
            title: "Демо-станок",
            slug: "demo-stanok",
            shortDescription: "Краткое описание для каталога.",
            body: "Полное описание оборудования для детальной страницы.",
            metaTitle: "Демо-станок | Qualitech",
            metaDescription: "SEO описание на русском.",
            ogImageUrl: PLACEHOLDER_IMAGE,
          },
          {
            locale: AppLocale.en,
            title: "Demo machine",
            slug: "demo-machine",
            shortDescription: "Short catalog description.",
            body: "Full machine description for the product page.",
            metaTitle: "Demo machine | Qualitech",
            metaDescription: "English SEO description.",
            ogImageUrl: PLACEHOLDER_IMAGE,
          },
        ],
      },
      images: {
        create: [
          { url: PLACEHOLDER_IMAGE, alt: "Demo", sortOrder: 0 },
        ],
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
  const count = await prisma.adminUser.count();
  if (count > 0) {
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

  const category = await seedCategories();
  await seedMachine(category.id);
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
