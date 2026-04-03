type LogLevel = "debug" | "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (isProd && level === "debug") {
    return;
  }

  if (isProd) {
    const record: Record<string, unknown> = {
      level,
      message,
      time: new Date().toISOString(),
      ...meta,
    };
    const line = JSON.stringify(record);
    switch (level) {
      case "error":
        console.error(line);
        break;
      case "warn":
        console.warn(line);
        break;
      default:
        console.info(line);
    }
    return;
  }

  const payload = meta ? `${message} ${JSON.stringify(meta)}` : message;
  switch (level) {
    case "error":
      console.error(payload);
      break;
    case "warn":
      console.warn(payload);
      break;
    default:
      console.info(payload);
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
};
