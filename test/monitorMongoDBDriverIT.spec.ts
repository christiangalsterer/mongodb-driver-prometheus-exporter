import { beforeEach, describe, expect, test } from '@jest/globals'
import { MongoDBContainer, type StartedMongoDBContainer } from '@testcontainers/mongodb'
import { MongoClient } from 'mongodb'
import { type MetricValueWithName, Registry } from 'prom-client'

import { monitorMongoDBDriver } from '../src/exporter'

describe('it monitorMongoDBDriver', () => {
  let mongoClient: MongoClient
  let register: Registry
  let mongoDBContainer: StartedMongoDBContainer

  beforeAll(async () => {
    mongoDBContainer = await new MongoDBContainer('mongo:6.0.17').start()
  }, 60000)

  afterAll(async () => {
    await mongoDBContainer.stop()
  })

  beforeEach(async () => {
    mongoClient = new MongoClient(mongoDBContainer.getConnectionString(), {
      directConnection: true,
      monitorCommands: true,
      minPoolSize: 0,
      maxPoolSize: 10
    })
    register = new Registry()
    monitorMongoDBDriver(mongoClient, register)
    await mongoClient.connect()
  })

  afterEach(async () => {
    await mongoClient.close()
  })

  test('it mongodb driver pool metrics ', async () => {
    await mongoClient.db('admin').command({ ping: 1 })
    const mongodbDrivePoolSize = await register.getSingleMetric('mongodb_driver_pool_size')?.get()
    expect(mongodbDrivePoolSize?.type).toEqual('gauge')
    expect(mongodbDrivePoolSize?.values.length).toEqual(1)
    expect(mongodbDrivePoolSize?.values.at(0)?.value).toEqual(1)

    const mongodbDrivePoolMax = await register.getSingleMetric('mongodb_driver_pool_max')?.get()
    expect(mongodbDrivePoolMax?.type).toEqual('gauge')
    expect(mongodbDrivePoolMax?.values.length).toEqual(1)
    expect(mongodbDrivePoolMax?.values.at(0)?.value).toEqual(10)
  })

  test('it mongodb driver command metrics ', async () => {
    await mongoClient.db('admin').command({ ping: 1 })
    const mongodbDriverCommandsSeconds = await register.getSingleMetric('mongodb_driver_commands_seconds')?.get()
    expect(mongodbDriverCommandsSeconds?.type).toEqual('histogram')
    expect(getValueByName('mongodb_driver_commands_seconds_count', mongodbDriverCommandsSeconds?.values)?.value).toEqual(1)
    expect(getValueByName('mongodb_driver_commands_seconds_sum', mongodbDriverCommandsSeconds?.values)?.value).toBeGreaterThanOrEqual(0)
  })
})

function getValueByName(name: string, values: Array<MetricValueWithName<string>> | undefined): MetricValueWithName<string> | undefined {
  let result: MetricValueWithName<string> | undefined
  if (values !== undefined) {
    const filtered: Array<MetricValueWithName<string>> = values.filter((v) => v.metricName === name)
    if (filtered.length > 0) {
      result = filtered.at(0)
    } else {
      result = undefined
    }
  }
  return result
}
