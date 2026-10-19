import type { IPluginConfig, IPicGo } from 'picgo';
import CompressTransformers from '../src/index';
import { CompressType, GifCompressType, PROJ_CONF } from '../src/config';
import { IConfigKeys } from '../src/interface';

// The config schema is the only contract the GUI sees. Anything that can not be
// sent over electron IPC (a function) breaks the GUI config page silently.
const buildSchema = (guiVersion?: string): IPluginConfig[] => {
  const ctx = {
    GUI_VERSION: guiVersion,
    getConfig: () => ({ 'Compress Type': CompressType.A, 'Gif compress Type': GifCompressType.A }),
  } as unknown as IPicGo;
  const schema = CompressTransformers(ctx).config?.(ctx);
  if (!schema) throw new Error('config() returned nothing');
  return schema;
};

const field = (schema: IPluginConfig[], name: IConfigKeys) => {
  const found = schema.find((item) => item.name === name);
  if (!found) throw new Error(`field ${name} is missing`);
  return found;
};

describe('config schema in the GUI', () => {
  it('can be serialized over IPC', () => {
    const schema = buildSchema('3.0.3');
    expect(() => structuredClone(schema)).not.toThrow();
  });

  // `when` is the CLI only mechanism, the GUI renders every field
  it('keeps the when predicate out of the GUI schema', () => {
    const schema = buildSchema('3.0.3');
    expect(field(schema, IConfigKeys.G).when).toBeUndefined();
    expect(field(schema, IConfigKeys.H).when).toBeUndefined();
  });

  it('masks the tinyPng key and explains the tinypng only fields', () => {
    const schema = buildSchema('3.0.3');
    expect(field(schema, IConfigKeys.H).type).toBe('password');
    expect(field(schema, IConfigKeys.H).tips).toContain('tinypng');
    expect(field(schema, IConfigKeys.G).tips).toContain('tinypng');
  });
});

describe('config schema in the CLI', () => {
  it('still asks for the key only when tinypng is selected', () => {
    const schema = buildSchema();
    const key = field(schema, IConfigKeys.H);
    expect(key.type).toBe('input');

    const when = key.when as (answers: Record<string, string>) => boolean;
    // inquirer keys the answers by field name, not by a camelCase alias
    expect(when({ [IConfigKeys.A]: CompressType.A })).toBe(true);
    expect(when({ [IConfigKeys.A]: CompressType.B })).toBe(false);
  });
});

describe('register', () => {
  it('does not throw when the plugin is loaded twice', () => {
    const registry = new Map<string, unknown>();
    const ctx = {
      log: { warn: jest.fn() },
      helper: {
        transformer: {
          get: (id: string) => registry.get(id),
          register: (id: string, handler: unknown) => {
            if (registry.has(id)) throw new Error(`transformer duplicate id: ${id}!`);
            registry.set(id, handler);
          },
        },
      },
    } as unknown as IPicGo;

    const plugin = CompressTransformers(ctx);
    plugin.register(ctx);
    expect(() => plugin.register(ctx)).not.toThrow();
    expect(registry.has(PROJ_CONF)).toBe(true);
  });
});
