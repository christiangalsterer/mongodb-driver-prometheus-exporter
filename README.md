![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/christiangalsterer/mongodb-driver-prometheus-exporter/build.yaml)
![Known Vulnerabilities](https://snyk.io/test/github/christiangalsterer/mongodb-driver-prometheus-exporter/badge.svg)
![npm downloads](https://img.shields.io/npm/dt/@christiangalsterer/mongodb-driver-prometheus-exporter.svg)
![npm version](https://img.shields.io/npm/v/@christiangalsterer/mongodb-driver-prometheus-exporter.svg)
![npm licence](https://img.shields.io/npm/l/@christiangalsterer/mongodb-driver-prometheus-exporter.svg)
![github stars](https://img.shields.io/github/stars/christiangalsterer/mongodb-driver-prometheus-exporter.svg)

# Prometheus Exporter for offical MongoDB Node.js driver

A prometheus exporter exposing metrics for the official [MongoDB Node.js driver](https://www.mongodb.com/docs/drivers/node/current/).

Metrics names follow the same naming convention used by [micrometer](https://github.com/micrometer-metrics/micrometer). This allows to use the same metrics in dashboards and alerts across different technology stacks, e.g. when you use Spring Boot and Node.js in different applications.

## Available Metrics
The exporter provides the following metrics.

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|mongodb_driver_pool_size | the current size of the connection pool, including idle and and in-use members | <ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul>| 1.0.0 |
|mongodb_driver_pool_min|the minimum size of the connection pool|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> | 1.0.0 |
|mongodb_driver_pool_max|the maximum size of the connection pool|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> | 1.0.0 |
|mongodb_driver_pool_checkedout|the count of connections that are currently in use|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> | 1.0.0 |
|mongodb_driver_pool_waitqueuesize|the current size of the wait queue for a connection from the pool|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><ul> | 1.0.0 |
|mongodb_driver_commands_seconds_sum|Duration of the executed command in seconds| <ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><li> _command_: Name if the command </li><li> _status_: SUCCESS or ERROR </li><ul>| 1.0.0 |
|mongodb_driver_commands_seconds_count|Number of executed commands|<ul><li>_server_address_: URL of the MongoDB Service instance where the driver is connected to </li><li> _command_: Name if the command </li><li> _status_: SUCCESS or ERROR</li><ul>| 1.0.0 |

## Example Output

Here an example output in the prometheus format of the provided metrics.

```sh
# HELP mongodb_driver_pool_size the current size of the connection pool, including idle and and in-use members
# TYPE mongodb_driver_pool_size gauge
mongodb_driver_pool_size{server_address="127.0.0.1:27017"} 0
mongodb_driver_pool_size{server_address="127.0.0.2:27017"} 0
mongodb_driver_pool_size{server_address="127.0.0.3:27017"} 1

# HELP mongodb_driver_pool_min the minimum size of the connection pool
# TYPE mongodb_driver_pool_min gauge
mongodb_driver_pool_min{server_address="127.0.0.1:27017"} 0
mongodb_driver_pool_min{server_address="127.0.0.2:27017"} 0
mongodb_driver_pool_min{server_address="127.0.0.3:27017"} 0

# HELP mongodb_driver_pool_max the maximum size of the connection pool
# TYPE mongodb_driver_pool_max gauge
mongodb_driver_pool_max{server_address="127.0.0.1:27017"} 100
mongodb_driver_pool_max{server_address="127.0.0.2:27017"} 100
mongodb_driver_pool_max{server_address="127.0.0.3:27017"} 100

# HELP mongodb_driver_pool_checkedout the count of connections that are currently in use
# TYPE mongodb_driver_pool_checkedout gauge
mongodb_driver_pool_checkedout{server_address="127.0.0.1:27017"} 0
mongodb_driver_pool_checkedout{server_address="127.0.0.2:27017"} 0
mongodb_driver_pool_checkedout{server_address="127.0.0.3:27017"} 1

# HELP mongodb_driver_pool_waitqueuesize the current size of the wait queue for a connection from the pool
# TYPE mongodb_driver_pool_waitqueuesize gauge
mongodb_driver_pool_waitqueuesize{server_address="127.0.0.1:27017"} 0
mongodb_driver_pool_waitqueuesize{server_address="127.0.0.2:27017"} 0
mongodb_driver_pool_waitqueuesize{server_address="127.0.0.3:27017"} 0

# HELP mongodb_driver_commands_seconds Timer of mongodb commands
# TYPE mongodb_driver_commands_seconds histogram
mongodb_driver_commands_seconds_bucket{le="0.005",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="0.01",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="0.025",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="0.05",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="0.1",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="0.25",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="0.5",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="1",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="2.5",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="5",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="10",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 0
mongodb_driver_commands_seconds_bucket{le="+Inf",command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 21
mongodb_driver_commands_seconds_sum{command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 971000
mongodb_driver_commands_seconds_count{command="ping",server_address="127.0.0.3:27017",status="SUCCESS"} 21
```

# Usage

## Add Dependency

Add the following dependency to your project to download the packge from [npm](https://www.npmjs.com/package/@christiangalsterer/mongodb-driver-prometheus-exporter).

```sh
npm i @christiangalsterer/mongodb-driver-prometheus-exporter
```

## TypeScript

The following example illustrates how to use the exporter to enable monitoring for the MongoDB Node.js driver.

```ts
import { MongoClient } from "mongodb";
import { Registry, collectDefaultMetrics } from "prom-client";
import { monitorMongoDBDriver } from "@christiangalsterer/mongodb-driver-prometheus-exporter";

...

// set up the MongoDB client, monitorCommands needs to be set to true to enable command monitoring.
const mongoClient = new MongoClient("mongodb", { monitorCommands: true })

// set up the prometheus client
const register = new Registry();
collectDefaultMetrics({ register });

// monitor MongoDB driver
monitorMongoDBDriver(mongoClient, register);

...

// connect to MongoDB after calling monitorMongoDBDriver()
mongoClient.connect();
```
## JavaScript

The following example illustrates how to use the exporter to enable monitoring for the MongoDB Node.js driver.

```js
const MongoClient = require('mongodb');
const promClient = require( 'prom-client');
const exporter = require('@christiangalsterer/mongodb-driver-prometheus-exporter')

...

// set up the MongoDB client, monitorCommands needs to be set to true to enable command monitoring.
const mongoClient = new MongoClient("mongodb", { monitorCommands: true })

// set up the prometheus client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// monitor MongoDB driver
exporter.monitorMongoDBDriver(client, register);

...

// connect to MongoDB after calling monitorMongoDBDriver()
mongoClient.connect();
```

# Configuration

The exporter can be configured via properties specified on the optional parameter of type 
_MongoDBDriverExporterOptions_.

|property|Description|Example|Since |
|---|---|---|---|
| mongodbDriverCommandsSecondsHistogramBuckets | Buckets for the mongodb_driver_commands_seconds_bucket metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 1.0.0|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 1.1.0 |


# Grafana Dashboard

An example dashboard for Grafana is available [here](/docs/grafana/dashboard.json) displaying the provided metrics by the exporter.

Here an example for collection metrics:
![Grafana:Collection Metrics](/docs/images/grafana_mongodb_driver_collections_1.png "Grafana: Collection Metrics")

Here an example for command metrics:
![Grafana:Commands Metrics](/docs/images/grafana_mongodb_driver_commands_1.png "Grafana: Command Metrics")


# Changelog

The changes to project can be found in the [changelog](/CHANGELOG.md).

# Contributions

Contributions are highly welcomed. If you want to contribute to this project please create a github issue and/or provide a pull request for review.

# Related Projects

If you are looking for a way to monitor KafkaJS for Node.js you may have a look at https://github.com/christiangalsterer/kafkajs-prometheus-exporter

