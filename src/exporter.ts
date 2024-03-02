import type { MongoClient } from 'mongodb'
import { type Registry } from 'prom-client'
import { MongoDBDriverExporter } from './mongoDBDriverExporter'

/**
 * Exposes metrics for the provided Mongo client in prometheus format.
 *
 * @param mongoClient The mongoClient for which to expose metrics in prometheus format.
 * @param register the prometheus registry used to expose the metrics.
 * @param options optional parameters to configure the exporter
 */
export function monitorMongoDBDriver (mongoClient: MongoClient, register: Registry, options?: MongoDBDriverExporterOptions): void {
  const exporter = new MongoDBDriverExporter(mongoClient, register, options)
  exporter.enableMetrics()
}

/**
 * Optional parameter to configure the exporter.
 */
export interface MongoDBDriverExporterOptions {
  logger?: Logger
  /**
   * Buckets for the mongodb_driver_commands_seconds_bucket metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  mongodbDriverCommandsSecondsHistogramBuckets?: number[]

  /**
   * Default labels for all metrics, e.g. {'foo':'bar', alice: 3}
   */
  defaultLabels?: Record<string, string | number>

  /**
   * Name prefix for all metrics, e.g. 'service1_'
   */
  prefix?: string
}

/**
 * Logger which is used to print information from the exporter
 */
export interface Logger {
  /**
   * Prints info messages
   * @param message the message to print
   * @returns void
   */
  info: (message: string) => void

  /**
   * Prints warn messages
   * @param message the warn message to print
   * @returns void
   */
  warn: (message: string) => void

  /**
   * Prints error messages
   * @param message the error message to print
   * @returns void
   */
  error: (message: string) => void
}
