import { describe, expect, test } from "bun:test";
import RulesEngine from "../rules-engine/RulesEngine";

describe("RulesEngine:", () => {
	test("Test 1: Rules Engine with multiple conditions and outcomes", () => {
		const conditions = {
			"Must be 16 or older if no adult is present": {
				IF: {
					AND: {
						"person.age": { lessThan: 16 },
						"person.adultPresent": false,
					},
				},
				THEN: {
					"person.error": "Must be 16 or older if no adult is present",
				},
			},
			"Must be employed": {
				IF: {
					"company.isEmployed": false,
				},
				THEN: {
					"company.error": "Must be employed",
				},
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { age: 15, adultPresent: false },
			company: { isEmployed: false },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.error).toBeDefined();
		expect(dataset.person.error).toEqual(
			"Must be 16 or older if no adult is present",
		);
		expect(dataset.company.error).toEqual("Must be employed");
	});

	test("Test 2: OR operator in IF statement", () => {
		const conditions = {
			"Person will be in house if person is tired and hungry": {
				IF: {
					OR: {
						"person.tired": true,
						"person.hungry": true,
					},
				},
				THEN: {
					"person.location": "work",
				},
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { tired: false, hungry: true },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.location).toEqual("work");
	});

	test("Test 3: AND operator in IF statement", () => {
		const conditions = {
			"Person will be in house if person is tired and hungry": {
				IF: {
					AND: {
						"person.tired": true,
						"person.hungry": true,
					},
				},
				THEN: {
					"person.location": "house",
				},
				OTHERWISE: {
					"person.location": "work",
				},
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { tired: false, hungry: true },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.location).toEqual("work");
	});

	test("Test 4: NOT Condition", () => {
		const conditions = {
			"Must not be in California": {
				IF: { "person.state": { not: "CA" } },
				THEN: { "person.error": "Not in California" },
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { age: 30, state: "TX" },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.error).toEqual("Not in California");
	});

	test("Test 5: Matches Condition", () => {
		const conditions = {
			"Only John and Bob are allowed": {
				IF: { "person.name": { matches: new RegExp(/(john|bob)/, "i") } },
				THEN: { "person.error": "Only John and Bob are allowed" },
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { name: "John" },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.error).toEqual("Only John and Bob are allowed");
	});

	test("Test 6: Array paths", () => {
		const conditions = {
			"Only John and Bob are allowed": {
				IF: {
					"['company', 'person.name']": {
						matches: new RegExp(/(john|bob)/, "i"),
					},
				},
				THEN: { "company.error": "Only John and Bob are allowed" },
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			company: {
				"person.name": "John",
			},
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.company.error).toEqual("Only John and Bob are allowed");
	});

	test("Test 7: Between condition", () => {
		const conditions = {
			"Must be age between 13 and 18": {
				IF: {
					"person.age": {
						between: [13, 18] as [number, number],
					},
				},
				THEN: {},
				OTHERWISE: {
					"person.error": "Must be age between 13 and 18",
				},
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { age: 12, adultPresent: false },
			company: { isEmployed: false },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.error).toEqual("Must be age between 13 and 18");
	});

	test("Test 7: Contains condition", () => {
		const conditions = {
			"Must be name contains J": {
				IF: {
					"person.name": {
						contains: "J",
					},
				},
				THEN: {
					"person.success": "Name contains J",
				},
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { name: "John", age: 12, adultPresent: false },
			company: { isEmployed: false },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.success).toEqual("Name contains J");
	});

	test("Test 7: Includes condition", () => {
		const conditions = {
			"Must be HxH Friends": {
				IF: {
					"person.name": {
						includes: ["Gon", "Killua", "Kurapika"],
					},
				},
				THEN: {
					"person.success": "HxH friends",
				},
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { name: "Gon", age: 12, adultPresent: false },
			company: { isEmployed: false },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.success).toEqual("HxH friends");
	});

	test("Test 7: GreaterThan condition", () => {
		const conditions = {
			"Must be age GreaterThan 16": {
				IF: {
					"person.age": {
						greaterThan: 16,
					},
				},
				THEN: {
					"person.isOld": true,
				},
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { name: "Gon", age: 18, adultPresent: false },
			company: { isEmployed: false },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.isOld).toBeTruthy();
	});

	test("Test 7: conditions with weights", () => {
		const conditions = {
			"Must be not student": {
				IF: {
					"person.school": true,
				},
				THEN: {
					"person.error": "Person is student",
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
					"person.error": "Person is old",
				},
				WEIGHT: 0,
			},
		};

		const dataset: Record<string, Record<string, number | boolean | string>> = {
			person: { name: "Gon", age: 18, adultPresent: false, school: true },
			company: { isEmployed: false },
		};

		const rules = new RulesEngine(conditions, { modifyDataset: true });
		rules.run(dataset);

		expect(dataset.person.error).toBe("Person is student");
	});
});
