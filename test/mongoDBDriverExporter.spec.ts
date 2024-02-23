import { beforeEach, describe, expect, test } from '@jest/globals'
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
    // eslint-disable-next-line no-new
    new MongoDBDriverExporter(mongoClient, register)
    expect(register.getMetricsAsArray().length).toBe(6)
    expect(register.getSingleMetric('mongodb_driver_pool_size')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_min')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_max')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_checkedout')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_waitqueuesize')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_commands_seconds')).toBeDefined()
  })

  test('tests if connection and commands metrics are registered in registry with optional configurations', () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    const options = {
      mongodbDriverCommandsSecondsHistogramBuckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 20], 
      defaultLabels: { foo: 'bar', alice: 2 }
    }
    // eslint-disable-next-line no-new
    new MongoDBDriverExporter(mongoClient, register, options)
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
    expect(register.getMetricsAsArray().length).toBe(5)
    expect(register.getSingleMetric('mongodb_driver_pool_size')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_min')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_max')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_checkedout')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_pool_waitqueuesize')).toBeDefined()
    expect(register.getSingleMetric('mongodb_driver_commands_seconds')).toBeUndefined()
  })

  test('tests if event connection and command listeners are registered for mongo client events', () => {
    const events: string[] = [
      'connectionPoolCreated', 'connectionPoolClosed', 'connectionCreated', 'connectionClosed', 'connectionCheckOutStarted',
      'connectionCheckedOut', 'connectionCheckOutFailed', 'connectionCheckedIn', 'commandSucceeded', 'commandFailed'
    ]
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true })
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.enableMetrics()
    expect(mongoClient.eventNames()).toHaveLength(10)
    expect(mongoClient.eventNames()).toEqual(expect.arrayContaining(events))
    events.forEach(event => {
      expect(mongoClient.listenerCount(event)).toBe(1)
      expect(mongoClient.listeners(event).at(0)).toBeInstanceOf(Function)
    })
  })

  test('tests if only event connection listeners are registered for mongo client events', () => {
    const events: string[] = [
      'connectionPoolCreated', 'connectionPoolClosed', 'connectionCreated', 'connectionClosed', 'connectionCheckOutStarted',
      'connectionCheckedOut', 'connectionCheckOutFailed', 'connectionCheckedIn'
    ]
    const mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: false })
    const exporter = new MongoDBDriverExporter(mongoClient, register)
    exporter.enableMetrics()
    expect(mongoClient.eventNames()).toHaveLength(8)
    expect(mongoClient.eventNames()).toEqual(expect.arrayContaining(events))
    events.forEach(event => {
      expect(mongoClient.listenerCount(event)).toBe(1)
      expect(mongoClient.listeners(event).at(0)).toBeInstanceOf(Function)
    })
  })
})
