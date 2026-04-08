import Image from "next/image";
import Link from "next/link";

import type { MachineListItemDto } from "@/features/machines/machines.dto";
import type { MachinesMessages } from "@/features/machines/machines.messages";
import type { HomeLocale } from "@/features/home/home.messages";
import { isRemoteImageUrl } from "@/lib/image/remote-image-url";
import { machineDetailHref } from "@/lib/i18n/locale-routes";

type MachineListCardProps = {
  readonly locale: HomeLocale;
  readonly sectionSlug: string;
  readonly messages: MachinesMessages;
  readonly machine: MachineListItemDto;
};

export function MachineListCard({ locale, sectionSlug, messages, machine }: MachineListCardProps) {
  const href = machineDetailHref(locale, sectionSlug, machine.slug);
  const alt = machine.coverImage?.alt?.trim() || messages.cardFallbackAlt;
  const coverSrc = machine.coverImage?.url?.trim() ?? "";
  const showCover = coverSrc.length > 0;

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#18181b] bg-black p-px transition hover:border-[#27272a]">
      <Link className="relative block h-[200px] shrink-0 overflow-hidden rounded-t-[12px] bg-[#18181b] sm:h-[220px]" href={href}>
        {showCover ? (
          <Image
            alt={alt}
            className="object-cover transition duration-300 hover:scale-[1.02]"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            src={coverSrc}
            unoptimized={isRemoteImageUrl(coverSrc)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#18181b_0%,#09090b_100%)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#52525c]">
            Qualitech
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.35)] to-transparent" />
      </Link>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5 sm:py-6">
        <h2 className="font-display text-lg uppercase leading-snug tracking-tight text-white sm:text-xl">
          <Link className="transition hover:text-[#ff6900]" href={href}>
            {machine.title}
          </Link>
        </h2>
        <p className="mt-3 min-h-0 flex-1 text-sm leading-relaxed text-[#9f9fa9]">{machine.descriptionExcerpt}</p>
        <Link
          className="mt-5 inline-flex shrink-0 items-center gap-1.5 self-start text-[11px] font-black uppercase tracking-[0.12em] text-[#ff6900] transition hover:brightness-110 sm:text-xs"
          href={href}
        >
          {messages.readDetails}
        </Link>
      </div>
    </article>
  );
}
