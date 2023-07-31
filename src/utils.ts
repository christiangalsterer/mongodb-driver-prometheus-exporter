import type { Logger } from './exporter'

export class ConsoleLogger implements Logger {
  info (message: string): void {
    console.log(message)
  }

  warn (message: string): void {
    console.log(message)
  }

  error (message: string): void {
    console.log(message)
  }
}
