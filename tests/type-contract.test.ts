import { describe, test } from "vite-plus/test";
import { z } from "zod";
import type { BrandKit, BrandSymbol } from "../src/index.ts";
import { makeBrand } from "../src/index.ts";

type Equal<TActual, TExpected> =
  (<T>() => T extends TActual ? 1 : 2) extends <T>() => T extends TExpected ? 1 : 2 ? true : false;

type Expect<T extends true> = T;

type Extends<TActual, TExpected> = TActual extends TExpected ? true : false;

type IsUnknown<T> = unknown extends T ? ([T] extends [unknown] ? true : false) : false;

type NotUnknown<T> = IsUnknown<T> extends true ? false : true;

const UserIdSchema = z.string().uuid();
const OrderIdSchema = z.string().uuid();
const QuantitySchema = z.number().int().positive();

const UserIdBrand: BrandKit<typeof UserIdSchema, "UserId"> = makeBrand(UserIdSchema, "UserId");
const OrderIdBrand: BrandKit<typeof OrderIdSchema, "OrderId"> = makeBrand(OrderIdSchema, "OrderId");
const QuantityBrand: BrandKit<typeof QuantitySchema, "Quantity"> = makeBrand(
  QuantitySchema,
  "Quantity",
);

type UserId = z.infer<typeof UserIdBrand.schema>;
type OrderId = z.infer<typeof OrderIdBrand.schema>;
type Quantity = z.infer<typeof QuantityBrand.schema>;

function assertBrandContracts() {
  const userId = "550e8400-e29b-41d4-a716-446655440000" as UserId;
  const orderId = "550e8400-e29b-41d4-a716-446655440000" as OrderId;
  const rawString = "550e8400-e29b-41d4-a716-446655440000";
  const quantity = 1 as Quantity;
  let maybeValue: unknown = rawString;

  const userIdString: string = userId;
  const quantityNumber: number = quantity;

  function acceptUserId(value: UserId) {
    return value;
  }

  function acceptOrderId(value: OrderId) {
    return value;
  }

  // @ts-expect-error raw string must not be assignable to UserId
  const invalidUserId: UserId = rawString;

  // @ts-expect-error UserId must not be assignable to OrderId
  const invalidOrderId: OrderId = userId;

  // @ts-expect-error OrderId must not be accepted as UserId
  acceptUserId(orderId);

  // @ts-expect-error UserId must not be accepted as OrderId
  acceptOrderId(userId);

  UserIdBrand.same(userId, userId);
  UserIdBrand.compare(userId, userId);

  // @ts-expect-error same must not compare different brands
  UserIdBrand.same(userId, orderId);

  // @ts-expect-error compare must not compare different brands
  UserIdBrand.compare(userId, orderId);

  UserIdBrand.compare(
    userId,
    userId,
    (left: UserId, right: UserId) => left.localeCompare(right) as -1 | 0 | 1,
  );

  if (UserIdBrand.matches(maybeValue)) {
    acceptUserId(maybeValue);

    // @ts-expect-error matches must narrow to UserId, not OrderId
    acceptOrderId(maybeValue);
  }

  maybeValue = rawString;
  UserIdBrand.ensure(maybeValue);
  acceptUserId(maybeValue);

  // @ts-expect-error ensure must assert UserId, not OrderId
  acceptOrderId(maybeValue);

  const maybeUserId = UserIdBrand.safeCreate(rawString);

  // @ts-expect-error nullable safeCreate result must be checked before use
  acceptUserId(maybeUserId);

  if (maybeUserId) {
    acceptUserId(maybeUserId);
  }

  void userIdString;
  void quantityNumber;
  void invalidUserId;
  void invalidOrderId;
}

const IntBrand = makeBrand(z.number().int(), "Int");
const PositiveBrand = makeBrand(z.number().positive(), "Positive");
const MaxHundredBrand = makeBrand(z.number().max(100), "MaxHundred");

const PositiveIntBrand = IntBrand.combine(PositiveBrand);
const BoundedIntBrand = IntBrand.combine(PositiveBrand, MaxHundredBrand);
const BoundedTupleIntBrand = IntBrand.combine([PositiveBrand, MaxHundredBrand] as const);

type PositiveInt = z.infer<typeof PositiveIntBrand.schema>;

export type CombineBrandNameTest = Expect<Equal<typeof PositiveIntBrand.brandName, "Int&Positive">>;

export type CombineManyBrandNameTest = Expect<
  Equal<typeof BoundedIntBrand.brandName, "Int&Positive&MaxHundred">
>;

export type CombineTupleBrandNameTest = Expect<
  Equal<typeof BoundedTupleIntBrand.brandName, "Int&Positive&MaxHundred">
>;

export type CombineOutputIsNumberTest = Expect<Extends<PositiveInt, number>>;
export type CombineOutputIsNotUnknownTest = Expect<NotUnknown<PositiveInt>>;

const BoundedQuantityBrand = QuantityBrand.refineTo(z.number().int().positive().max(100));

