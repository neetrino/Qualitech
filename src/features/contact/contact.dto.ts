export type ContactSubmitResultDto = {
  id: string;
  createdAt: string;
  /** True when this response comes from an earlier successful submit with the same idempotency key. */
  replay: boolean;
};
