import { prisma } from "@/lib/db";

export type ContactMessageAdminRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

function toRow(msg: {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  readAt: Date | null;
}): ContactMessageAdminRow {
  return {
    id: msg.id,
    name: msg.name,
    email: msg.email,
    message: msg.message,
    createdAt: msg.createdAt.toISOString(),
    readAt: msg.readAt ? msg.readAt.toISOString() : null,
  };
}

export async function listContactMessagesForAdmin(): Promise<ContactMessageAdminRow[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      createdAt: true,
      readAt: true,
    },
  });
  return rows.map(toRow);
}

export async function markContactMessageRead(id: string): Promise<ContactMessageAdminRow | null> {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { readAt: new Date() },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        createdAt: true,
        readAt: true,
      },
    });
    return toRow(updated);
  } catch {
    return null;
  }
}
