import RulesEngine from "rules-engine-lib";

const rules = new RulesEngine({
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
}, {
    caseSensitive: false,
    modifyDataset: true,
});

const dataset = {
    person: {
        age: 17,
        hasDriversLicense: false,
        error: null,
    },
};

rules.run(dataset);

console.log(dataset.person.error);