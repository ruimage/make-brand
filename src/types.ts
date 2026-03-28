import { z } from "zod";

/**
 * Brand marker symbol used internally by Zod for branded types.
 * Contains a readonly property with the Zod brand key and the brand name.
 *
 * @template T - The brand name as a string literal type
 */
export type BrandSymbol<T extends string> = { readonly [z.$brand]: T };

/**
 * A branded type that combines a base type with a brand symbol.
 * This creates a nominal type that cannot be assigned to the base type
 * or other branded types with the same base but different brands.
 *
 * @template T - The underlying primitive or object type
 * @template TBrand - The brand name as a string literal type
 *
 * @example
 * type UserId = BrandedType<string, "UserId">;
 * type OrderId = BrandedType<string, "OrderId">;
 * // UserId and OrderId are incompatible types despite both being strings
 */
export type BrandedType<T, TBrand extends string> = T & BrandSymbol<TBrand>;

/**
 * A Zod schema type that produces branded values on successful parsing.
 * Wraps the input/output types of the original schema with the brand.
 *
 * @template TSchema - The original Zod schema type
 * @template TBrand - The brand name as a string literal type
 *
 * @example
 * const schema: BrandedSchema<ZodString, "UserId"> = z.string().uuid().brand<"UserId">();
 */
export type BrandedSchema<TSchema extends z.ZodTypeAny, TBrand extends string> =
  TSchema extends z.ZodType<infer TOutput, infer TInput>
    ? z.ZodType<BrandedType<TOutput, TBrand>, TInput>
    : never;

/**
 * Toolkit for creating and validating branded type values.
 * Provides type-safe creation, validation, type guards, assertions,
 * and utility methods for branded types built on Zod schemas.
 *
 * @template TSchema - The underlying Zod schema type
 * @template TBrand - The brand name as a string literal type
 *
 * @example
 * const UserIdBrand = makeBrand(z.string().uuid(), "UserId");
 * const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
 * UserIdBrand.matches(userId); // true
 */
