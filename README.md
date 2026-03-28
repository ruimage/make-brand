# @rzv/make-brand

Minimal brand toolkit for Zod.

`@rzv/make-brand` turns a Zod schema into a small toolkit for creating, validating, comparing, and composing branded values. It is useful when two values share the same runtime shape but must stay incompatible in TypeScript, such as `UserId` and `OrderId`, or `Quantity` and `Price`.

## Why

TypeScript is structurally typed, so two `string` values are interchangeable even if they represent different concepts. Branded types add nominal typing on top of your Zod schema while keeping the original runtime value.

- Runtime validation comes from Zod
- Type safety comes from the brand
- Values stay plain strings, numbers, or objects at runtime

## Installation

`zod` is a peer dependency.

```bash
npm install @rzv/make-brand zod
```

```bash
pnpm add @rzv/make-brand zod
```

```bash
bun add @rzv/make-brand zod
```

The package is ESM-only.

## Quick Start

```ts
import { z } from "zod";
import { makeBrand } from "@rzv/make-brand";

const UserIdBrand = makeBrand(z.string().uuid(), "UserId");
const OrderIdBrand = makeBrand(z.string().uuid(), "OrderId");

type UserId = z.infer<typeof UserIdBrand.schema>;
type OrderId = z.infer<typeof OrderIdBrand.schema>;

const userId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
const orderId = OrderIdBrand.create("6ba7b810-9dad-11d1-80b4-00c04fd430c8");

function getUserById(id: UserId) {
  return id;
}

getUserById(userId);
// getUserById(orderId); // Type error
```

At runtime, `userId` is still just a string. The brand exists to improve type safety and schema composition.

## Core API

```ts
const Brand = makeBrand(schema, "BrandName");
```

`makeBrand` returns a `BrandKit` with the following fields:

| Field / method              | Description                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `schema`                    | Branded Zod schema you can reuse in larger schemas                                   |
| `brandName`                 | Runtime brand name                                                                   |
| `create(value)`             | Parses and returns a branded value, throws on invalid input                          |
| `safeCreate(value)`         | Returns a branded value or `null`                                                    |
| `matches(value)`            | Runtime type guard based on schema validation                                        |
| `ensure(value, message?)`   | Assertion helper, throws `Error` on invalid input                                    |
| `toPrimitive(value)`        | Returns the underlying runtime value                                                 |
| `same(a, b, compareFn?)`    | Equality check, default is strict equality                                           |
| `compare(a, b, compareFn?)` | Sort helper, default uses `<` / `>`                                                  |
| `combine(...brands)`        | Combines this brand with 1-4 additional brands or an array via intersection          |
| `refineTo(next)`            | Creates a new brand kit with the same brand name and a new schema                    |
| `pipeTo(next)`              | Pipes the current branded schema into another Zod schema and returns a new brand kit |

## Validation Patterns

```ts
import { z } from "zod";
import { makeBrand } from "@rzv/make-brand";

const UserIdBrand = makeBrand(z.string().uuid(), "UserId");

const strictUserId = UserIdBrand.create("550e8400-e29b-41d4-a716-446655440000");
const maybeUserId = UserIdBrand.safeCreate("not-a-uuid");
// maybeUserId === null

const input: unknown = "550e8400-e29b-41d4-a716-446655440000";

if (UserIdBrand.matches(input)) {
  // input is narrowed to UserId here
}

UserIdBrand.ensure(input, "Invalid user id");

const rawValue = UserIdBrand.toPrimitive(strictUserId);
// rawValue is the same runtime string without branded typing
```

## Schema Composition

Use `schema` whenever branded values need to participate in larger Zod objects.

```ts
import { z } from "zod";
import { makeBrand } from "@rzv/make-brand";

const UserIdBrand = makeBrand(z.string().uuid(), "UserId");
const QuantityBrand = makeBrand(z.number().int().positive(), "Quantity");

const OrderSchema = z.object({
  id: UserIdBrand.schema,
  quantity: QuantityBrand.schema,
});

const order = OrderSchema.parse({
  id: "550e8400-e29b-41d4-a716-446655440000",
  quantity: 5,
});
```

