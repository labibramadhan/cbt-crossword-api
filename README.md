# Computer Based Test - Crossword - REST API Server

[![Dependency Status](https://david-dm.org/labibramadhan/cbt-crossword-api.svg)](https://david-dm.org/labibramadhan/cbt-crossword-api)
[![devDependency Status](https://david-dm.org/labibramadhan/cbt-crossword-api/dev-status.svg)](https://david-dm.org/labibramadhan/cbt-crossword-api?type=dev)

## Table of Contents
1. [Entity Relationship Diagram](#entity-relationship-diagram)
1. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    1. [Installation](#installation)
    1. [Running](#running)
    1. [Debugging](#debugging)
1. [Credits](#credits)

## Entity Relationship Diagram

**Not all tables and columns are shown***

![CBT Crossword - Entity Relationship Diagram](static/images/ERD.png)

## Getting Started

### Prerequisites

1. [NodeJS v6+](https://nodejs.org/en/download/)
1. [PostgreSQL](https://www.postgresql.org/download/)
1. [Strongloop Loopback](http://loopback.io/getting-started/)

### Installation

- Create a new PostgreSQL database
- Activate **uuid-ossp** extension by typing this query inside your newly created database:

  ```
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

### Running

Type the following command inside your cbt-crossword-api local directory:

```
node --harmony ./server/server.js
```

For the first time running, there will be a ```relation "public.role" does not exist``` error thrown which can be ignored by re-running the server again (CTRL + C to stop).

### Debugging

Using Chrome Developer Tools:

```
node --harmony --inspect ./server/server.js
```

Using any supported IDE:

```
node --harmony --debug-brk=<port> ./server/server.js
```

## Credits

1. [LoopBack](http://loopback.io) v3
