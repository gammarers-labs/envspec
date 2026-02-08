import { getEnv } from '../src';

describe('getEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('type: string', () => {
    it('returns the value when env var is set', () => {
      process.env.FOO = 'bar';
      expect(getEnv('FOO', { type: 'string' })).toBe('bar');
    });

    it('returns default when env var is missing', () => {
      delete process.env.FOO;
      expect(getEnv('FOO', { type: 'string', default: 'default' })).toBe('default');
    });

    it('returns default when env var is empty string', () => {
      process.env.FOO = '';
      expect(getEnv('FOO', { type: 'string', default: 'default' })).toBe('default');
    });

    it('throws when env var is missing and no default', () => {
      delete process.env.FOO;
      expect(() => getEnv('FOO', { type: 'string' })).toThrow(
        'Missing required environment variable: FOO',
      );
    });

    it('throws when env var is empty string and no default', () => {
      process.env.FOO = '';
      expect(() => getEnv('FOO', { type: 'string' })).toThrow(
        'Missing required environment variable: FOO',
      );
    });
  });

  describe('type: number', () => {
    it('parses valid number string', () => {
      process.env.PORT = '3000';
      expect(getEnv('PORT', { type: 'number' })).toBe(3000);
    });

    it('parses decimal number', () => {
      process.env.NUM = '3.14';
      expect(getEnv('NUM', { type: 'number' })).toBe(3.14);
    });

    it('throws when value is not a number', () => {
      process.env.PORT = 'abc';
      expect(() => getEnv('PORT', { type: 'number' })).toThrow(
        'Env PORT: expected number, got "abc"',
      );
    });

    it('returns default when env var is missing', () => {
      delete process.env.PORT;
      expect(getEnv('PORT', { type: 'number', default: 8080 })).toBe(8080);
    });

    it('throws when env var is missing and no default', () => {
      delete process.env.PORT;
      expect(() => getEnv('PORT', { type: 'number' })).toThrow(
        'Missing required environment variable: PORT',
      );
    });
  });

  describe('type: boolean', () => {
    it.each(['1', 'true', 'yes', 'on'])('parses %s as true', (val) => {
      process.env.FLAG = val;
      expect(getEnv('FLAG', { type: 'boolean' })).toBe(true);
    });

    it.each(['TRUE', 'True', 'YES', 'ON'])('parses case-insensitive %s as true', (val) => {
      process.env.FLAG = val;
      expect(getEnv('FLAG', { type: 'boolean' })).toBe(true);
    });

    it.each(['0', 'false', 'no', 'off', 'anything'])('parses %s as false', (val) => {
      process.env.FLAG = val;
      expect(getEnv('FLAG', { type: 'boolean' })).toBe(false);
    });

    it('returns default when env var is missing', () => {
      delete process.env.FLAG;
      expect(getEnv('FLAG', { type: 'boolean', default: true })).toBe(true);
      expect(getEnv('FLAG', { type: 'boolean', default: false })).toBe(false);
    });

    it('throws when env var is missing and no default', () => {
      delete process.env.FLAG;
      expect(() => getEnv('FLAG', { type: 'boolean' })).toThrow(
        'Missing required environment variable: FLAG',
      );
    });
  });

  describe('type: enum', () => {
    it('returns value when it is a valid choice', () => {
      process.env.NODE_ENV = 'production';
      expect(
        getEnv('NODE_ENV', { type: 'enum', choices: ['development', 'production', 'test'] }),
      ).toBe('production');
    });

    it('throws when value is not in choices', () => {
      process.env.NODE_ENV = 'staging';
      expect(() =>
        getEnv('NODE_ENV', { type: 'enum', choices: ['development', 'production', 'test'] }),
      ).toThrow('Env NODE_ENV: must be one of [development, production, test]');
    });

    it('returns default when env var is missing', () => {
      delete process.env.NODE_ENV;
      expect(
        getEnv('NODE_ENV', {
          type: 'enum',
          choices: ['development', 'production'] as const,
          default: 'development',
        }),
      ).toBe('development');
    });

    it('throws when env var is missing and no default', () => {
      delete process.env.NODE_ENV;
      expect(() =>
        getEnv('NODE_ENV', { type: 'enum', choices: ['development', 'production'] }),
      ).toThrow('Missing required environment variable: NODE_ENV');
    });
  });
});