export type BrandKit<TSchema extends z.ZodTypeAny, TBrand extends string> = {
  /**
   * The branded Zod schema for validation and parsing.
   * Use this when composing branded types into larger Zod schemas.
   *
   * @example
   * const OrderSchema = z.object({
   *   id: UserIdBrand.schema,
   *   quantity: QuantityBrand.schema,
   * });
   */
  readonly schema: BrandedSchema<TSchema, TBrand>;

  /**
   * The unique brand identifier string.
   * Useful for debugging and runtime type identification.
   *
   * @example
   * console.log(UserIdBrand.brandName); // "UserId"
   */
  readonly brandName: TBrand;

  /**
   * Creates a branded value by parsing and validating the input.
   * Throws a ZodError if validation fails.
   *
   * @param value - The raw value to validate and brand
   * @returns The branded value with nominal typing
   * @throws {z.ZodError} When validation fails
   *
   * @example
   * const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
   * // userId has type UserId (branded string)
   *
   * @example
   * UserIdBrand.create("invalid"); // throws ZodError
   */
  create: (value: unknown) => z.infer<BrandedSchema<TSchema, TBrand>>;

  /**
   * Safely creates a branded value without throwing.
   * Returns null if validation fails instead of throwing an error.
   *
   * @param value - The raw value to validate and brand
   * @returns The branded value, or null if validation fails
   *
   * @example
   * const userId = UserIdBrand.safeCreate("550e8400-e29b-41d4-a716-446655440000");
   * if (userId) {
   *   // userId is valid
   * }
   *
   * @example
   * const invalid = UserIdBrand.safeCreate("not-a-uuid");
   * console.log(invalid); // null
   */
  safeCreate: (value: unknown) => z.infer<BrandedSchema<TSchema, TBrand>> | null;

  /**
   * Type guard function that checks if a value matches the branded type.
   * Performs runtime validation and narrows the type on success.
   *
   * @param value - The value to check
   * @returns true if value is valid for this brand, false otherwise
   *
   * @example
   * if (UserIdBrand.matches(someValue)) {
   *   // someValue is narrowed to UserId type
   *   getUserById(someValue);
   * }
   */
  matches: (value: unknown) => value is z.infer<BrandedSchema<TSchema, TBrand>>;

  /**
   * Assertion function that throws if value doesn't match the branded type.
   * Use when you want to assert validity with a custom error message.
   *
   * @param value - The value to validate
   * @param message - Optional custom error message (default: "Invalid {brandName}")
   * @throws {Error} When validation fails
   *
   * @example
   * function processUserId(id: unknown) {
   *   UserIdBrand.ensure(id, "Invalid user ID provided");
   *   // id is now narrowed to UserId type
   * }
   */
  ensure: (
    value: unknown,
    message?: string,
  ) => asserts value is z.infer<BrandedSchema<TSchema, TBrand>>;

  /**
   * Extracts the underlying primitive value from a branded type.
   * Useful when you need to pass the value to APIs that don't accept branded types.
   *
   * @param value - The branded value to unwrap
   * @returns The underlying primitive value (type information lost)
   *
   * @example
   * const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
   * const primitive = UserIdBrand.toPrimitive(userId);
   * // primitive is just string, no brand attached
   */
  toPrimitive: (value: z.infer<BrandedSchema<TSchema, TBrand>>) => unknown;

  /**
   * Reference equality check for two branded values.
   * Uses strict equality (===) comparison.
   *
   * @param a - First branded value
   * @param b - Second branded value
   * @param makeFn - Optional custom comparison function for this call only
   * @returns true if values are considered equal
   *
   * @example
   * const id1 = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
   * const id2 = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
   * UserIdBrand.same(id1, id2); // true (same string value)
   *
   * @example
   * // One-time custom comparison
   * UserIdBrand.same(id1, id2, (a, b) => a.slice(0, 8) === b.slice(0, 8));
   */
  same: (
    a: z.infer<BrandedSchema<TSchema, TBrand>>,
    b: z.infer<BrandedSchema<TSchema, TBrand>>,
    makeFn?: (
      a: z.infer<BrandedSchema<TSchema, TBrand>>,
      b: z.infer<BrandedSchema<TSchema, TBrand>>,
    ) => boolean,
  ) => boolean;

  /**
   * Comparison function for sorting branded values.
   * Returns -1, 0, or 1 for use with Array.sort().
   * Optionally accepts a custom comparison function as the third parameter.
   *
   * @param a - First branded value
   * @param b - Second branded value
   * @param makeFn - Optional custom comparison function
   * @returns -1 if a < b, 0 if equal, 1 if a > b
   *
   * @example
   * const ids = [id3, id1, id2].sort(UserIdBrand.compare);
   *
   * @example
   * const quantities = [q5, q10, q3].sort(QuantityBrand.compare);
   * // [q3, q5, q10]
   *
   * @example
   * // Using custom compare function inline
   * const custom = UserIdBrand.compare(a, b, (x, y) => x.localeCompare(y));
   */
  compare: (
    a: z.infer<BrandedSchema<TSchema, TBrand>>,
    b: z.infer<BrandedSchema<TSchema, TBrand>>,
    makeFn?: (
      a: z.infer<BrandedSchema<TSchema, TBrand>>,
      b: z.infer<BrandedSchema<TSchema, TBrand>>,
    ) => -1 | 0 | 1,
  ) => -1 | 0 | 1;

  /**
   * Combines this brand with one or more additional brands using intersection.
   * This brand is always the first in the resulting combined brand name.
   *
   * @example
   * const PositiveInt = IntBrand.combine(PositiveBrand);
   * PositiveInt.brandName; // "Int&Positive"
   * PositiveInt.create(5); // OK
   * PositiveInt.create(-1); // throws
   */
  combine: BrandCombineFn<TSchema, TBrand>;

  /**
   * Creates a new BrandKit with a refined schema, preserving the same brand.
   * Useful for adding additional validation constraints.
   *
   * @typeParam N - The refined Zod schema type
   * @param next - The new Zod schema with additional constraints
   * @returns A new BrandKit with the refined schema
   *
   * @example
   * const PositiveInt = QuantityBrand.refineTo(z.number().int().positive().max(1000));
   * // PositiveInt.create(50) works
   * // PositiveInt.create(2000) throws (exceeds max)
   */
  refineTo: <N extends z.ZodTypeAny>(next: N) => BrandKit<N, TBrand>;

  /**
   * Pipes the branded schema through another Zod schema for transformations.
   * Preserves the brand while applying transformations like parsing or formatting.
   *
   * @typeParam N - The pipe target Zod schema type
   * @param next - The Zod schema to pipe into (often with .transform())
   * @returns A new BrandKit with the piped schema
   *
   * @example
   * const UpperCaseBrand = makeBrand(z.string(), "UpperCase");
   * const UpperPipe = UpperCaseBrand.pipeTo(
   *   z.string().transform(s => s.toUpperCase())
   * );
   * const result = UpperPipe.create("hello"); // "HELLO"
   */
  pipeTo: <N extends z.ZodTypeAny>(next: N) => BrandKit<z.ZodTypeAny, TBrand>;
};

