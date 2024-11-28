# Introduction

rules-engine-lib is a simple rules engine allows you to cleanly abstract your rules away from your application code

- Run your dataset against a conditions JSON object.
- Results can modify your dataset or can return a new dataset of outcomes.
- It's isomorphic and has no package dependencies - great for the browser and the server.

- [Installation](#installation)
- [Usage](#usage)
  - [Stable features](#stable-features)

## Installation

````bash
bun add rules-engine-lib
````

or

```bash
npm install rules-engine-lib
```

```bash
yarn add rules-engine-lib
```

or

```bash
pnpm add rules-engine-lib
```

## Usage

### Stable features

- [Documentation of the main stable features (`index.ts` module)](index.md)

## TODOs

- [ ] Rule weight for priority
- [ ] Logger interface for custom logging
