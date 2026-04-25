/**
 * Purpose: Lightweight structured logger for framework messages.
 * Why used: JSON logs are easier to search and safer to parse than scattered console text.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogMetadata = Record<string, unknown>;

function writeLog(level: LogLevel, message: string, metadata: LogMetadata = {}): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata
  };

  console.log(JSON.stringify(payload));
}

export const logger = {
  debug: (message: string, metadata?: LogMetadata) => writeLog('debug', message, metadata),
  info: (message: string, metadata?: LogMetadata) => writeLog('info', message, metadata),
  warn: (message: string, metadata?: LogMetadata) => writeLog('warn', message, metadata),
  error: (message: string, metadata?: LogMetadata) => writeLog('error', message, metadata)
};