## Comparing Branded Values

`same` and `compare` are useful when you want a package-level convention for equality and sorting.

```ts
import { z } from "zod";
import { makeBrand } from "@rzv/make-brand";

const QuantityBrand = makeBrand(z.number().int().positive(), "Quantity");

const a = QuantityBrand.create(5);
const b = QuantityBrand.create(10);
const c = QuantityBrand.create(5);

QuantityBrand.same(a, c); // true
QuantityBrand.compare(a, b); // -1

const sorted = [b, a, c].sort(QuantityBrand.compare);
```

You can also override the comparison for a single call:

```ts
QuantityBrand.compare(a, b, (x, y) => (x > y ? -1 : x < y ? 1 : 0));
```

## `refineTo` and `pipeTo`

These two methods look similar, but they behave differently:

- `refineTo(next)` keeps the brand name and replaces the schema with `next`
- `pipeTo(next)` keeps the current branded schema as the first stage, then pipes it into `next`

```ts
import { z } from "zod";
import { makeBrand } from "@rzv/make-brand";

const QuantityBrand = makeBrand(z.number().int().positive(), "Quantity");

const PercentageBrand = QuantityBrand.refineTo(z.number().int().min(0).max(100));

const UppercaseNameBrand = makeBrand(z.string().min(1), "DisplayName").pipeTo(
  z.string().transform((value) => value.trim().toUpperCase()),
);

PercentageBrand.create(42);
UppercaseNameBrand.create("  alice  "); // "ALICE"
```

If you need `refineTo` to preserve previous constraints, include them again in the new schema explicitly.

## `combine`

Combines multiple brands into a single brand using Zod intersection. The resulting brand name joins all contributor names with `&`.

```ts
import { z } from "zod";
import { makeBrand } from "@rzv/make-brand";

const IntBrand = makeBrand(z.number().int(), "Int");
const PositiveBrand = makeBrand(z.number().positive(), "Positive");

const PositiveInt = IntBrand.combine(PositiveBrand);
// PositiveInt.brandName === "Int&Positive"

PositiveInt.create(5); // 5
PositiveInt.create(-1); // throws ZodError (not positive)
PositiveInt.create(1.5); // throws ZodError (not int)
```

Up to 4 additional brands as arguments:

```ts
const MaxHundred = makeBrand(z.number().max(100), "MaxHundred");

const BoundedPositiveInt = IntBrand.combine(PositiveBrand, MaxHundred);
// BoundedPositiveInt.brandName === "Int&Positive&MaxHundred"
```

Or pass an array:

```ts
const StrictInt = IntBrand.combine([PositiveBrand, MaxHundred]);
// StrictInt.brandName === "Int&Positive&MaxHundred"
```

The combined schema is usable in `z.object`:

```ts
const Schema = z.object({ value: PositiveInt.schema });
const result = Schema.parse({ value: 42 });
```

## Exported Types

The package also exports the main utility types:

- `BrandKit` — the full toolkit type returned by `makeBrand`
- `BrandSymbol` — the brand marker `{ readonly [z.$brand]: T }`
- `BrandedType<T, B>` — `T & BrandSymbol<B>`
- `BrandedSchema<TSchema, B>` — a Zod schema that produces branded output
- `BrandCombineFn` — overloaded function signature for `combine`
- `ExtractBrandName<B>` — extracts the brand name from a `BrandKit`
- `JoinBrands<T>` — joins a tuple of brand names with `&`

Example:

```ts
import type { BrandedType } from "@rzv/make-brand";

type UserId = BrandedType<string, "UserId">;
```

## Development

```bash
npm install
npm test
npm run check
npm run build
```

Release helpers:

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

## LLM-Ready Documentation

This repository includes documentation files optimized for LLM consumption:

- **[llms.txt](./llms.txt)** — compact index following the [llms.txt convention](https://llmstxt.org), discoverable by Context7 and other LLM tools
- **[llms-full.txt](./llms-full.txt)** — complete API reference in a single file for direct injection into LLM context

These files are automatically indexed by [Context7](https://context7.com) and compatible with any tool that follows the `llms.txt` standard.

## License

MIT
