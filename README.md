# Jambar

A TypeScript library for reading and parsing environment variables with types. Use `getEnv(key, spec)` to read env vars as string, number, boolean, or enum. Throws if a variable is missing and no default is provided.

## Installation

**npm:**

```bash
npm install jambar
```

**yarn:**

```bash
yarn add jambar
```

## Usage

```typescript
import { getEnv } from 'jambar';

// String (required when no default)
const apiKey = getEnv('API_KEY', { type: 'string' });
const name = getEnv('NAME', { type: 'string', default: 'world' });

// Number
const port = getEnv('PORT', { type: 'number', default: 3000 });

// Boolean (1 / true / yes / on → true, case-insensitive; otherwise false)
const debug = getEnv('DEBUG', { type: 'boolean', default: false });

// Enum (only values in choices are allowed)
const nodeEnv = getEnv('NODE_ENV', {
  type: 'enum',
  choices: ['development', 'production', 'test'] as const,
  default: 'development',
});
```

Return types are inferred from the spec, so TypeScript gives you correct types.

## Supported types

| type     | Description |
|----------|-------------|
| `string` | Returns the value as-is. Missing or empty uses default if provided, otherwise throws. |
| `number` | Parses with `Number(raw)`. Throws if the result is `NaN`. |
| `boolean` | `1`, `true`, `yes`, `on` (case-insensitive) → `true`; anything else → `false`. |
| `enum`   | Only values listed in `choices` are allowed; otherwise throws. |

For any type, if you set `default`, it is used when the env var is missing or empty. Without `default`, missing or empty throws `Missing required environment variable: <key>`.

## API

- **`getEnv<K, S>(key: K, spec: S): EnvSpecToType<S>`**  
  Reads and parses the environment variable `key` according to `spec`. The return type is inferred as `EnvSpecToType<S>`.

- **Types**  
  Exports: `EnvSpec`, `EnvSpecString`, `EnvSpecNumber`, `EnvSpecBoolean`, `EnvSpecEnum<T>`, `EnvSpecToType<S>`.

## Development

- Requires Node.js 20 or later.
- Run `yarn test` for tests and `yarn compile` to build.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for the full text.
