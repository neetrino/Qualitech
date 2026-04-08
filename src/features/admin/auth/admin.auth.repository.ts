import { prisma } from "@/lib/db";

export async function findAdminUserByEmail(email: string) {
  return prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function findAdminUserById(id: string) {
  return prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
}
