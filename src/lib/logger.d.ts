export interface LoggerInstance {
  warn: (code?: string, ...message: unknown[]) => void
  error: (code?: string, ...message: unknown[]) => void
  debug: (code?: string, ...message: unknown[]) => void
}

export declare function proxyLogger (logger: LoggerInstance, basePath: string): LoggerInstance

const _logger: LoggerInstance
export default _logger
