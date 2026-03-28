import { expect, test, describe } from "vite-plus/test";
import { makeBrand } from "../src/index.ts";
import { z } from "zod";

const UserIdBrand = makeBrand(z.string().uuid(), "UserId");

const QuantityBrand = makeBrand(z.number().int().positive(), "Quantity");

describe("create", () => {
  test("create valid branded value", () => {
    const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
    expect(typeof userId).toBe("string");
  });

  test("create throws ZodError on invalid UUID", () => {
    expect(() => UserIdBrand.create("invalid-uuid")).toThrow();
  });
});

describe("safeCreate", () => {
  test("safeCreate returns null on invalid value", () => {
    const result = UserIdBrand.safeCreate("invalid");
    expect(result).toBeNull();
  });

  test("safeCreate returns value on valid input", () => {
    const result = UserIdBrand.safeCreate("550e8400-e29b-41d4-a716-446655440000");
    expect(result).toBe("550e8400-e29b-41d4-a716-446655440000");
  });
});

describe("matches", () => {
  test("matches type guard returns true for valid value", () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(UserIdBrand.matches(validUuid)).toBe(true);
  });

  test("matches type guard returns false for invalid value", () => {
    expect(UserIdBrand.matches("invalid")).toBe(false);
  });
});

describe("ensure", () => {
  test("ensure throws with custom message", () => {
    expect(() => UserIdBrand.ensure("invalid", "Custom error")).toThrow("Custom error");
  });

  test("ensure does not throw for valid value", () => {
    expect(() => UserIdBrand.ensure("550e8400-e29b-41d4-a716-446655440000")).not.toThrow();
  });
});

describe("toPrimitive", () => {
  test("toPrimitive extracts underlying value", () => {
    const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
    expect(UserIdBrand.toPrimitive(userId)).toBe("550e8400-e29b-41d4-a716-446655440000");
  });
});

describe("same", () => {
  test("same compares equality", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(5);
    const c = QuantityBrand.create(10);
    expect(QuantityBrand.same(a, b)).toBe(true);
    expect(QuantityBrand.same(a, c)).toBe(false);
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
});

describe("compare", () => {
  test("compare orders values", () => {
    const a = QuantityBrand.create(5);
    const b = QuantityBrand.create(10);
    expect(QuantityBrand.compare(a, b)).toBe(-1);
    expect(QuantityBrand.compare(b, a)).toBe(1);
    expect(QuantityBrand.compare(a, a)).toBe(0);
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
});

describe("refineTo", () => {
  test("refineTo creates refined brand", () => {
    const RefinedQuantity = QuantityBrand.refineTo(z.number().max(100));
    expect(RefinedQuantity.brandName).toBe("Quantity");
    expect(() => RefinedQuantity.create(50)).not.toThrow();
    expect(() => RefinedQuantity.create(200)).toThrow();
  });
});

describe("pipeTo", () => {
  const UppercaseBrand = makeBrand(z.string(), "Uppercase");

  test("pipeTo creates piped brand with transformation", () => {
    const UpperPipe = UppercaseBrand.pipeTo(z.string().transform((s) => s.toUpperCase()));
    expect(UpperPipe.brandName).toBe("Uppercase");

    const result = UpperPipe.create("hello");
    expect(result).toBe("HELLO");
  });
});

describe("brandName", () => {
  test("brandName is accessible", () => {
    expect(UserIdBrand.brandName).toBe("UserId");
  });
});

describe("schema", () => {
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

describe("combine", () => {
  const IntBrand = makeBrand(z.number().int(), "Int");
  const PositiveBrand = makeBrand(z.number().positive(), "Positive");
  const MaxHundred = makeBrand(z.number().max(100), "MaxHundred");
  const NonNegative = makeBrand(z.number().nonnegative(), "NonNegative");
  const Finite = makeBrand(z.number().finite(), "Finite");

  test("combine 2 brands creates intersection", () => {
    const PositiveInt = IntBrand.combine(PositiveBrand);
    expect(PositiveInt.brandName).toBe("Int&Positive");
  });

  test("combined create passes valid value", () => {
    const PositiveInt = IntBrand.combine(PositiveBrand);
    expect(PositiveInt.create(5)).toBe(5);
  });

  test("combined create rejects value failing first schema", () => {
    const PositiveInt = IntBrand.combine(PositiveBrand);
    expect(() => PositiveInt.create(-1)).toThrow();
  });

  test("combined create rejects value failing second schema", () => {
    const PositiveInt = IntBrand.combine(PositiveBrand);
    expect(() => PositiveInt.create(1.5)).toThrow();
  });

  test("combined schema usable in z.object", () => {
    const PositiveInt = IntBrand.combine(PositiveBrand);
    const Schema = z.object({ value: PositiveInt.schema });
    const result = Schema.parse({ value: 42 });
    expect(result.value).toBe(42);
  });

  test("combine 3 brands", () => {
    const result = IntBrand.combine(PositiveBrand, MaxHundred);
    expect(result.brandName).toBe("Int&Positive&MaxHundred");
    expect(result.create(50)).toBe(50);
    expect(() => result.create(200)).toThrow();
  });

  test("combine 4 brands", () => {
    const result = IntBrand.combine(PositiveBrand, MaxHundred, NonNegative);
    expect(result.brandName).toBe("Int&Positive&MaxHundred&NonNegative");
    expect(result.create(50)).toBe(50);
  });

  test("combine 5 brands", () => {
    const result = IntBrand.combine(PositiveBrand, MaxHundred, NonNegative, Finite);
    expect(result.brandName).toBe("Int&Positive&MaxHundred&NonNegative&Finite");
    expect(result.create(50)).toBe(50);
  });

  test("combine array of 2 brands", () => {
    const result = IntBrand.combine([PositiveBrand]);
    expect(result.brandName).toBe("Int&Positive");
    expect(result.create(5)).toBe(5);
    expect(() => result.create(-1)).toThrow();
  });

  test("combine array of 3+ brands", () => {
    const result = IntBrand.combine([PositiveBrand, MaxHundred]);
    expect(result.brandName).toBe("Int&Positive&MaxHundred");
    expect(result.create(50)).toBe(50);
    expect(() => result.create(200)).toThrow();
  });

  test("combine array safeCreate returns null on invalid", () => {
    const PositiveInt = IntBrand.combine([PositiveBrand]);
    expect(PositiveInt.safeCreate(-1)).toBeNull();
  });

  test("combine array matches returns correct boolean", () => {
    const PositiveInt = IntBrand.combine([PositiveBrand]);
    expect(PositiveInt.matches(5)).toBe(true);
    expect(PositiveInt.matches(-1)).toBe(false);
    expect(PositiveInt.matches(1.5)).toBe(false);
  });

  test("combine with 0 additional brands throws", () => {
    expect(() => IntBrand.combine([] as any)).toThrow(
      "combine requires at least 1 additional brand",
    );
  });
});
