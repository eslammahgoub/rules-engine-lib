import { describe, expect, test } from "bun:test";
import PathFinder from "../rules-engine/PathFinder";

describe("PathFinder:", () => {
	test.each([
		{
			a: {
				x: 2,
			},
			b: "x",
			expected: 2,
		},
		{
			a: {
				x: {
					b: {
						c: "3",
					},
				},
			},
			b: "x.b.c",
			expected: "3",
		},
		{
			a: {
				x: {
					b: 1,
					w: {
						a: {
							w: 3,
						},
					},
				},
			},
			b: "x.w.a.w",
			expected: 3,
		},
	])(".PathFinder(%p, %p)", ({ a, b, expected }) => {
		expect(PathFinder(a, b)).toBe(expected);
	});

	test("Case 1: Simple Path", () => {
		const input = { a: { b: "Hello", c: "World" } };
		const path = "a.b";
		const expected = "Hello";
		expect(PathFinder(input, path)).toBe(expected);
	});

	test("Case 2: Non-Existent Path", () => {
		const input = { a: { b: "Hello", c: "World" } };
		const path = "d.e";
		const expected = undefined;
		expect(PathFinder(input, path)).toBe(expected);
	});

	test("Case 3: Nested Paths", () => {
		const input = { a: { b: { c: "Hello" }, d: "World" } };
		const path = "a.b.c";
		const expected = "Hello";
		expect(PathFinder(input, path)).toBe(expected);
	});

	test("Case 4: Multiple Levels of Nesting", () => {
		const input = { a: { b: { c: { d: "Hello" } }, e: "World" } };
		const path = "a.b.c.d";
		const expected = "Hello";
		expect(PathFinder(input, path)).toBe(expected);
	});

	test("Case 5: Path with Dots(e.g., `. notation)", () => {
		const input = { a: { "hello.world": "Hello" } };
		const path = ["a", "hello.world"];
		const expected = "Hello";
		expect(PathFinder(input, path)).toBe(expected);
	});

	test("Case 6: Path with Dots and Numbers(e.g., 1.2.3)", () => {
		const input = { a: { b: { c: { d: "Hello", e: 42 } } } };
		const path = "a.b.c.d";
		const expected = "Hello";
		expect(PathFinder(input, path)).toBe(expected);
	});

	test("Case 7: Object with No Matches", () => {
		const input = { a: { b: { c: { d: "Hello" } } } };
		const path = "x.y.z";
		const expected = undefined;
		expect(PathFinder(input, path)).toBe(expected);
	});

	test("Case 8: Enforce path as number", () => {
		const input = { a: { b: { c: { d: "Hello" } } } };
		const path = 2;
		const expected = undefined;
		expect(PathFinder(input, path as unknown as string)).toBe(expected);
	});
});
