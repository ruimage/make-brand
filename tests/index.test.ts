import { expect, test, describe } from "vite-plus/test";
import { makeBrand } from "../src/index.ts";
import { z } from "zod";

describe("makeBrand", () => {
  const UserIdBrand = makeBrand(z.string().uuid(), "UserId");

  const QuantityBrand = makeBrand(z.number().int().positive(), "Quantity");

  test("create valid branded value", () => {
    const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
    expect(typeof userId).toBe("string");
  });

  test("create throws ZodError on invalid UUID", () => {
    expect(() => UserIdBrand.create("invalid-uuid")).toThrow();
  });

  test("safeCreate returns null on invalid value", () => {
    const result = UserIdBrand.safeCreate("invalid");
    expect(result).toBeNull();
  });

  test("safeCreate returns value on valid input", () => {
    const result = UserIdBrand.safeCreate("550e8400-e29b-41d4-a716-446655440000");
    expect(result).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  test("matches type guard returns true for valid value", () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(UserIdBrand.matches(validUuid)).toBe(true);
  });

  test("matches type guard returns false for invalid value", () => {
    expect(UserIdBrand.matches("invalid")).toBe(false);
  });

  test("ensure throws with custom message", () => {
    expect(() => UserIdBrand.ensure("invalid", "Custom error")).toThrow("Custom error");
  });

  test("ensure does not throw for valid value", () => {
    expect(() => UserIdBrand.ensure("550e8400-e29b-41d4-a716-446655440000")).not.toThrow();
  });

  test("toPrimitive extracts underlying value", () => {
    const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
    expect(UserIdBrand.toPrimitive(userId)).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  test("same compares equality", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(5);
    const c = QuantityBrand.create(10);
    expect(QuantityBrand.same(a, b)).toBe(true);
    expect(QuantityBrand.same(a, c)).toBe(false);
  });

  test("compare orders values", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(10);
    expect(QuantityBrand.compare(a, b)).toBe(-1);
    expect(QuantityBrand.compare(b, a)).toBe(1);
    expect(QuantityBrand.compare(a, a)).toBe(0);
  });

  test("same accepts custom make function", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(5);

    // Custom make function that always returns true
    expect(QuantityBrand.same(a, b, () => true)).toBe(true);

    // Custom make function with custom comparison logic
    const c = QuantityBrand.create(10);
    expect(QuantityBrand.same(a, c, (x, y) => (x as number) % 5 === (y as number) % 5)).toBe(true); // both divisible by 5
  });

  test("same uses default when makeFn not provided", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(5);
    const c = QuantityBrand.create(10);

    expect(QuantityBrand.same(a, b)).toBe(true); // default ===
    expect(QuantityBrand.same(a, c)).toBe(false); // default ===
  });

  test("compare accepts custom make function", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(10);

    // Custom make function that reverses order
    expect(QuantityBrand.compare(a, b, (x, y) => (x > y ? -1 : x < y ? 1 : 0))).toBe(1);

    // Custom make function that compares by modulo 5
    const c = QuantityBrand.create(15);
    expect(
      QuantityBrand.compare(a, c, (x, y) => {
        const modX = (x as number) % 5;
        const modY = (y as number) % 5;
        return modX < modY ? -1 : modX > modY ? 1 : 0;
      }),
    ).toBe(0); // both have same modulo 5
  });

  test("compare uses default when makeFn not provided", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(10);

    expect(QuantityBrand.compare(a, b)).toBe(-1); // default <
    expect(QuantityBrand.compare(b, a)).toBe(1); // default >
    expect(QuantityBrand.compare(a, a)).toBe(0); // default ===
  });

  test("refineTo creates refined brand", () => {
    const RefinedQuantity = QuantityBrand.refineTo(z.number().max(100));
    expect(RefinedQuantity.brandName).toBe("Quantity");
    expect(() => RefinedQuantity.create(50)).not.toThrow();
    expect(() => RefinedQuantity.create(200)).toThrow();
  });

  test("pipeTo creates piped brand with transformation", () => {
    const UppercaseBrand = makeBrand(z.string(), "Uppercase");
    const UpperPipe = UppercaseBrand.pipeTo(z.string().transform((s) => s.toUpperCase()));
    expect(UpperPipe.brandName).toBe("Uppercase");

    const result = UpperPipe.create("hello");
    expect(result).toBe("HELLO");
  });

  test("brandName is accessible", () => {
    expect(UserIdBrand.brandName).toBe("UserId");
  });

  test("schema is accessible for composition", () => {
    const OrderSchema = z.object({
      id: UserIdBrand.schema,
      quantity: QuantityBrand.schema,
    });
    const order = OrderSchema.parse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      quantity: 5,
    });
    expect(order.id).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(order.quantity).toBe(5);
  });
});
