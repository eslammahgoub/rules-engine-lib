# Table of contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Stable features](#stable-features)
- [TODOs](#todos)

## Introduction

[![npm](https://img.shields.io/npm/v/rules-engine-lib.svg)](https://npmjs.org/package/rules-engine-lib)
[![install size](https://packagephobia.com/badge?p=rules-engine-lib)](https://packagephobia.com/result?p=rules-engine-lib)

rules-engine-lib is a simple rules engine allows you to cleanly abstract your rules away from your application code

- Run your dataset against a conditions JSON object.
- Results can modify your dataset or can return a new dataset of outcomes.
- It's isomorphic and has no package dependencies - great for the browser and the server.

## Installation

````bash
bun add rules-engine-lib
````

or

```bash
npm install rules-engine-lib
```

or

```bash
yarn add rules-engine-lib
```

or

```bash
pnpm add rules-engine-lib
```

## Usage

### Stable features

- [Documentation of the main stable features (`RulesEngine` module)](index.md)

## TODOs

- [ ] Logger interface for custom logging
