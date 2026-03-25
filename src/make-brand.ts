import { z } from "zod";
import type { BrandKit, BrandedSchema, BrandSymbol } from "./types.js";

function hasBrand<TBrand extends string>(
  schema: z.ZodTypeAny,
  brandName: TBrand,
): schema is z.ZodType<BrandSymbol<TBrand>> {
  try {
    const testValue = {} as unknown;
    const branded = schema.safeParse(testValue);
    if (branded.success) {
      const brand = (branded.data as BrandSymbol<TBrand>)[z.$brand];
      return brand === brandName;
    }
    return false;
  } catch {
    return false;
  }
}

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
 * // Using branded types in function signatures for type safety
 * const getUserById = (id: UserId) => { ... };
 * const orderId: OrderId = OrderIdBrand.create("order-123");
 * getUserById(orderId); // Type error: OrderId is not assignable to UserId
 */
export function makeBrand<TSchema extends z.ZodTypeAny, TBrand extends string>(
  schema: TSchema,
  brandName: TBrand,
): BrandKit<TSchema, TBrand> {
  const brandedSchema = (hasBrand(schema, brandName)
    ? schema
    : schema.brand<TBrand>()) as unknown as BrandedSchema<TSchema, TBrand>;

  type Brand = z.infer<typeof brandedSchema>;

  const create = (value: unknown): Brand => brandedSchema.parse(value);

  const safeCreate = (value: unknown): Brand | null => {
    const r = brandedSchema.safeParse(value);
    return r.success ? (r.data as Brand) : null;
  };

  const matches = (value: unknown): value is Brand => brandedSchema.safeParse(value).success;

  const ensure = (value: unknown, message = `Invalid ${brandName}`): asserts value is Brand => {
    if (!matches(value)) throw new Error(message);
  };

  const toPrimitive = (value: Brand): unknown => value;

  const same = (a: Brand, b: Brand, makeFn?: (a: Brand, b: Brand) => boolean): boolean =>
    makeFn ? makeFn(a, b) : a === b;

  const compare = (a: Brand, b: Brand, makeFn?: (a: Brand, b: Brand) => -1 | 0 | 1): -1 | 0 | 1 =>
    makeFn ? makeFn(a, b) : a < b ? -1 : a > b ? 1 : 0;

  const refineTo = <N extends z.ZodTypeAny>(next: N): BrandKit<N, TBrand> =>
    makeBrand(next, brandName);

  const pipeTo = <N extends z.ZodTypeAny>(next: N): BrandKit<z.ZodTypeAny, TBrand> => {
    const piped = z.pipe(brandedSchema as z.ZodTypeAny, next);
    return makeBrand(piped, brandName);
  };

  return {
    schema: brandedSchema,
    brandName,
    create,
    safeCreate,
    matches,
    ensure,
    toPrimitive,
    same,
    compare,
    refineTo,
    pipeTo,
  };
}
