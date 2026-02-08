/** Spec for a string environment variable. */
export type EnvSpecString = { type: 'string'; default?: string };

/** Spec for a numeric environment variable. */
export type EnvSpecNumber = { type: 'number'; default?: number };

/** Spec for a boolean environment variable (parses 1/true/yes/on as true). */
export type EnvSpecBoolean = { type: 'boolean'; default?: boolean };

/** Spec for an enum environment variable with a fixed set of choices. */
export type EnvSpecEnum<T extends string = string> = { type: 'enum'; choices: readonly T[]; default?: T };

/** Union of all environment variable spec types. */
export type EnvSpec =
  | EnvSpecString
  | EnvSpecNumber
  | EnvSpecBoolean
  | EnvSpecEnum;

/** Infers the return type from the given spec (via generics). */
export type EnvSpecToType<S> =
  S extends EnvSpecString ? string
    : S extends EnvSpecNumber ? number
      : S extends EnvSpecBoolean ? boolean
        : S extends EnvSpecEnum<infer T> ? T
          : never;

/**
 * Reads and parses an environment variable according to the given spec.
 * Throws if the variable is missing and no default is provided.
 *
 * @param key - Environment variable name (e.g. "PORT", "NODE_ENV").
 * @param spec - Spec defining type and optional default.
 * @returns Parsed value with type inferred from spec.
 */
export const getEnv = <K extends string, S extends EnvSpec>(key: K, spec: S): EnvSpecToType<S> => {
  const raw = process.env[key];
  const hasDefault = 'default' in spec && spec.default !== undefined;

  if (raw == null || raw === '') {
    if (!hasDefault) throw new Error(`Missing required environment variable: ${key}`);
    return spec.default as EnvSpecToType<S>;
  }

  switch (spec.type) {
    case 'number': {
      const n = Number(raw);
      if (Number.isNaN(n)) throw new Error(`Env ${key}: expected number, got "${raw}"`);
      return n as EnvSpecToType<S>;
    }
    case 'boolean':
      return (/^(1|true|yes|on)$/i.test(raw) ? true : false) as EnvSpecToType<S>;
    case 'enum':
      if (!spec.choices.includes(raw)) throw new Error(`Env ${key}: must be one of [${spec.choices.join(', ')}]`);
      return raw as EnvSpecToType<S>;
    default:
      return raw as EnvSpecToType<S>;
  }
};