type BoundedQuantity = z.infer<typeof BoundedQuantityBrand.schema>;

export type RefineToBrandNameTest = Expect<
  Equal<typeof BoundedQuantityBrand.brandName, "Quantity">
>;
export type RefineToOutputTest = Expect<Equal<BoundedQuantity, number & BrandSymbol<"Quantity">>>;

const NumberFromStringBrand = makeBrand(z.string(), "NumberFromString").pipeTo(
  z.string().transform((value) => Number(value)),
);

type NumberFromString = z.infer<typeof NumberFromStringBrand.schema>;

export type PipeToBrandNameTest = Expect<
  Equal<typeof NumberFromStringBrand.brandName, "NumberFromString">
>;
export type PipeToOutputTest = Expect<
  Equal<NumberFromString, number & BrandSymbol<"NumberFromString">>
>;
export type PipeToOutputIsNumberTest = Expect<Extends<NumberFromString, number>>;
export type PipeToOutputIsNotUnknownTest = Expect<NotUnknown<NumberFromString>>;

const StringBrand = makeBrand(z.string(), "StringBrand");
const NumberBrand = makeBrand(z.number(), "NumberBrand");
const ObjectBrand = makeBrand(z.object({ id: z.string() }), "ObjectBrand");

type RawStringValue = ReturnType<typeof StringBrand.toPrimitive>;
type RawNumberValue = ReturnType<typeof NumberBrand.toPrimitive>;
type RawObjectValue = ReturnType<typeof ObjectBrand.toPrimitive>;

export type ToPrimitiveStringTest = Expect<Equal<RawStringValue, string>>;
export type ToPrimitiveNumberTest = Expect<Equal<RawNumberValue, number>>;
export type ToPrimitiveObjectTest = Expect<Equal<RawObjectValue, { id: string }>>;
export type ToPrimitiveStringIsNotUnknownTest = Expect<NotUnknown<RawStringValue>>;
export type ToPrimitiveNumberIsNotUnknownTest = Expect<NotUnknown<RawNumberValue>>;
export type ToPrimitiveObjectIsNotUnknownTest = Expect<NotUnknown<RawObjectValue>>;

function assertCreateReturnType() {
  const rawUserId = "550e8400-e29b-41d4-a716-446655440000";
  const userId = UserIdBrand.create(rawUserId);
  const quantity = QuantityBrand.create(1);

  const asString: string = userId;
  const asNumber: number = quantity;

  function acceptUserId(value: UserId) {
    return value;
  }
  function acceptQuantity(value: Quantity) {
    return value;
  }
  acceptUserId(userId);
  acceptQuantity(quantity);

  void asString;
  void asNumber;
}

function assertSafeCreateNarrowing() {
  const rawUserId = "550e8400-e29b-41d4-a716-446655440000";
  const rawQuantity = -1;

  const maybeUserId = UserIdBrand.safeCreate(rawUserId);
  const maybeQuantity = QuantityBrand.safeCreate(rawQuantity);

  // @ts-expect-error nullable safeCreate result must be checked before use as branded type
  const invalidDirectUserId: UserId = maybeUserId;

  // @ts-expect-error nullable safeCreate result must be checked before use as branded type
  const invalidDirectQuantity: Quantity = maybeQuantity;

  function acceptUserId(value: UserId) {
    return value;
  }
  function acceptQuantity(value: Quantity) {
    return value;
  }

  if (maybeUserId) {
    acceptUserId(maybeUserId);
    const asString: string = maybeUserId;
    void asString;
  }

  if (maybeQuantity) {
    acceptQuantity(maybeQuantity);
    const asNumber: number = maybeQuantity;
    void asNumber;
  }

  void invalidDirectUserId;
  void invalidDirectQuantity;
}

const BrandA = makeBrand(z.number().int(), "A");
const BrandB = makeBrand(z.number().int(), "B");
const BrandC = makeBrand(z.number().int(), "C");
const BrandD = makeBrand(z.number().int(), "D");
const BrandE = makeBrand(z.number().int(), "E");

const Combined4 = BrandA.combine(BrandB, BrandC, BrandD);
const Combined5 = BrandA.combine(BrandB, BrandC, BrandD, BrandE);

export type Combine4BrandNameTest = Expect<Equal<typeof Combined4.brandName, "A&B&C&D">>;
export type Combine5BrandNameTest = Expect<Equal<typeof Combined5.brandName, "A&B&C&D&E">>;

const StringBrand2 = makeBrand(z.string(), "StringBrand2");
const NumberBrand2 = makeBrand(z.number(), "NumberBrand2");

// @ts-expect-error combine must reject incompatible base schemas (string vs number)
const IncompatibleCombine = NumberBrand2.combine(StringBrand2);

// @ts-expect-error combine must reject incompatible schemas in multi-arg variant
const IncompatibleCombineMulti = NumberBrand2.combine(BrandB, StringBrand2);

