import { z } from "zod";
import type { BrandCombineFn, BrandKit, BrandedSchema, MakeBrandConfig } from "./types.js";

/**
 * Creates a branded type toolkit from a Zod schema.
 * Provides type-safe creation, validation, and manipulation of branded values.
 * Branded types prevent accidental mixing of structurally similar types
 * (e.g., UserId and OrderId are both strings but cannot be interchanged).
 *
 * @template TSchema - The Zod schema type to brand
 * @template TBrand - The unique brand identifier (string literal type)
 * @param schema - Zod schema to apply branding to
 * @param brandName - Unique brand identifier for this type
 * @param config - Optional configuration (custom errorMessage for ensure)
 * @returns BrandKit containing creation, validation, and utility methods
 *
 * @example
 * const UserIdBrand = makeBrand(z.string().uuid(), "UserId");
 * type UserId = z.infer<typeof UserIdBrand.schema>;
 *
 * const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
 * const safeId = UserIdBrand.safeCreate("invalid"); // returns null
 *
 * @example
 * // With custom error message
 * const StrictBrand = makeBrand(z.string().uuid(), "StrictId", {
 *   errorMessage: (value, name) => `"${value}" is not a valid ${name}`,
 * });
 */
export function makeBrand<TSchema extends z.ZodTypeAny, TBrand extends string>(
  schema: TSchema,
  brandName: TBrand,
  config?: MakeBrandConfig,
): BrandKit<TSchema, TBrand> {
  if (brandName.includes("&")) {
    throw new Error("Brand name must not contain '&'");
  }
  return makeBrandInternal(schema, brandName, [brandName], config);
}

function makeBrandInternal<TSchema extends z.ZodTypeAny, TBrand extends string>(
  schema: TSchema,
  brandName: TBrand,
  brandNames: readonly string[],
  config?: MakeBrandConfig,
): BrandKit<TSchema, TBrand> {
  const brandedSchema = schema.brand<TBrand>() as unknown as BrandedSchema<TSchema, TBrand>;

  type Brand = z.infer<typeof brandedSchema>;

  const create = (value: unknown): Brand => brandedSchema.parse(value);

  const safeCreate = (value: unknown): Brand | null => {
    const r = brandedSchema.safeParse(value);
    return r.success ? (r.data as Brand) : null;
  };

  const safeParseWithError = (
    value: unknown,
  ): { success: true; data: Brand } | { success: false; error: z.ZodError } => {
    const r = brandedSchema.safeParse(value);
    return r.success
      ? { success: true, data: r.data as Brand }
      : { success: false, error: r.error };
  };

  const matches = (value: unknown): value is Brand => brandedSchema.safeParse(value).success;

  const validate = (value: unknown): value is z.output<TSchema> =>
    brandedSchema.safeParse(value).success;

  const from = (value: unknown): Brand => value as Brand;

  const ensure = (value: unknown, message?: string): asserts value is Brand => {
    if (!matches(value)) {
      const resolved =
        message ??
        (config?.errorMessage
          ? typeof config.errorMessage === "function"
            ? config.errorMessage(value, brandName)
            : config.errorMessage
          : `Invalid ${brandName}`);
      throw new Error(resolved);
    }
  };

  const toPrimitive = (value: Brand): z.output<TSchema> => value as z.output<TSchema>;

  const same = (a: Brand, b: Brand, makeFn?: (a: Brand, b: Brand) => boolean): boolean =>
    makeFn ? makeFn(a, b) : a === b;

  const compare = (a: Brand, b: Brand, makeFn?: (a: Brand, b: Brand) => -1 | 0 | 1): -1 | 0 | 1 =>
    makeFn ? makeFn(a, b) : a < b ? -1 : a > b ? 1 : 0;

  const refineTo = <N extends z.ZodTypeAny>(next: N): BrandKit<N, TBrand> =>
    makeBrandInternal(next, brandName, brandNames, config);

  const pipeTo = <N extends z.ZodTypeAny>(
    next: N,
  ): BrandKit<z.ZodPipe<BrandedSchema<TSchema, TBrand>, N>, TBrand> => {
    const piped = z.pipe(
      brandedSchema,
      next as z.ZodType<z.output<N>, z.output<typeof brandedSchema>>,
    ) as z.ZodPipe<BrandedSchema<TSchema, TBrand>, N>;
    return makeBrandInternal(piped, brandName, brandNames, config);
  };

  const combine = ((
    ...args:
      | [BrandKit<z.ZodTypeAny, string>, ...BrandKit<z.ZodTypeAny, string>[]]
      | [readonly BrandKit<z.ZodTypeAny, string>[]]
  ): BrandKit<z.ZodTypeAny, string> => {
    const otherBrands =
      Array.isArray(args[0]) && args.length === 1
        ? (args[0] as readonly BrandKit<z.ZodTypeAny, string>[])
        : (args as BrandKit<z.ZodTypeAny, string>[]);

    if (otherBrands.length === 0) {
      throw new Error("combine requires at least 1 additional brand");
    }

    const schemas = [brandedSchema, ...otherBrands.map((b) => b.schema)];
    const combinedName = [brandName, ...otherBrands.map((b) => b.brandName)].join("&");
    const combinedNames = [...brandNames, ...otherBrands.flatMap((b) => b.brandNames)];

    const combinedSchema = schemas.reduce((acc, s) => z.intersection(acc, s as z.ZodTypeAny));

    return makeBrandInternal(combinedSchema.brand(combinedName), combinedName, combinedNames);
  }) as BrandCombineFn<TSchema, TBrand>;

  return {
    schema: brandedSchema,
    brandName,
    brandNames,
    create,
    safeCreate,
    safeParseWithError,
    matches,
    validate,
    from,
    ensure,
    toPrimitive,
    unwrap: toPrimitive,
    same,
    compare,
    refineTo,
    pipeTo,
    combine,
  };
}
