export interface LoggerInstance {
  warn: (code?: string, ...message: unknown[]) => void
  error: (code?: string, ...message: unknown[]) => void
  debug: (code?: string, ...message: unknown[]) => void
}
