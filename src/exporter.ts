import { Gauge, Histogram } from 'prom-client'
import type { Registry } from 'prom-client'
import type { ConnectionCreatedEvent, ConnectionClosedEvent, ConnectionPoolCreatedEvent, ConnectionCheckOutStartedEvent, ConnectionCheckedOutEvent, ConnectionCheckOutFailedEvent, ConnectionCheckedInEvent, ConnectionPoolClosedEvent, CommandSucceededEvent, CommandFailedEvent, MongoClient } from 'mongodb'

// pool metrics
const poolSize = new Gauge({
  name: 'mongodb_driver_pool_size',
  help: 'the current size of the connection pool, including idle and and in-use members',
  labelNames: [
    'server_address'
  ]
})
const minSize = new Gauge({
  name: 'mongodb_driver_pool_min',
  help: 'the minimum size of the connection pool',
  labelNames: [
    'server_address'
  ]
})
const maxSize = new Gauge({
  name: 'mongodb_driver_pool_max',
  help: 'the maximum size of the connection pool',
  labelNames: [
    'server_address'
  ]
})
const checkedOut = new Gauge({
  name: 'mongodb_driver_pool_checkedout',
  help: 'the count of connections that are currently in use',
  labelNames: [
    'server_address'
  ]
})
const waitQueueSize = new Gauge({
  name: 'mongodb_driver_pool_waitqueuesize',
  help: 'the current size of the wait queue for a connection from the pool',
  labelNames: [
    'server_address'
  ]
})

// command metrics
const commands = new Histogram({
  name: 'mongodb_driver_commands_seconds',
  help: 'Timer of mongodb commands',
  labelNames: [
    'command',
    'server_address',
    'status'
  ]
})

/**
 * Exposes metrics for the provided Mongo client in prometheus format.
 *
 * @param mongoClient The mongoClient for which to expose metrics in prometheus format.
 * @param register the prometheus registry used to expose the metrics.
 */
export function monitorMongoDBDriver (mongoClient: MongoClient, register: Registry, options?: MongoDBDriverExporterOptions): void {
  if (mongoClient == null) {
    options?.logger?.error('mongoClient is null or undefined. No metrics can be exported.')
    return
  }

  if (register == null) {
    options?.logger?.error('register is null or undefined. No metrics can be exported.')
    return
  }

  const monitorCommands = mongoClient.options.monitorCommands.valueOf()

  // register metrics
  register.registerMetric(poolSize)
  register.registerMetric(minSize)
  register.registerMetric(maxSize)
  register.registerMetric(checkedOut)
  register.registerMetric(waitQueueSize)
  if (monitorCommands) {
    register.registerMetric(commands)
  }

  // pool metrics
  mongoClient.on('connectionPoolCreated', (event) => { onConnectionPoolCreated(event) })
  mongoClient.on('connectionPoolClosed', (event) => { onConnectionPoolClosed(event) })
  mongoClient.on('connectionCreated', (event) => { onConnectionCreated(event) })
  mongoClient.on('connectionClosed', (event) => { onConnectionClosed(event) })
  mongoClient.on('connectionCheckOutStarted', (event) => { onConnectionCheckOutStarted(event) })
  mongoClient.on('connectionCheckedOut', (event) => { onConnectionCheckedOut(event) })
  mongoClient.on('connectionCheckOutFailed', (event) => { onConnectionCheckOutFailed(event) })
  mongoClient.on('connectionCheckedIn', (event) => { onConnectionCheckedIn(event) })
  options?.logger?.log('Successfully enabled connection pool metrics for the MongoDB Node.js driver.')

  // command metrics
  if (monitorCommands) {
    mongoClient.on('commandSucceeded', (event) => { onCommandSucceeded(event) })
    mongoClient.on('commandFailed', (event) => { onCommandFailed(event) })
    options?.logger?.log('Successfully enabled command metrics for the MongoDB Node.js driver.')
  }
}

function onConnectionPoolCreated (event: ConnectionPoolCreatedEvent): void {
  poolSize.set({ server_address: event.address }, 0)
  minSize.set({ server_address: event.address }, event.options!.minPoolSize)
  maxSize.set({ server_address: event.address }, event.options!.maxPoolSize)
  checkedOut.set({ server_address: event.address }, 0)
  waitQueueSize.set({ server_address: event.address }, 0)
}

function onConnectionCreated (event: ConnectionCreatedEvent): void {
  poolSize.inc({ server_address: event.address })
}

function onConnectionClosed (event: ConnectionClosedEvent): void {
  poolSize.dec({ server_address: event.address })
}

function onConnectionCheckOutStarted (event: ConnectionCheckOutStartedEvent): void {
  waitQueueSize.inc({ server_address: event.address })
}

function onConnectionCheckedOut (event: ConnectionCheckedOutEvent): void {
  checkedOut.inc({ server_address: event.address })
  waitQueueSize.dec({ server_address: event.address })
}

function onConnectionCheckOutFailed (event: ConnectionCheckOutFailedEvent): void {
  waitQueueSize.dec({ server_address: event.address })
}

function onConnectionCheckedIn (event: ConnectionCheckedInEvent): void {
  checkedOut.dec({ server_address: event.address })
}

function onConnectionPoolClosed (event: ConnectionPoolClosedEvent): void {
  poolSize.set({ server_address: event.address }, 0)
  minSize.reset()
  maxSize.reset()
  checkedOut.reset()
  waitQueueSize.reset()
}

function onCommandSucceeded (event: CommandSucceededEvent): void {
  commands.observe({ command: event.commandName, server_address: event.address, status: 'SUCCESS' }, event.duration * 1000)
}

function onCommandFailed (event: CommandFailedEvent): void {
  commands.observe({ command: event.commandName, server_address: event.address, status: 'FAILED' }, event.duration * 1000)
}
/**
 * Optional parameter used by the exporter.
 */
export interface MongoDBDriverExporterOptions {
  logger?: Logger
}
/**
 * Logger which is used to print information from the exporter
 */
export interface Logger {
  /**
   * Prints regular messages
   * @param message the message to print
   * @returns void
   */
  log: (message: string) => void
  /**
   * Prints error messages
   * @param message the error message to print
   * @returns void
   */
  error: (message: string) => void
}
