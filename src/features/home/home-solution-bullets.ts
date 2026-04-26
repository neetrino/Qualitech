/** Admin textarea allows up to 12 lines; allow extra after splitting embedded newlines in stored values. */
const HOME_SOLUTION_BULLET_CAP = 24;

/**
 * Turns stored bullet strings into one item per visible line so each row can show its own marker
 * (handles a single DB array element that contains multiple newline-separated lines).
 */
export function normalizeHomeSolutionBulletLines(bullets: readonly string[]): string[] {
  const out: string[] = [];
  for (const raw of bullets) {
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (t.length > 0) {
        out.push(t);
      }
    }
  }
  return out.slice(0, HOME_SOLUTION_BULLET_CAP);
}
