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

describe("safeParseWithError", () => {
  test("safeParseWithError returns success with data for valid value", () => {
    const result = UserIdBrand.safeParseWithError("550e8400-e29b-41d4-a716-446655440000");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("550e8400-e29b-41d4-a716-446655440000");
    }
  });

  test("safeParseWithError returns failure with ZodError for invalid value", () => {
    const result = UserIdBrand.safeParseWithError("invalid");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  test("safeParseWithError preserves ZodError issues", () => {
    const result = UserIdBrand.safeParseWithError("not-a-uuid");
    if (!result.success) {
      const message = result.error.message;
      expect(message).toContain("Invalid UUID");
    }
  });

  test("safeParseWithError returns success for combined brand", () => {
    const IntBrand = makeBrand(z.number().int(), "Int");
    const PositiveBrand = makeBrand(z.number().positive(), "Positive");
    const PositiveInt = IntBrand.combine(PositiveBrand);
    const result = PositiveInt.safeParseWithError(5);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(5);
    }
  });

  test("safeParseWithError returns failure for combined brand invalid input", () => {
    const IntBrand = makeBrand(z.number().int(), "Int");
    const PositiveBrand = makeBrand(z.number().positive(), "Positive");
    const PositiveInt = IntBrand.combine(PositiveBrand);
    const result = PositiveInt.safeParseWithError(-1);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});

describe("unwrap", () => {
  test("unwrap returns same value as toPrimitive for string brand", () => {
    const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
    expect(UserIdBrand.unwrap(userId)).toBe(UserIdBrand.toPrimitive(userId));
  });

  test("unwrap returns underlying object value", () => {
    const ObjectBrand = makeBrand(z.object({ id: z.string() }), "ObjectBrand");
    const value = ObjectBrand.create({ id: "obj-1" });
    expect(ObjectBrand.unwrap(value)).toEqual({ id: "obj-1" });
  });
});

describe("brandNames", () => {
  const IntBrand = makeBrand(z.number().int(), "Int");
  const PositiveBrand = makeBrand(z.number().positive(), "Positive");
  const MaxHundred = makeBrand(z.number().max(100), "MaxHundred");

  test("simple brand has single-element brandNames", () => {
    expect(UserIdBrand.brandNames).toEqual(["UserId"]);
  });

  test("combined 2 brands lists both names", () => {
    const PositiveInt = IntBrand.combine(PositiveBrand);
    expect(PositiveInt.brandNames).toEqual(["Int", "Positive"]);
  });

  test("combined 3 brands lists all names", () => {
    const Bounded = IntBrand.combine(PositiveBrand, MaxHundred);
    expect(Bounded.brandNames).toEqual(["Int", "Positive", "MaxHundred"]);
  });

  test("combined array variant lists all names", () => {
    const ArrCombined = IntBrand.combine([PositiveBrand, MaxHundred]);
    expect(ArrCombined.brandNames).toEqual(["Int", "Positive", "MaxHundred"]);
  });

  test("refineTo preserves parent brandNames", () => {
    const RefinedInt = IntBrand.refineTo(z.number().int().min(0));
    expect(RefinedInt.brandNames).toEqual(["Int"]);
  });

  test("pipeTo preserves parent brandNames", () => {
    const PipedBrand = makeBrand(z.string(), "Piped").pipeTo(
      z.string().transform((s) => s.toUpperCase()),
    );
    expect(PipedBrand.brandNames).toEqual(["Piped"]);
  });

  test("combined then refined preserves combined names", () => {
    const PositiveInt = IntBrand.combine(PositiveBrand);
    const Refined = PositiveInt.refineTo(z.number().int().positive().max(100));
    expect(Refined.brandNames).toEqual(["Int", "Positive"]);
  });
});

describe("ensure with config", () => {
  test("ensure with string errorMessage throws custom message", () => {
    const Brand = makeBrand(z.string().uuid(), "CustomId", {
      errorMessage: "Custom error message",
    });
    expect(() => Brand.ensure("invalid")).toThrow("Custom error message");
  });

  test("ensure with function errorMessage throws result of function", () => {
    const Brand = makeBrand(z.string().uuid(), "DynamicId", {
      errorMessage: (value, name) => `Value "${String(value)}" is not a valid ${name}`,
    });
    expect(() => Brand.ensure("bad")).toThrow('Value "bad" is not a valid DynamicId');
  });

  test("ensure without config uses default message", () => {
    expect(() => UserIdBrand.ensure("invalid")).toThrow("Invalid UserId");
  });

  test("ensure explicit message overrides config message", () => {
    const Brand = makeBrand(z.string().uuid(), "OverrideId", {
      errorMessage: "Config message",
    });
    expect(() => Brand.ensure("invalid", "Explicit message")).toThrow("Explicit message");
  });

  test("config does not affect safeCreate", () => {
    const Brand = makeBrand(z.string().uuid(), "SafeId", {
      errorMessage: "Custom",
    });
    expect(Brand.safeCreate("invalid")).toBeNull();
  });

  test("config does not affect create", () => {
    const Brand = makeBrand(z.string().uuid(), "CreateId", {
      errorMessage: "Custom",
    });
    expect(() => Brand.create("invalid")).toThrow();
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

  test("toPrimitive returns object value", () => {
    const ObjectBrand = makeBrand(z.object({ id: z.string() }), "ObjectBrand");
    const value = ObjectBrand.create({ id: "object-1" });
    expect(ObjectBrand.toPrimitive(value)).toEqual({ id: "object-1" });
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
  const ObjectValueBrand = makeBrand(z.object({ value: z.number() }), "ObjectValue");

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

  test("compare returns 0 for distinct plain objects with default comparator", () => {
    const a = ObjectValueBrand.create({ value: 1 });
    const b = ObjectValueBrand.create({ value: 2 });
    expect(ObjectValueBrand.compare(a, b)).toBe(0);
  });

  test("compare accepts custom object comparator", () => {
    const a = ObjectValueBrand.create({ value: 1 });
    const b = ObjectValueBrand.create({ value: 2 });
    const c = ObjectValueBrand.create({ value: 1 });
    const compareByValue = (left: typeof a, right: typeof a): -1 | 0 | 1 =>
      left.value < right.value ? -1 : left.value > right.value ? 1 : 0;

    expect(ObjectValueBrand.compare(a, b, compareByValue)).toBe(-1);
    expect(ObjectValueBrand.compare(b, a, compareByValue)).toBe(1);
    expect(ObjectValueBrand.compare(a, c, compareByValue)).toBe(0);
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

  test("pipeTo transforms string to number", () => {
    const NumberFromString = makeBrand(z.string().regex(/^\d+$/), "NumberFromString").pipeTo(
      z.string().transform((value) => Number(value)),
    );

    expect(NumberFromString.create("42")).toBe(42);
    expect(() => NumberFromString.create("abc")).toThrow();
  });
});

describe("makeBrand", () => {
  test("creates a brand kit from an already branded schema with the same brand name", () => {
    const NameBrand = makeBrand(z.string().min(1), "Name");
    const RecreatedNameBrand = makeBrand(NameBrand.schema, "Name");

    expect(RecreatedNameBrand.brandName).toBe("Name");
    expect(RecreatedNameBrand.create("John")).toBe("John");
    expect(RecreatedNameBrand.safeCreate("")).toBeNull();
    expect(RecreatedNameBrand.matches("John")).toBe(true);
    expect(RecreatedNameBrand.matches("")).toBe(false);
  });

  test("creates a brand kit from an already branded schema with a different brand name", () => {
    const NameBrand = makeBrand(z.string().min(1), "Name");
    const LabelBrand = makeBrand(NameBrand.schema, "Label");

    expect(LabelBrand.brandName).toBe("Label");
    expect(LabelBrand.create("John")).toBe("John");
    expect(() => LabelBrand.create("")).toThrow();
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

  test("combine with no arguments throws at runtime", () => {
    expect(() => (IntBrand.combine as unknown as () => unknown)()).toThrow(
      "combine requires at least 1 additional brand",
    );
  });
});

describe("regression: makeBrand side effects", () => {
  test("makeBrand does not execute schema parse during kit creation", () => {
    let parseCount = 0;
    const sideEffectSchema = z.string().transform((value) => {
      parseCount++;
      return value;
    });

    parseCount = 0;
    const BrandKit = makeBrand(sideEffectSchema, "SideEffect");
    expect(parseCount).toBe(0);

    BrandKit.create("test");
    expect(parseCount).toBe(1);
  });

  test("makeBrand with schema that accepts {} does not run transform during kit creation", () => {
    let transformCount = 0;
    const transformSchema = z.object({}).transform((value) => {
      transformCount++;
      return value;
    });

    transformCount = 0;
    const BrandKit = makeBrand(transformSchema, "TransformSideEffect");
    expect(transformCount).toBe(0);

    BrandKit.create({});
    expect(transformCount).toBe(1);
  });

  test("makeBrand with throwing transform does not throw during kit creation", () => {
    const throwingSchema = z.string().transform(() => {
      throw new Error("Transform error");
    });

    expect(() => makeBrand(throwingSchema, "Throwing")).not.toThrow();
  });

  test("makeBrand with throwing refine does not throw during kit creation", () => {
    const throwingRefineSchema = z.string().refine(() => {
      throw new Error("Refine error");
    });

    expect(() => makeBrand(throwingRefineSchema, "RefineThrowing")).not.toThrow();
  });

  test("throwing transform throws on actual create", () => {
    const throwingSchema = z.string().transform(() => {
      throw new Error("Transform error");
    });
    const BrandKit = makeBrand(throwingSchema, "Throwing");

    expect(() => BrandKit.create("test")).toThrow("Transform error");
  });

  test("throwing refine throws on actual create", () => {
    const throwingRefineSchema = z.string().refine(() => {
      throw new Error("Refine error");
    });
    const BrandKit = makeBrand(throwingRefineSchema, "RefineThrowing");

    expect(() => BrandKit.create("test")).toThrow("Refine error");
  });
});

describe("regression: same() for object brands", () => {
  test("same returns true for same object reference", () => {
    const ObjectBrand = makeBrand(z.object({ id: z.number() }), "Object");
    const obj = ObjectBrand.create({ id: 1 });

    expect(ObjectBrand.same(obj, obj)).toBe(true);
  });

  test("same returns false for distinct equal-shaped objects with default comparison", () => {
    const ObjectBrand = makeBrand(z.object({ id: z.number() }), "Object");
    const a = ObjectBrand.create({ id: 1 });
    const b = ObjectBrand.create({ id: 1 });

    expect(ObjectBrand.same(a, b)).toBe(false);
  });

  test("same returns true with custom comparator by field", () => {
    const ObjectBrand = makeBrand(z.object({ id: z.number() }), "Object");
    const a = ObjectBrand.create({ id: 1 });
    const b = ObjectBrand.create({ id: 1 });

    const compareById = (x: typeof a, y: typeof a): boolean => x.id === y.id;
    expect(ObjectBrand.same(a, b, compareById)).toBe(true);
  });

  test("same returns false with custom comparator when fields differ", () => {
    const ObjectBrand = makeBrand(z.object({ id: z.number() }), "Object");
    const a = ObjectBrand.create({ id: 1 });
    const b = ObjectBrand.create({ id: 2 });

    const compareById = (x: typeof a, y: typeof a): boolean => x.id === y.id;
    expect(ObjectBrand.same(a, b, compareById)).toBe(false);
  });
});

describe("regression: compare() for same object reference", () => {
  test("compare returns 0 for same object reference", () => {
    const ObjectBrand = makeBrand(z.object({ id: z.number() }), "Object");
    const obj = ObjectBrand.create({ id: 1 });

    expect(ObjectBrand.compare(obj, obj)).toBe(0);
  });
});

describe("regression: pipeTo order and counter", () => {
  test("invalid input does not reach transform in pipeTo", () => {
    let transformCallCount = 0;
    const BaseBrand = makeBrand(z.string().regex(/^\d+$/), "Base");

    const PipedBrand = BaseBrand.pipeTo(
      z.string().transform((value) => {
        transformCallCount++;
        return Number(value);
      }),
    );

    transformCallCount = 0;
    expect(() => PipedBrand.create("abc")).toThrow();
    expect(transformCallCount).toBe(0);
  });

  test("valid input runs transform once and produces transformed value", () => {
    let transformCallCount = 0;
    const BaseBrand = makeBrand(z.string().regex(/^\d+$/), "Base");

    const PipedBrand = BaseBrand.pipeTo(
      z.string().transform((value) => {
        transformCallCount++;
        return Number(value) * 2;
      }),
    );

    transformCallCount = 0;
    const result = PipedBrand.create("21");
    expect(transformCallCount).toBe(1);
    expect(result).toBe(42);
  });

  test("pipeTo transformation happens exactly once per create call", () => {
    let transformCallCount = 0;
    const BaseBrand = makeBrand(z.string(), "Base");

    const PipedBrand = BaseBrand.pipeTo(
      z.string().transform((value) => {
        transformCallCount++;
        return value.toUpperCase();
      }),
    );

    transformCallCount = 0;
    PipedBrand.create("hello");
    expect(transformCallCount).toBe(1);

    PipedBrand.create("world");
    expect(transformCallCount).toBe(2);
  });
});
