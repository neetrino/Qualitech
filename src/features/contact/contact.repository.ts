import { prisma } from "@/lib/db";

export type ContactMessageCreateInput = {
  name: string;
  email: string;
  message: string;
  idempotencyKey: string | null;
};

export async function findContactMessageByIdempotencyKey(idempotencyKey: string) {
  return prisma.contactMessage.findUnique({
    where: { idempotencyKey },
  });
}

export async function createContactMessage(input: ContactMessageCreateInput) {
  return prisma.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      message: input.message,
      idempotencyKey: input.idempotencyKey,
    },
  });
}
