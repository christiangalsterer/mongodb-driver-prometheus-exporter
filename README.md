![npm downloads](https://img.shields.io/npm/dt/@christiangalsterer/mongodb-driver-prometheus-exporter.svg)
![npm version](https://img.shields.io/npm/v/@christiangalsterer/mongodb-driver-prometheus-exporter.svg)
![npm licence](https://img.shields.io/npm/l/@christiangalsterer/mongodb-driver-prometheus-exporter.svg)
![github stars](https://img.shields.io/github/stars/christiangalsterer/mongodb-driver-prometheus-exporter.svg)

# Prometheus Exporter for offical MongoDB Node.js driver

A prometheus exporter exposing metrics for the official [MongoDB Node.js driver](https://www.mongodb.com/docs/drivers/node/current/).

Metrics names follow the same patterns as exposed by [micrometer](https://github.com/micrometer-metrics/micrometer)

## Available Metrics
The exporter provides the following metrics.

|Metric Name|Description|Labels|
|---|---|---|
|mongodb_driver_pool_size | the current size of the connection pool, including idle and and in-use members | <ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul>|
|mongodb_driver_pool_min|the minimum size of the connection pool|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> |
|mongodb_driver_pool_max|the maximum size of the connection pool|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> |
|mongodb_driver_pool_checkedout|the count of connections that are currently in use|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> |
|mongodb_driver_pool_waitqueuesize|the current size of the wait queue for a connection from the pool|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> |
|mongodb_driver_commands_seconds_sum|Duration of the executed command in seconds| <ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><li> _command_: Name if the command </li><li> _status_: SUCCESS or ERROR </li><ul>|
|mongodb_driver_commands_seconds_count|Number of executed commands|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><li> _command_: Name if the command </li><li> _status_: SUCCESS or ERROR</li><ul>|

# Usage

## Add Dependency

```sh
npm i @christiangalsterer/mongodb-driver-prometheus-exporter
```

## Import Package

```ts
import { MongoClient } from "mongodb";
import { Registry } from "prom-client";
import { monitorMongoDBDriver } from "@christiangalsterer/mongodb-driver-prometheus-exporter";

...

// setup the MongoDB client, monitorCommands needs to be set to true to enable command monitoring.
const mongoClient = new MongoClient(uri, { monitorCommands = true })

// setup the prometheus client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// monitor MongoDB driver
monitorMongoDBDriver(mongoClient, register);

...

// connect to MongoDB after monitorMongoDBDriver()
mongoClient.connect();

``````

# Contributions

Contributions are highly welcomed. If you want to contribute to this project please create a github issue and/or provide a pull request for review.

