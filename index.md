# Basic usage

```typescript
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

## OR conditons

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

## AND conditons

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
      "person.location": "house"
    },
  }
};
const dataset = {
  person: {
    tired: true,
    hungry: true
  }
};

const rules = new RulesEngine(conditions);
rules.run(dataset, { modifyDataset: true });

expect(data.person.location).toEqual('house');

```

## No conditions match

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

## Weight the condition

```typescript
import RulesEngine from 'rules-engine';

const conditions = {
   "Must be not student": {
    IF: {
     "person.school": true,
    },
    THEN: {
     "person.error": 'Person is student'
    },
    WEIGHT: 1,
   },
   "Must be age GreaterThan 16": {
    IF: {
     "person.age": {
      greaterThan: 16,
     },
    },
    THEN: {
     "person.error": 'Person is old'
    },
    WEIGHT: 0
   },
};
    
const dataset = {
   person: { name: 'Gon', age: 18, adultPresent: false, school: true },
   company: { isEmployed: false },
};

const rules = new RulesEngine(conditions, { modifyDataset: true });
rules.run(dataset);

expect(dataset.person.error).toBe('Person is student');

```

## Special paths eg: contains dot

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
