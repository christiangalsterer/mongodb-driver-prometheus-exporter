import { beforeEach, describe, expect, test} from '@jest/globals'
import { Registry } from 'prom-client'
import { MongoClient } from 'mongodb'
import { MongoDBDriverExporter } from '../src/mongoDBDriverExporter'

describe('tests mongoDBDriverExporter', () => {
  let register: Registry

  beforeEach(() => {
    register = new Registry()
  })

  test('tests if connection and commands metrics are registered in registry', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.enableMetrics()
    expect(register.getMetricsAsArray().length).toBe(6)
    expect(register.getSingleMetric('mongodb_driver_pool_size')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_min')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_max')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_checkedout')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_waitqueuesize')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_commands_seconds')).toBeDefined()
  })

  test('tests if only connection metrics are registered in registry', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: false })
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.enableMetrics()
    console.log(register.getMetricsAsArray())
    expect(register.getMetricsAsArray().length).toBe(5)
    expect(register.getSingleMetric('mongodb_driver_pool_size')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_min')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_max')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_checkedout')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_waitqueuesize')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_commands_seconds')).toBeUndefined()
  })

  test('tests if event connection and command listeners are registered for mongo client events', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    const options = { mongodbDriverCommandsSecondsHistogramBuckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 20], defaultLabels: { foo: 'bar', alice: 2 } }
    const exporter = new MongoDBDriverExporter(mongoClient, register, options)
    exporter.enableMetrics()
    expect(mongoClient.listenerCount('connectionPoolCreated')).toBe(1)
    expect(mongoClient.listenerCount('connectionPoolClosed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCreated')).toBe(1)
    expect(mongoClient.listenerCount('connectionClosed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckOutStarted')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckedOut')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckOutFailed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckedIn')).toBe(1)
    expect(mongoClient.listenerCount('commandSucceeded')).toBe(1)
    expect(mongoClient.listenerCount('commandFailed')).toBe(1)
  })

  test('tests if only event connection listeners are registered for mongo client events', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: false })
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.enableMetrics()
    expect(mongoClient.listenerCount('connectionPoolCreated')).toBe(1)
    expect(mongoClient.listenerCount('connectionPoolClosed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCreated')).toBe(1)
    expect(mongoClient.listenerCount('connectionClosed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckOutStarted')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckedOut')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckOutFailed')).toBe(1)
    expect(mongoClient.listenerCount('connectionCheckedIn')).toBe(1)
    expect(mongoClient.listenerCount('commandSucceeded')).toBe(0)
    expect(mongoClient.listenerCount('commandFailed')).toBe(0)
  })
})
