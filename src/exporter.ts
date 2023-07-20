import { Gauge, Histogram } from 'prom-client'
import type { Registry } from 'prom-client'
import type { MongoClient } from 'mongodb'

/**
 * Exposes metrics for the provided Mongo client in prometheus format.
 *
 * @param mongoClient The mongoClient for which to expose metrics in prometheus format.
 * @param register the prometheus registry used to expose the metrics.
 */
export function monitorMongoDBDriver (mongoClient: MongoClient, register: Registry): void {
  if (mongoClient == null) {
    console.error('mongoClient is null or undefined. No metrics can be exported.')
    return
  }

  if (register == null) {
    console.error('register is null or undefined. No metrics can be exported.')
    return
  }

  const monitorCommands = mongoClient.options.monitorCommands.valueOf()

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
  mongoClient.on('connectionPoolCreated', (event) => { poolSize.set({ server_address: event.address }, 0) })
  mongoClient.on('connectionPoolCreated', (event) => { minSize.set({ server_address: event.address }, event.options!.minPoolSize) })
  mongoClient.on('connectionPoolCreated', (event) => { maxSize.set({ server_address: event.address }, event.options!.maxPoolSize) })
  mongoClient.on('connectionPoolCreated', (event) => { checkedOut.set({ server_address: event.address }, 0) })
  mongoClient.on('connectionPoolCreated', (event) => { waitQueueSize.set({ server_address: event.address }, 0) })
  mongoClient.on('connectionCreated', (event) => { poolSize.inc({ server_address: event.address }) })
  mongoClient.on('connectionCreated', (event) => { poolSize.dec({ server_address: event.address }) })
  mongoClient.on('connectionCheckOutStarted', (event) => { waitQueueSize.inc({ server_address: event.address }) })
  mongoClient.on('connectionCheckedOut', (event) => { checkedOut.inc({ server_address: event.address }) })
  mongoClient.on('connectionCheckedOut', (event) => { waitQueueSize.dec({ server_address: event.address }) })
  mongoClient.on('connectionCheckOutFailed', (event) => { waitQueueSize.dec({ server_address: event.address }) })
  mongoClient.on('connectionCheckedIn', (event) => { checkedOut.dec({ server_address: event.address }) })
  mongoClient.on('connectionPoolClosed', (event) => { poolSize.set({ server_address: event.address }, 0) })
  mongoClient.on('connectionPoolClosed', () => { minSize.reset() })
  mongoClient.on('connectionPoolClosed', () => maxSize.reset)
  mongoClient.on('connectionPoolClosed', () => { checkedOut.reset() })
  mongoClient.on('connectionPoolClosed', () => { waitQueueSize.reset() })

  console.log('Successfully enabled connection pool metrics for the MongoDB Node.js driver.')

  // command metrics
  if (monitorCommands) {
    mongoClient.on('commandSucceeded', (event) => { commands.observe({ command: event.commandName, server_address: event.address, status: 'SUCCESS' }, event.duration * 1000) })
    mongoClient.on('commandFailed', (event) => { commands.observe({ command: event.commandName, server_address: event.address, status: 'FAILED' }, event.duration * 1000) })
    console.log('Successfully enabled command metrics for the MongoDB Node.js driver.')
  }
}