// @ts-expect-error combine must reject incompatible schemas in tuple variant
const IncompatibleCombineTuple = NumberBrand2.combine([BrandB, StringBrand2] as const);

void IncompatibleCombine;
void IncompatibleCombineMulti;
void IncompatibleCombineTuple;

type Combined4Output = z.infer<typeof Combined4.schema>;
export type Combined4OutputNotUnknownTest = Expect<NotUnknown<Combined4Output>>;
export type Combined4OutputExtendsNumberTest = Expect<Extends<Combined4Output, number>>;

export type CombinedOutputHasBrandSymbolTest = Expect<
  Extends<Combined4Output, BrandSymbol<"A&B&C&D">>
>;

export type PositiveIntHasBrandSymbolTest = Expect<
  Extends<PositiveInt, BrandSymbol<"Int&Positive">>
>;

const Combined3 = BrandA.combine(BrandB, BrandC);
type Combined3Output = z.infer<typeof Combined3.schema>;
export type Combined3OutputNotUnknownTest = Expect<NotUnknown<Combined3Output>>;
export type Combined3OutputHasBrandSymbolTest = Expect<
  Extends<Combined3Output, BrandSymbol<"A&B&C">>
>;

export type Combined5OutputNotUnknownTest = Expect<NotUnknown<z.infer<typeof Combined5.schema>>>;
export type Combined5OutputHasBrandSymbolTest = Expect<
  Extends<z.infer<typeof Combined5.schema>, BrandSymbol<"A&B&C&D&E">>
>;

const PipeStringBrand = makeBrand(z.string(), "PipeString");
const PipeStringToNumber = PipeStringBrand.pipeTo(z.string().transform((value) => Number(value)));

type PipedStringToNumber = z.infer<typeof PipeStringToNumber.schema>;
export type PipedStringToNumberIsNumberTest = Expect<Extends<PipedStringToNumber, number>>;
export type PipedStringToNumberNotUnknownTest = Expect<NotUnknown<PipedStringToNumber>>;

const PlainStringBrand = makeBrand(z.string(), "PlainString");
type PlainStringType = z.infer<typeof PlainStringBrand.schema>;

// @ts-expect-error string->number piped brand must not be assignable to string-branded value
const pipedNotString: PlainStringType = {} as PipedStringToNumber;

// @ts-expect-error string->number piped brand must not pass as string
const pipedNotAssignableToString: string = {} as PipedStringToNumber;

void pipedNotString;
void pipedNotAssignableToString;

const StringToObjectBrand = makeBrand(z.string(), "StringToObject").pipeTo(
  z.string().transform((value) => ({ parsed: value, length: value.length })),
);

type StringToObjectOutput = z.infer<typeof StringToObjectBrand.schema>;
export type StringToObjectNotUnknownTest = Expect<NotUnknown<StringToObjectOutput>>;
export type StringToObjectIsObjectTest = Expect<
  Equal<StringToObjectOutput, { parsed: string; length: number } & BrandSymbol<"StringToObject">>
>;
export type StringToObjectBrandNameTest = Expect<
  Equal<typeof StringToObjectBrand.brandName, "StringToObject">
>;

type PipedToPrimitive = ReturnType<typeof PipeStringToNumber.toPrimitive>;
export type PipedToPrimitiveIsNumberTest = Expect<Equal<PipedToPrimitive, number>>;
export type PipedToPrimitiveNotUnknownTest = Expect<NotUnknown<PipedToPrimitive>>;

type ObjectPipedToPrimitive = ReturnType<typeof StringToObjectBrand.toPrimitive>;
export type ObjectPipedToPrimitiveNotUnknownTest = Expect<NotUnknown<ObjectPipedToPrimitive>>;
export type ObjectPipedToPrimitiveIsObjectTest = Expect<
  Equal<ObjectPipedToPrimitive, { parsed: string; length: number }>
>;

type ExistingPipeToPrimitive = ReturnType<typeof NumberFromStringBrand.toPrimitive>;
export type ExistingPipeToPrimitiveIsNumberTest = Expect<Equal<ExistingPipeToPrimitive, number>>;

function assertSafeParseWithErrorNarrowing() {
  const rawUserId = "550e8400-e29b-41d4-a716-446655440000";
  const result = UserIdBrand.safeParseWithError(rawUserId);

  function acceptUserId(value: UserId) {
    return value;
  }

  // @ts-expect-error must check result.success before accessing data
  const _dataWithoutCheck: UserId = result.data;

  if (result.success) {
    acceptUserId(result.data);
  }

  if (!result.success) {
    void result.error.issues;
  }

  void _dataWithoutCheck;
}

assertSafeParseWithErrorNarrowing();

describe("type contract", () => {
  test("compiles", () => {
    expectTypeContract(assertBrandContracts);
    expectTypeContract(assertCreateReturnType);
    expectTypeContract(assertSafeCreateNarrowing);
  });
});

function expectTypeContract(value: unknown) {
  return value;
}
