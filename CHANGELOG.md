# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] 2023-11-19

The detailed changelog can be found [here](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v2.0.0...v2.1.0).

Many thanks to the contributers for this release
- [Klem3n](https://github.com/Klem3n)

### Added

- added support for an optional metric name prefix ([issue 56](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/issues/56))
- added contribution guidelines


## [2.0.0] 2023-10-16

The detailed changelog can be found [here](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v1.1.1...v2.0.0).

### Changed

- upgraded mongodb from 5.8.0 to 6.0.0
- upgraded prom-client from 14.2.0 to 15.0.0
- added compatibility matrix to documentation
- introduced Github actions for complete build process
- added Github actions for build and snyk
- added renovate to build process

## [1.1.1] 2023-08-31

The detailed changelog can be found [here](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v1.1.0...v1.1.1).

### Security

- Security upgrade mongodb from 5.7.0 to 5.8.0

## [1.1.0] 2023-08-10

The detailed changelog can be found [here](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v1.0.1...v1.1.0).

### Added

- Added possibility to specify default labels to be added to each metric 

### Changed

- changed internal code structure for better testing
- increased test coverage

## [1.0.1] 2023-08-07

The detailed changelog can be found [here](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v1.0.0...v1.0.1).

### Changed

- changed internal code structure for better testing
- increased test coverage

## [1.0.0] 2023-08-03

The detailed changelog can be found [here](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v0.0.2...v1.0.0).

### Added

- Added Grafana example dashboard

### Fixed

## [0.2.0] 2023-08-01
 
### Added

- Added possibility to specify the buckets for the mongodb_driver_commands_seconds_bucket metric via the new optional parameter MongoDBDriverExporterOptions

### Fixed

- Fixed incorrect calculations of the histogram for the mongodb_driver_commands_seconds_bucket metric. Default buckets are now [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] in seconds.