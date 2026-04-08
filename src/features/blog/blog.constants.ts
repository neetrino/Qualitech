export const BLOG_LIST_DEFAULT_PAGE = 1;
export const BLOG_LIST_DEFAULT_LIMIT = 20;
export const BLOG_LIST_MAX_LIMIT = 50;

/** ISR / `unstable_cache` TTL for public blog reads (admin updates may lag briefly). */
export const BLOG_PUBLIC_DATA_REVALIDATE_SEC = 60;

/** Invalidate via `revalidateTag` after admin blog create/update/delete so public pages refresh immediately. */
export const BLOG_PUBLIC_CACHE_TAG = "blog-public";

/** Air below fixed-header clearance on blog index (inner wrapper; stacks with `HERO_CONTENT_TOP_PAD`). */
export const BLOG_LIST_INDEX_EXTRA_TOP_SPACING = "pt-4 sm:pt-6";

/** Single-image hero on post detail: text overlaid; keep in sync with layout in `blog-detail.page.tsx`. */
export const BLOG_DETAIL_HERO_OVERLAY_MIN_HEIGHT_CLASSNAME =
  "min-h-[min(78vh,820px)] sm:min-h-[min(74vh,960px)] lg:min-h-[min(70vh,1080px)]";
