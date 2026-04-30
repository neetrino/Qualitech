/** Default page index for public machine list APIs. */
export const MACHINES_LIST_DEFAULT_PAGE = 1;

/** Default page size for `/machines/[category]` listing. */
export const MACHINES_LIST_DEFAULT_LIMIT = 12;

/** Hard cap for `limit` query on machine list APIs. */
export const MACHINES_LIST_MAX_LIMIT = 50;

/** Max items in the “related machines” carousel on product detail. */
export const RELATED_MACHINES_CAROUSEL_LIMIT = 12;

/** Shared ISR/cache TTL for public machines data reads. */
export const MACHINES_PUBLIC_DATA_REVALIDATE_SEC = 60;

/**
 * `unstable_cache` tag for public machine-category card lists (home + `/machines`).
 * Invalidate via `revalidateTag` after admin category mutations.
 */
export const MACHINE_CATEGORY_PUBLIC_CACHE_TAG = "public-machine-category-cards";
