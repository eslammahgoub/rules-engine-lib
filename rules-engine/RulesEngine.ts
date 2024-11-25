/**
 * RulesEngine class that evaluates rules based on input data.
 */
import PathFinder from "./PathFinder";
import SafeParse from "./SafeParse";

type Primitive = string | number | boolean | null;
enum LogicOperator {
	OR = "OR",
	AND = "AND",
}

interface Operator {
	between: [number, number];
	contains: string;
	includes: string[] | number[];
	greaterThan: number;
	lessThan: number;
	in: string[] | number[];
	matches: RegExp;
	not:
		| string
		| {
				in?: number[] | string[];
				includes?: number[] | string[];
		  };
}

interface IFAND {
	AND: Record<string, Primitive | Partial<Operator>>;
}

interface IFOR {
	OR: Record<string, Primitive | Partial<Operator>>;
}

interface Logic {
	IF: IFAND | IFOR | Record<string, Primitive | Partial<Operator>>;
	THEN: {
		[key: string]: Primitive | unknown[] | Record<string, unknown>;
	};
	OTHERWISE?: {
		[key: string]: Primitive | unknown[] | Record<string, unknown>;
	};
	/**
	 * @TODO: Implement weighted Logic so we can order all the logics by weight and executed based on that order
	 */
	// WEIGHT?: number;
}

interface Conditions {
	[key: string]: Logic;
}

interface Options {
	caseSensitive?: boolean;
	modifyDataset?: boolean;
}

class RulesEngine {
	private conditions: Conditions;
	private options: Options;

	constructor(conditions: Conditions, options?: Options) {
		if (conditions == null)
			throw new Error("Conditions can't be null or undefined");

		this.conditions = conditions;
		this.options = options ?? {
			caseSensitive: false,
			modifyDataset: false,
		};
	}

	run(dataset: Record<string, unknown>) {
		if (dataset == null) return;
		if (typeof dataset != "object") return;

		for (const key in this.conditions) {
			const condition = this.conditions[key];
			let result = false;
			if (condition.IF) {
				result = this.executeIF(condition.IF, dataset);
			}
			if (!this.options.modifyDataset)
				return result ? condition.THEN : condition.OTHERWISE;
			result
				? this.modifyData(condition.THEN, dataset)
				: this.modifyData(condition.OTHERWISE ?? {}, dataset);
		}
	}

	private modifyData(
		input: { [key: string]: Primitive | unknown[] | Record<string, unknown> },
		dataset: Record<string, unknown>,
	) {
		for (const path in input) {
			const value = input[path];
			const parts = path.split(".");
			let obj = dataset;
			parts.forEach((part, index) => {
				if (index < parts.length - 1) {
					obj = obj[part] as Record<string, unknown>;
				} else {
					obj[part] = value;
				}
			});
		}
	}

	private executeIF(
		logic: IFAND | IFOR | Record<string, Primitive | Partial<Operator>>,
		dataset: Record<string, unknown>,
	): boolean {
		let result = 0;

		for (const key in logic) {
			if (logic != null) {
				const logicResult = this.executeLogicalOperation(
					!["OR", "AND"].includes(key)
						? (logic as Record<string, Primitive | Partial<Operator>>)
						: logic[key as keyof typeof logic],
					dataset,
					key == "OR" ? LogicOperator.OR : LogicOperator.AND,
				);
				result = key == "OR" ? result | logicResult : 1 & logicResult;
			}
		}

		return result === 1;
	}

	private executeLogicalOperation(
		conditions: Record<string, Primitive | Partial<Operator>>,
		dataset: Record<string, unknown>,
		operator: LogicOperator,
	): number {
		if (Object.keys(conditions).length === 0) return 0;

		let result = operator === LogicOperator.AND ? 1 : 0;
		for (const path in conditions) {
			const value = conditions[path as keyof typeof conditions];
			const parsedPath = SafeParse(path);
			const dataSetValue = PathFinder(dataset, parsedPath) as Primitive;
			if (typeof value === "object" && value !== null) {
				if (value.between)
					result &= this.executeBetween(value.between, dataSetValue);
				if (value.contains)
					result &= this.executeContains(value.contains, dataSetValue);
				if (value.greaterThan)
					result &= this.executeGreaterThan(value.greaterThan, dataSetValue);
				if (value.lessThan)
					result &= this.executeLessThan(value.lessThan, dataSetValue);
				if (value.in) result &= this.executeIncludes(value.in, dataSetValue);
				if (value.includes)
					result &= this.executeIncludes(value.includes, dataSetValue);
				if (value.matches)
					result &= this.executeMatches(value.matches, dataSetValue);
				if (value.not) result &= this.executeNot(value.not, dataSetValue);
			} else {
				switch (this.options.caseSensitive) {
					case true:
						result =
							operator === LogicOperator.AND
								? result & +(value === dataSetValue)
								: result | +(value !== dataSetValue);
						break;
					default:
						result =
							operator === LogicOperator.AND
								? result & +(value == dataSetValue)
								: result | +(value != dataSetValue);
						break;
				}
			}
		}

		return result;
	}

	private executeBetween(
		[low, high]: [number, number],
		dataSetValue: Primitive,
	): number {
		if (dataSetValue == null) return 0;
		if (
			typeof dataSetValue == "number" &&
			dataSetValue > low &&
			dataSetValue < high
		)
			return 1;
		return 0;
	}

	private executeContains(input: string, dataSetValue: Primitive): number {
		if (dataSetValue == null) return 0;
		if (typeof dataSetValue == "string" && dataSetValue.includes(input))
			return 1;
		if (Array.isArray(dataSetValue) && dataSetValue.includes(input)) return 1;
		return 0;
	}
	private executeIncludes(
		input: string[] | number[],
		dataSetValue: Primitive,
	): number {
		if (dataSetValue == null) return 0;
		if (
			typeof dataSetValue == "string" &&
			input.includes(dataSetValue as never)
		)
			return 1;
		return 0;
	}
	private executeGreaterThan(input: number, dataSetValue: Primitive): number {
		if (dataSetValue == null) return 0;
		if (typeof dataSetValue == "number" && dataSetValue > input) return 1;
		return 0;
	}
	private executeLessThan(input: number, dataSetValue: Primitive): number {
		if (dataSetValue == null) return 0;
		if (typeof dataSetValue == "number" && dataSetValue < input) return 1;
		return 0;
	}
	private executeMatches(input: RegExp, dataSetValue: Primitive): number {
		if (dataSetValue == null) return 0;
		if (typeof dataSetValue == "string" && input.test(dataSetValue)) return 1;
		return 0;
	}
	private executeNot(
		input:
			| string
			| {
					in?: string[] | number[];
					includes?: string[] | number[];
			  },
		dataSetValue: Primitive,
	): number {
		if (dataSetValue == null) return 0;
		if (typeof input == "object" && input != null && input.in) {
			return this.executeIncludes(input.in, dataSetValue) == 0 ? 1 : 0;
		}
		if (typeof input == "object" && input != null && input.includes) {
			return this.executeIncludes(input.includes, dataSetValue) == 0 ? 1 : 0;
		}
		if (
			typeof dataSetValue == "string" &&
			typeof input == "string" &&
			(this.options.caseSensitive
				? input !== dataSetValue
				: input != dataSetValue)
		)
			return 1;

		return 0;
	}
}

export default RulesEngine;
