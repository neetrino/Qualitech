export const BLOG_LIST_DEFAULT_PAGE = 1;
export const BLOG_LIST_DEFAULT_LIMIT = 20;
export const BLOG_LIST_MAX_LIMIT = 50;

/** ISR / `unstable_cache` TTL for public blog reads (admin updates may lag briefly). */
export const BLOG_PUBLIC_DATA_REVALIDATE_SEC = 60;

/** Invalidate via `revalidateTag` after admin blog create/update/delete so public pages refresh immediately. */
export const BLOG_PUBLIC_CACHE_TAG = "blog-public";

/** Air below fixed-header clearance on blog index (inner wrapper; stacks with `HERO_CONTENT_TOP_PAD`). */
export const BLOG_LIST_INDEX_EXTRA_TOP_SPACING = "pt-4 sm:pt-6";

/** Short articles put the lead image after the body; longer ones insert it mid-article. */
export const BLOG_INLINE_IMAGE_MIN_BLOCKS_FOR_MID = 3;

/** Plain-text CMS lines shorter than this, without sentence punctuation, render as headings. */
export const BLOG_PLAIN_TEXT_HEADING_MAX_CHARS = 80;
