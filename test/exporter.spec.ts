import { Registry } from "prom-client";
import { MongoClient } from "mongodb";
import { monitorMongoDBDriver } from "../src";
import { beforeEach, describe, expect, test, jest } from '@jest/globals';

jest.mock("mongodb");
jest.mock("prom-client")

describe('test parameter checks', () => {
  let mongoClient: MongoClient;
  let register: Registry;

  beforeEach(() => {
    mongoClient = new MongoClient("");
    register = new Registry();
  });

  test('monitorMongoDBDriver', () => {
    monitorMongoDBDriver(mongoClient, register);
    expect(console.log())
  });
});