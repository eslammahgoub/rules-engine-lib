# Introduction

rules-engine-lib is a simple rules engine allows you to cleanly abstract your rules away from your application code

- Run your dataset against a conditions JSON object.
- Results can modify your dataset or can return a new dataset of outcomes.
- It's isomorphic and has no package dependencies - great for the browser and the server.

## Installation

`bun add rules-engine-lib`

## Examples

```typescript
import RulesEngine from "rules-engine-lib";

const conditions = {
  "Must be under 18": {
    IF: {
      "person.age": { lessThan: 18 }
    },
    THEN: {
      "person.error": "You are not old enough"
    }
  },
  "Must have a driver's license": {
    IF: {
      "person.hasDriversLicense": true
    },
    THEN: {
      "person.error": "You need to get a driver's license first"
    }
  }
};

const dataset = {
  person: {
    age: 17,
    hasDriversLicense: false
  }
};

const rules = new RulesEngine(conditions, { modifyDataset: true });
rules.run(dataset);

expect(data.person.error).toEqual("You are not old enough");
```

## Use an `OR` or `AND` Operators of `if` statements to treat conditions as `if and` or `OR like`

```typescript
import RulesEngine from 'rules-engine';

const conditions = {
  "Person will be in house if person is tired or hungry": {
    IF: {
        OR: {
        "person.tired": true, // if this matches
        "person.hungry": true // OR if this matches
        }
    },
    THEN: {
      "person.location": "house"
    },
  }
};
const dataset = {
  person: {
    tired: false,
    hungry: false
  }
};

const rules = new RulesEngine(conditions);
rules.run(dataset, { modifyDataset: true });

expect(data.person.location).toEqual('house');

```

## `otherwise` will process if no conditions match

```typescript
import RulesEngine from 'rules-engine';

const conditions = {
  "Person will be in house if person is tired or hungry": {
    IF: {
      AND: {
        "person.tired": true, // if this matches
        "person.hungry": true // AND if this matches
      }
    },
    THEN: {
      "person.location": "house" // then run this
    },
    OTHERWISE: {
      "person.location": "work" // otherwise run this
    }
  }
};
    
const dataset = {
  person: {
    tired: false,
    hungry: true
  }
};

const rules = new RulesEngine(conditions, { modifyDataset: true });
rules.run(dataset);

expect(data.person.location).toEqual('work');

```

## Use Regex to match

```typescript

import RulesEngine from "rules-engine-lib";

const conditions = {
  "Must have a valid email": {
    IF: {
      "email": {
        matches: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      }
    },
    THEN: {
      "communication.error": "You need to provide a valid email"
    }
  }
};

const dataset = {
  email: "JohnDoe@example.com"
};

const rules = new RulesEngine(conditions, { modifyDataset: true });
rules.run(dataset);

expect(data.communication.error).toBeUndefined();

```

## Special paths contains dot like `person.name`

```typescript
import RulesEngine from 'rules-engine';

const conditions = {
  "Person will not be John": {
    IF: {
      "['comapny', 'person.name']": {
        not: 'John'
      }
    },
    THEN: {
      "company.isEmployee": true // then run this
    },
    OTHERWISE: {
      "company.isEmployee": false // otherwise run this
    }
  }
};
    
const dataset = {
  company: {
    'person.name': 'John'
  }
};

const rules = new RulesEngine(conditions, { modifyDataset: true });
rules.run(dataset);

expect(company.isEmployee).toEqual(false);

```

## Operators

- **between**: `"person.age": {between: [1, 20]}`
- **equality/scalar values**: `"person.exists": true` `"person.firstName": "John"`
- **contains**: ``"person.name": {contains: "Jr"}`` (also checks for values in arrays)
- **greaterThan**: `"person.age": {greaterThan: 20}`
- **in or includes**: `"person.state": {in: ["CA", "TX", "NY"]}`
- **lessThan**: `"person.age": {lessThan: 21}`
- **matches**: `"person.name": {matches: "/(john|bob|mary)/i"i`
- **not**: `"person.state": {not: "CA"}`, `"person.state": {not: {in: ["CA", "TX"]}}`

## Options

- **caseSensitive**
  - default: `false`
  - `contains` and `equals` ignore case
- **modifyDataset**
  - default: `false`
  - matching rules modify original data set `rules.run()` returns modified dataset
  - when `false`, rules create a new object, which gets returned

## TODOs

[ ] Rule weight for priority
[ ] Logger interface for custom logging
