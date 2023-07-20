import { Registry } from 'prom-client'
import { MongoClient } from 'mongodb'
import { monitorMongoDBDriver } from '../src'
import { beforeEach, describe, expect, test, jest } from '@jest/globals'

jest.mock('mongodb', () => jest.fn())
jest.mock('prom-client', () => jest.fn())

describe('monitorMongoDBDriver', () => {
  let mongoClient: MongoClient
  let register: Registry

  beforeEach(() => {
    mongoClient = new MongoClient('mongodb://localhost:27017', { monitorCommands: true });

    register = new Registry()
  })

  test('monitorMongoDBDriver', () => {
    monitorMongoDBDriver(mongoClient, register);
  })
})