/**
 * Combine function type for BrandKit.combine method.
 * Supports combining the owner brand with 1-4 additional brands or an array of brands.
 *
 * @template TSchema - The owner brand's Zod schema type
 * @template TBrand - The owner brand's name
 */
export interface BrandCombineFn<TSchema extends z.ZodTypeAny, TBrand extends string> {
  <T2 extends z.ZodType<z.infer<TSchema>>, B2 extends string>(
    other: BrandKit<T2, B2>,
  ): BrandKit<z.ZodTypeAny, `${TBrand}&${B2}`>;

  <
    T2 extends z.ZodType<z.infer<TSchema>>,
    B2 extends string,
    T3 extends z.ZodType<z.infer<TSchema>>,
    B3 extends string,
  >(
    b2: BrandKit<T2, B2>,
    b3: BrandKit<T3, B3>,
  ): BrandKit<z.ZodTypeAny, `${TBrand}&${B2}&${B3}`>;

  <
    T2 extends z.ZodType<z.infer<TSchema>>,
    B2 extends string,
    T3 extends z.ZodType<z.infer<TSchema>>,
    B3 extends string,
    T4 extends z.ZodType<z.infer<TSchema>>,
    B4 extends string,
  >(
    b2: BrandKit<T2, B2>,
    b3: BrandKit<T3, B3>,
    b4: BrandKit<T4, B4>,
  ): BrandKit<z.ZodTypeAny, `${TBrand}&${B2}&${B3}&${B4}`>;

  <
    T2 extends z.ZodType<z.infer<TSchema>>,
    B2 extends string,
    T3 extends z.ZodType<z.infer<TSchema>>,
    B3 extends string,
    T4 extends z.ZodType<z.infer<TSchema>>,
    B4 extends string,
    T5 extends z.ZodType<z.infer<TSchema>>,
    B5 extends string,
  >(
    b2: BrandKit<T2, B2>,
    b3: BrandKit<T3, B3>,
    b4: BrandKit<T4, B4>,
    b5: BrandKit<T5, B5>,
  ): BrandKit<z.ZodTypeAny, `${TBrand}&${B2}&${B3}&${B4}&${B5}`>;

  <
    Brands extends readonly [
      BrandKit<z.ZodType<z.infer<TSchema>>, any>,
      ...BrandKit<z.ZodType<z.infer<TSchema>>, any>[],
    ],
  >(
    brands: [...Brands],
  ): BrandKit<
    z.ZodTypeAny,
    `${TBrand}&${JoinBrands<{ [K in keyof Brands]: ExtractBrandName<Brands[K]> }>}`
  >;
}

export type ExtractBrandName<B> = B extends BrandKit<any, infer Name> ? Name : never;

export type JoinBrands<T extends readonly string[]> = T extends readonly [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? Rest["length"] extends 0
    ? First
    : `${First}&${JoinBrands<Rest>}`
  : string;
