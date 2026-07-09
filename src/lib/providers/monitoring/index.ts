import { env } from "@/lib/env";

export interface MonitoringProvider {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  audit(action: string, context?: Record<string, unknown>): void;
}

class ConsoleMonitoringProvider implements MonitoringProvider {
  captureException(error: Error, context?: Record<string, unknown>) {
    console.error(`🚨 [Monitoring] Exception:`, error.message, context || "");
  }
  captureMessage(message: string, context?: Record<string, unknown>) {
    console.log(`ℹ️ [Monitoring] Message:`, message, context || "");
  }
  info(message: string, context?: Record<string, unknown>) { console.info(`[INFO] ${message}`, context || ""); }
  warn(message: string, context?: Record<string, unknown>) { console.warn(`[WARN] ${message}`, context || ""); }
  error(message: string, context?: Record<string, unknown>) { console.error(`[ERROR] ${message}`, context || ""); }
  audit(action: string, context?: Record<string, unknown>) { console.log(`[AUDIT] ${action}`, context || ""); }
}

class SentryMonitoringProvider extends ConsoleMonitoringProvider {
  captureException(error: Error, context?: Record<string, unknown>) {
    // Sentry.captureException(error, { extra: context })
    super.captureException(error, context);
  }
  captureMessage(message: string, context?: Record<string, unknown>) {
    // Sentry.captureMessage(message, { extra: context })
    super.captureMessage(message, context);
  }
}

export const monitoringProvider: MonitoringProvider =
  env.SENTRY_DSN
    ? new SentryMonitoringProvider()
    : new ConsoleMonitoringProvider();
