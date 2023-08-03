# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [x.y.z] unreleased

### Added

- Added Grafana example dashboard

### Fixed

## [0.3.0] 2023-08-

### Added

### Fixed

## [0.2.0] 2023-08-01
 
### Added

- Added possibility to specify the buckets for the mongodb_driver_commands_seconds_bucket metric via the new optional parameter MongoDBDriverExporterOptions

### Fixed

- Fixed incorrect calculations of the histogram for the mongodb_driver_commands_seconds_bucket metric. Default buckets are now [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]