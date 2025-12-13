# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v2.3.0...v3.0.0) (2025-12-13)


### Bug Fixes

* **deps:** update dependency mongodb to v7 ([60f3400](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/commit/60f34005b9d5ceaffc6469647dd22ee0f07c7d9b))


### Miscellaneous Chores

* release 3.0.0 ([6b8880a](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/commit/6b8880aa30a8199bb349369e4b80ea9cde870ef6))

## [2.3.0](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v2.2.2...v2.3.0) (2024-12-14)


### Features

* add `mongodb_driver_pool_waitqueue_seconds` Histogram ([#152](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/issues/152)) ([1e7df79](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/commit/1e7df792d69bdf9d1ebdef2545f88e643c7b8289))

## [2.2.2](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v2.2.1...v2.2.2) (2024-10-04)


### Bug Fixes

* wrong entrypoint after migration to single tsconfig ([72716b9](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/commit/72716b9655262dc1dfd972b33a4c58b3427ac135))

## [2.2.1](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v2.2.0...v2.2.1) (2024-10-03)


### Bug Fixes

* **labels:** respect `defaultLabels` option ([#130](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/issues/130)) ([62c1f1b](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/commit/62c1f1b097cb5257acb558a9bebff9f45b8663f7)), closes [#129](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/issues/129)

## [2.2.0](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v2.1.0...v2.2.0) (2024-05-08)


### Features

* add support for node coveralls reports ([5d05840](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/commit/5d058406ec35d53144bd44a976a5ed2a846dabcd))
* support for multiple instances of exporter, multiple registrations of metrics ([85fda82](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/commit/85fda82889a098a357c162a2545cc59eaa9414ce))

## [2.1.0] 2023-11-19

The detailed changelog can be found [here](https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter/compare/v2.0.0...v2.1.0).

Many thanks to the contributors for this release

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
