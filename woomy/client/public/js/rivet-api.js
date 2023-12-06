var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/core/schemas/Schema.ts
var SchemaType;
var init_Schema = __esm({
  "src/core/schemas/Schema.ts"() {
    "use strict";
    SchemaType = {
      DATE: "date",
      ENUM: "enum",
      LIST: "list",
      STRING_LITERAL: "stringLiteral",
      OBJECT: "object",
      ANY: "any",
      BOOLEAN: "boolean",
      NUMBER: "number",
      STRING: "string",
      UNKNOWN: "unknown",
      RECORD: "record",
      SET: "set",
      UNION: "union",
      UNDISCRIMINATED_UNION: "undiscriminatedUnion",
      OPTIONAL: "optional"
    };
  }
});

// src/core/schemas/builders/schema-utils/stringifyValidationErrors.ts
function stringifyValidationError(error) {
  if (error.path.length === 0) {
    return error.message;
  }
  return `${error.path.join(" -> ")}: ${error.message}`;
}
var init_stringifyValidationErrors = __esm({
  "src/core/schemas/builders/schema-utils/stringifyValidationErrors.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/schema-utils/JsonError.ts
var JsonError;
var init_JsonError = __esm({
  "src/core/schemas/builders/schema-utils/JsonError.ts"() {
    "use strict";
    init_stringifyValidationErrors();
    JsonError = class extends Error {
      constructor(errors) {
        super(errors.map(stringifyValidationError).join("; "));
        this.errors = errors;
        Object.setPrototypeOf(this, JsonError.prototype);
      }
    };
  }
});

// src/core/schemas/builders/schema-utils/ParseError.ts
var ParseError;
var init_ParseError = __esm({
  "src/core/schemas/builders/schema-utils/ParseError.ts"() {
    "use strict";
    init_stringifyValidationErrors();
    ParseError = class extends Error {
      constructor(errors) {
        super(errors.map(stringifyValidationError).join("; "));
        this.errors = errors;
        Object.setPrototypeOf(this, ParseError.prototype);
      }
    };
  }
});

// src/core/schemas/builders/schema-utils/getSchemaUtils.ts
function getSchemaUtils(schema) {
  return {
    optional: () => optional(schema),
    transform: (transformer) => transform(schema, transformer),
    parseOrThrow: async (raw, opts) => {
      const parsed = await schema.parse(raw, opts);
      if (parsed.ok) {
        return parsed.value;
      }
      throw new ParseError(parsed.errors);
    },
    jsonOrThrow: async (parsed, opts) => {
      const raw = await schema.json(parsed, opts);
      if (raw.ok) {
        return raw.value;
      }
      throw new JsonError(raw.errors);
    }
  };
}
function optional(schema) {
  const baseSchema = {
    parse: (raw, opts) => {
      if (raw == null) {
        return {
          ok: true,
          value: void 0
        };
      }
      return schema.parse(raw, opts);
    },
    json: (parsed, opts) => {
      if (parsed == null) {
        return {
          ok: true,
          value: null
        };
      }
      return schema.json(parsed, opts);
    },
    getType: () => SchemaType.OPTIONAL
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
function transform(schema, transformer) {
  const baseSchema = {
    parse: async (raw, opts) => {
      const parsed = await schema.parse(raw, opts);
      if (!parsed.ok) {
        return parsed;
      }
      return {
        ok: true,
        value: transformer.transform(parsed.value)
      };
    },
    json: async (transformed, opts) => {
      const parsed = await transformer.untransform(transformed);
      return schema.json(parsed, opts);
    },
    getType: () => schema.getType()
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
var init_getSchemaUtils = __esm({
  "src/core/schemas/builders/schema-utils/getSchemaUtils.ts"() {
    "use strict";
    init_Schema();
    init_JsonError();
    init_ParseError();
  }
});

// src/core/schemas/builders/schema-utils/index.ts
var init_schema_utils = __esm({
  "src/core/schemas/builders/schema-utils/index.ts"() {
    "use strict";
    init_getSchemaUtils();
    init_JsonError();
    init_ParseError();
  }
});

// src/core/schemas/builders/date/date.ts
function date() {
  const baseSchema = {
    parse: (raw) => {
      if (typeof raw === "string" && ISO_8601_REGEX.test(raw)) {
        return {
          ok: true,
          value: new Date(raw)
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not an ISO 8601 date string"
            }
          ]
        };
      }
    },
    json: (date2) => {
      if (date2 instanceof Date) {
        return {
          ok: true,
          value: date2.toISOString()
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a Date object"
            }
          ]
        };
      }
    },
    getType: () => SchemaType.DATE
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
var ISO_8601_REGEX;
var init_date = __esm({
  "src/core/schemas/builders/date/date.ts"() {
    "use strict";
    init_Schema();
    init_schema_utils();
    ISO_8601_REGEX = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  }
});

// src/core/schemas/builders/date/index.ts
var init_date2 = __esm({
  "src/core/schemas/builders/date/index.ts"() {
    "use strict";
    init_date();
  }
});

// src/core/schemas/utils/createIdentitySchemaCreator.ts
function createIdentitySchemaCreator(schemaType, validate) {
  return () => {
    const baseSchema = {
      parse: validate,
      json: validate,
      getType: () => schemaType
    };
    return {
      ...baseSchema,
      ...getSchemaUtils(baseSchema)
    };
  };
}
var init_createIdentitySchemaCreator = __esm({
  "src/core/schemas/utils/createIdentitySchemaCreator.ts"() {
    "use strict";
    init_schema_utils();
  }
});

// src/core/schemas/builders/enum/enum.ts
function enum_(values) {
  const validValues = new Set(values);
  const schemaCreator = createIdentitySchemaCreator(
    SchemaType.ENUM,
    (value, { allowUnrecognizedEnumValues } = {}) => {
      if (typeof value === "string" && (validValues.has(value) || allowUnrecognizedEnumValues)) {
        return {
          ok: true,
          value
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not one of the allowed values"
            }
          ]
        };
      }
    }
  );
  return schemaCreator();
}
var init_enum = __esm({
  "src/core/schemas/builders/enum/enum.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
  }
});

// src/core/schemas/builders/enum/index.ts
var init_enum2 = __esm({
  "src/core/schemas/builders/enum/index.ts"() {
    "use strict";
    init_enum();
  }
});

// src/core/schemas/builders/lazy/lazy.ts
function lazy(getter) {
  const baseSchema = constructLazyBaseSchema(getter);
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
function constructLazyBaseSchema(getter) {
  return {
    parse: async (raw, opts) => (await getMemoizedSchema(getter)).parse(raw, opts),
    json: async (parsed, opts) => (await getMemoizedSchema(getter)).json(parsed, opts),
    getType: async () => (await getMemoizedSchema(getter)).getType()
  };
}
async function getMemoizedSchema(getter) {
  const castedGetter = getter;
  if (castedGetter.__zurg_memoized == null) {
    castedGetter.__zurg_memoized = await getter();
  }
  return castedGetter.__zurg_memoized;
}
var init_lazy = __esm({
  "src/core/schemas/builders/lazy/lazy.ts"() {
    "use strict";
    init_schema_utils();
  }
});

// src/core/schemas/utils/entries.ts
function entries(object2) {
  return Object.entries(object2);
}
var init_entries = __esm({
  "src/core/schemas/utils/entries.ts"() {
    "use strict";
  }
});

// src/core/schemas/utils/filterObject.ts
function filterObject(obj, keysToInclude) {
  const keysToIncludeSet = new Set(keysToInclude);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keysToIncludeSet.has(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
var init_filterObject = __esm({
  "src/core/schemas/utils/filterObject.ts"() {
    "use strict";
  }
});

// src/core/schemas/utils/isPlainObject.ts
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}
var NOT_AN_OBJECT_ERROR_MESSAGE;
var init_isPlainObject = __esm({
  "src/core/schemas/utils/isPlainObject.ts"() {
    "use strict";
    NOT_AN_OBJECT_ERROR_MESSAGE = "Not an object";
  }
});

// src/core/schemas/utils/keys.ts
function keys(object2) {
  return Object.keys(object2);
}
var init_keys = __esm({
  "src/core/schemas/utils/keys.ts"() {
    "use strict";
  }
});

// src/core/schemas/utils/partition.ts
function partition(items, predicate) {
  const trueItems = [], falseItems = [];
  for (const item of items) {
    if (predicate(item)) {
      trueItems.push(item);
    } else {
      falseItems.push(item);
    }
  }
  return [trueItems, falseItems];
}
var init_partition = __esm({
  "src/core/schemas/utils/partition.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/object-like/getObjectLikeUtils.ts
function getObjectLikeUtils(schema) {
  return {
    withParsedProperties: (properties) => withParsedProperties(schema, properties)
  };
}
function withParsedProperties(objectLike, properties) {
  const objectSchema = {
    parse: async (raw, opts) => {
      const parsedObject = await objectLike.parse(raw, opts);
      if (!parsedObject.ok) {
        return parsedObject;
      }
      const additionalProperties = Object.entries(properties).reduce(
        (processed, [key, value]) => {
          return {
            ...processed,
            [key]: typeof value === "function" ? value(parsedObject.value) : value
          };
        },
        {}
      );
      return {
        ok: true,
        value: {
          ...parsedObject.value,
          ...additionalProperties
        }
      };
    },
    json: (parsed, opts) => {
      if (!isPlainObject(parsed)) {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: NOT_AN_OBJECT_ERROR_MESSAGE
            }
          ]
        };
      }
      const addedPropertyKeys = new Set(Object.keys(properties));
      const parsedWithoutAddedProperties = filterObject(
        parsed,
        Object.keys(parsed).filter((key) => !addedPropertyKeys.has(key))
      );
      return objectLike.json(parsedWithoutAddedProperties, opts);
    },
    getType: () => objectLike.getType()
  };
  return {
    ...objectSchema,
    ...getSchemaUtils(objectSchema),
    ...getObjectLikeUtils(objectSchema)
  };
}
var init_getObjectLikeUtils = __esm({
  "src/core/schemas/builders/object-like/getObjectLikeUtils.ts"() {
    "use strict";
    init_filterObject();
    init_isPlainObject();
    init_schema_utils();
  }
});

// src/core/schemas/builders/object-like/index.ts
var init_object_like = __esm({
  "src/core/schemas/builders/object-like/index.ts"() {
    "use strict";
    init_getObjectLikeUtils();
  }
});

// src/core/schemas/builders/object/property.ts
function property(rawKey, valueSchema) {
  return {
    rawKey,
    valueSchema,
    isProperty: true
  };
}
function isProperty(maybeProperty) {
  return maybeProperty.isProperty;
}
var init_property = __esm({
  "src/core/schemas/builders/object/property.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/object/object.ts
function object(schemas) {
  const baseSchema = {
    _getRawProperties: () => Promise.resolve(
      Object.entries(schemas).map(
        ([parsedKey, propertySchema]) => isProperty(propertySchema) ? propertySchema.rawKey : parsedKey
      )
    ),
    _getParsedProperties: () => Promise.resolve(keys(schemas)),
    parse: async (raw, opts) => {
      const rawKeyToProperty = {};
      const requiredKeys = [];
      for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
        const rawKey = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.rawKey : parsedKey;
        const valueSchema = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.valueSchema : schemaOrObjectProperty;
        const property2 = {
          rawKey,
          parsedKey,
          valueSchema
        };
        rawKeyToProperty[rawKey] = property2;
        if (await isSchemaRequired(valueSchema)) {
          requiredKeys.push(rawKey);
        }
      }
      return validateAndTransformObject({
        value: raw,
        requiredKeys,
        getProperty: (rawKey) => {
          const property2 = rawKeyToProperty[rawKey];
          if (property2 == null) {
            return void 0;
          }
          return {
            transformedKey: property2.parsedKey,
            transform: (propertyValue) => property2.valueSchema.parse(propertyValue, opts)
          };
        },
        unrecognizedObjectKeys: opts?.unrecognizedObjectKeys
      });
    },
    json: async (parsed, opts) => {
      const requiredKeys = [];
      for (const [parsedKey, schemaOrObjectProperty] of entries(schemas)) {
        const valueSchema = isProperty(schemaOrObjectProperty) ? schemaOrObjectProperty.valueSchema : schemaOrObjectProperty;
        if (await isSchemaRequired(valueSchema)) {
          requiredKeys.push(parsedKey);
        }
      }
      return validateAndTransformObject({
        value: parsed,
        requiredKeys,
        getProperty: (parsedKey) => {
          const property2 = schemas[parsedKey];
          if (property2 == null) {
            return void 0;
          }
          if (isProperty(property2)) {
            return {
              transformedKey: property2.rawKey,
              transform: (propertyValue) => property2.valueSchema.json(propertyValue, opts)
            };
          } else {
            return {
              transformedKey: parsedKey,
              transform: (propertyValue) => property2.json(propertyValue, opts)
            };
          }
        },
        unrecognizedObjectKeys: opts?.unrecognizedObjectKeys
      });
    },
    getType: () => SchemaType.OBJECT
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema),
    ...getObjectLikeUtils(baseSchema),
    ...getObjectUtils(baseSchema)
  };
}
async function validateAndTransformObject({
  value,
  requiredKeys,
  getProperty,
  unrecognizedObjectKeys = "fail"
}) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: NOT_AN_OBJECT_ERROR_MESSAGE
        }
      ]
    };
  }
  const missingRequiredKeys = new Set(requiredKeys);
  const errors = [];
  const transformed = {};
  for (const [preTransformedKey, preTransformedItemValue] of Object.entries(value)) {
    const property2 = getProperty(preTransformedKey);
    if (property2 != null) {
      missingRequiredKeys.delete(preTransformedKey);
      const value2 = await property2.transform(preTransformedItemValue);
      if (value2.ok) {
        transformed[property2.transformedKey] = value2.value;
      } else {
        errors.push(
          ...value2.errors.map((error) => ({
            path: [preTransformedKey, ...error.path],
            message: error.message
          }))
        );
      }
    } else {
      switch (unrecognizedObjectKeys) {
        case "fail":
          errors.push({
            path: [preTransformedKey],
            message: `Unrecognized key "${preTransformedKey}"`
          });
          break;
        case "strip":
          break;
        case "passthrough":
          transformed[preTransformedKey] = preTransformedItemValue;
          break;
      }
    }
  }
  errors.push(
    ...requiredKeys.filter((key) => missingRequiredKeys.has(key)).map((key) => ({
      path: [],
      message: `Missing required key "${key}"`
    }))
  );
  if (errors.length === 0) {
    return {
      ok: true,
      value: transformed
    };
  } else {
    return {
      ok: false,
      errors
    };
  }
}
function getObjectUtils(schema) {
  return {
    extend: (extension) => {
      const baseSchema = {
        _getParsedProperties: async () => [
          ...await schema._getParsedProperties(),
          ...await extension._getParsedProperties()
        ],
        _getRawProperties: async () => [
          ...await schema._getRawProperties(),
          ...await extension._getRawProperties()
        ],
        parse: async (raw, opts) => {
          return validateAndTransformExtendedObject({
            extensionKeys: await extension._getRawProperties(),
            value: raw,
            transformBase: (rawBase) => schema.parse(rawBase, opts),
            transformExtension: (rawExtension) => extension.parse(rawExtension, opts)
          });
        },
        json: async (parsed, opts) => {
          return validateAndTransformExtendedObject({
            extensionKeys: await extension._getParsedProperties(),
            value: parsed,
            transformBase: (parsedBase) => schema.json(parsedBase, opts),
            transformExtension: (parsedExtension) => extension.json(parsedExtension, opts)
          });
        },
        getType: () => SchemaType.OBJECT
      };
      return {
        ...baseSchema,
        ...getSchemaUtils(baseSchema),
        ...getObjectLikeUtils(baseSchema),
        ...getObjectUtils(baseSchema)
      };
    }
  };
}
async function validateAndTransformExtendedObject({
  extensionKeys,
  value,
  transformBase,
  transformExtension
}) {
  const extensionPropertiesSet = new Set(extensionKeys);
  const [extensionProperties, baseProperties] = partition(
    keys(value),
    (key) => extensionPropertiesSet.has(key)
  );
  const transformedBase = await transformBase(filterObject(value, baseProperties));
  const transformedExtension = await transformExtension(filterObject(value, extensionProperties));
  if (transformedBase.ok && transformedExtension.ok) {
    return {
      ok: true,
      value: {
        ...transformedBase.value,
        ...transformedExtension.value
      }
    };
  } else {
    return {
      ok: false,
      errors: [
        ...transformedBase.ok ? [] : transformedBase.errors,
        ...transformedExtension.ok ? [] : transformedExtension.errors
      ]
    };
  }
}
async function isSchemaRequired(schema) {
  return !await isSchemaOptional(schema);
}
async function isSchemaOptional(schema) {
  switch (await schema.getType()) {
    case SchemaType.ANY:
    case SchemaType.UNKNOWN:
    case SchemaType.OPTIONAL:
      return true;
    default:
      return false;
  }
}
var init_object = __esm({
  "src/core/schemas/builders/object/object.ts"() {
    "use strict";
    init_Schema();
    init_entries();
    init_filterObject();
    init_isPlainObject();
    init_keys();
    init_partition();
    init_object_like();
    init_schema_utils();
    init_property();
  }
});

// src/core/schemas/builders/object/index.ts
var init_object2 = __esm({
  "src/core/schemas/builders/object/index.ts"() {
    "use strict";
    init_object();
    init_property();
  }
});

// src/core/schemas/builders/lazy/lazyObject.ts
function lazyObject(getter) {
  const baseSchema = {
    ...constructLazyBaseSchema(getter),
    _getRawProperties: async () => (await getMemoizedSchema(getter))._getRawProperties(),
    _getParsedProperties: async () => (await getMemoizedSchema(getter))._getParsedProperties()
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema),
    ...getObjectLikeUtils(baseSchema),
    ...getObjectUtils(baseSchema)
  };
}
var init_lazyObject = __esm({
  "src/core/schemas/builders/lazy/lazyObject.ts"() {
    "use strict";
    init_object2();
    init_object_like();
    init_schema_utils();
    init_lazy();
  }
});

// src/core/schemas/builders/lazy/index.ts
var init_lazy2 = __esm({
  "src/core/schemas/builders/lazy/index.ts"() {
    "use strict";
    init_lazy();
    init_lazyObject();
  }
});

// src/core/schemas/builders/list/list.ts
function list(schema) {
  const baseSchema = {
    parse: async (raw, opts) => validateAndTransformArray(raw, (item) => schema.parse(item, opts)),
    json: (parsed, opts) => validateAndTransformArray(parsed, (item) => schema.json(item, opts)),
    getType: () => SchemaType.LIST
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
async function validateAndTransformArray(value, transformItem) {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      errors: [
        {
          message: "Not a list",
          path: []
        }
      ]
    };
  }
  const maybeValidItems = await Promise.all(value.map((item) => transformItem(item)));
  return maybeValidItems.reduce(
    (acc, item, index) => {
      if (acc.ok && item.ok) {
        return {
          ok: true,
          value: [...acc.value, item.value]
        };
      }
      const errors = [];
      if (!acc.ok) {
        errors.push(...acc.errors);
      }
      if (!item.ok) {
        errors.push(
          ...item.errors.map((error) => ({
            path: [`[${index}]`, ...error.path],
            message: error.message
          }))
        );
      }
      return {
        ok: false,
        errors
      };
    },
    { ok: true, value: [] }
  );
}
var init_list = __esm({
  "src/core/schemas/builders/list/list.ts"() {
    "use strict";
    init_Schema();
    init_schema_utils();
  }
});

// src/core/schemas/builders/list/index.ts
var init_list2 = __esm({
  "src/core/schemas/builders/list/index.ts"() {
    "use strict";
    init_list();
  }
});

// src/core/schemas/builders/literals/stringLiteral.ts
function stringLiteral(literal) {
  const schemaCreator = createIdentitySchemaCreator(SchemaType.STRING_LITERAL, (value) => {
    if (value === literal) {
      return {
        ok: true,
        value: literal
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: [],
            message: `Not equal to "${literal}"`
          }
        ]
      };
    }
  });
  return schemaCreator();
}
var init_stringLiteral = __esm({
  "src/core/schemas/builders/literals/stringLiteral.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
  }
});

// src/core/schemas/builders/literals/index.ts
var init_literals = __esm({
  "src/core/schemas/builders/literals/index.ts"() {
    "use strict";
    init_stringLiteral();
  }
});

// src/core/schemas/builders/primitives/any.ts
var any;
var init_any = __esm({
  "src/core/schemas/builders/primitives/any.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    any = createIdentitySchemaCreator(SchemaType.ANY, (value) => ({ ok: true, value }));
  }
});

// src/core/schemas/builders/primitives/boolean.ts
var boolean;
var init_boolean = __esm({
  "src/core/schemas/builders/primitives/boolean.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    boolean = createIdentitySchemaCreator(SchemaType.BOOLEAN, (value) => {
      if (typeof value === "boolean") {
        return {
          ok: true,
          value
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a boolean"
            }
          ]
        };
      }
    });
  }
});

// src/core/schemas/builders/primitives/number.ts
var number;
var init_number = __esm({
  "src/core/schemas/builders/primitives/number.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    number = createIdentitySchemaCreator(SchemaType.NUMBER, (value) => {
      if (typeof value === "number") {
        return {
          ok: true,
          value
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a number"
            }
          ]
        };
      }
    });
  }
});

// src/core/schemas/builders/primitives/string.ts
var string;
var init_string = __esm({
  "src/core/schemas/builders/primitives/string.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    string = createIdentitySchemaCreator(SchemaType.STRING, (value) => {
      if (typeof value === "string") {
        return {
          ok: true,
          value
        };
      } else {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a string"
            }
          ]
        };
      }
    });
  }
});

// src/core/schemas/builders/primitives/unknown.ts
var unknown;
var init_unknown = __esm({
  "src/core/schemas/builders/primitives/unknown.ts"() {
    "use strict";
    init_Schema();
    init_createIdentitySchemaCreator();
    unknown = createIdentitySchemaCreator(SchemaType.UNKNOWN, (value) => ({ ok: true, value }));
  }
});

// src/core/schemas/builders/primitives/index.ts
var init_primitives = __esm({
  "src/core/schemas/builders/primitives/index.ts"() {
    "use strict";
    init_any();
    init_boolean();
    init_number();
    init_string();
    init_unknown();
  }
});

// src/core/schemas/builders/record/record.ts
function record(keySchema, valueSchema) {
  const baseSchema = {
    parse: async (raw, opts) => {
      return validateAndTransformRecord({
        value: raw,
        isKeyNumeric: await keySchema.getType() === SchemaType.NUMBER,
        transformKey: (key) => keySchema.parse(key, opts),
        transformValue: (value) => valueSchema.parse(value, opts)
      });
    },
    json: async (parsed, opts) => {
      return validateAndTransformRecord({
        value: parsed,
        isKeyNumeric: await keySchema.getType() === SchemaType.NUMBER,
        transformKey: (key) => keySchema.json(key, opts),
        transformValue: (value) => valueSchema.json(value, opts)
      });
    },
    getType: () => SchemaType.RECORD
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
async function validateAndTransformRecord({
  value,
  isKeyNumeric,
  transformKey,
  transformValue
}) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: NOT_AN_OBJECT_ERROR_MESSAGE
        }
      ]
    };
  }
  return entries(value).reduce(
    async (accPromise, [stringKey, value2]) => {
      if (value2 == null) {
        return accPromise;
      }
      const acc = await accPromise;
      let key = stringKey;
      if (isKeyNumeric) {
        const numberKey = stringKey.length > 0 ? Number(stringKey) : NaN;
        if (!isNaN(numberKey)) {
          key = numberKey;
        }
      }
      const transformedKey = await transformKey(key);
      const transformedValue = await transformValue(value2);
      if (acc.ok && transformedKey.ok && transformedValue.ok) {
        return {
          ok: true,
          value: {
            ...acc.value,
            [transformedKey.value]: transformedValue.value
          }
        };
      }
      const errors = [];
      if (!acc.ok) {
        errors.push(...acc.errors);
      }
      if (!transformedKey.ok) {
        errors.push(
          ...transformedKey.errors.map((error) => ({
            path: [`${key} (key)`, ...error.path],
            message: error.message
          }))
        );
      }
      if (!transformedValue.ok) {
        errors.push(
          ...transformedValue.errors.map((error) => ({
            path: [stringKey, ...error.path],
            message: error.message
          }))
        );
      }
      return {
        ok: false,
        errors
      };
    },
    Promise.resolve({ ok: true, value: {} })
  );
}
var init_record = __esm({
  "src/core/schemas/builders/record/record.ts"() {
    "use strict";
    init_Schema();
    init_entries();
    init_isPlainObject();
    init_schema_utils();
  }
});

// src/core/schemas/builders/record/index.ts
var init_record2 = __esm({
  "src/core/schemas/builders/record/index.ts"() {
    "use strict";
    init_record();
  }
});

// src/core/schemas/builders/set/set.ts
function set(schema) {
  const listSchema = list(schema);
  const baseSchema = {
    parse: async (raw, opts) => {
      const parsedList = await listSchema.parse(raw, opts);
      if (parsedList.ok) {
        return {
          ok: true,
          value: new Set(parsedList.value)
        };
      } else {
        return parsedList;
      }
    },
    json: async (parsed, opts) => {
      if (!(parsed instanceof Set)) {
        return {
          ok: false,
          errors: [
            {
              path: [],
              message: "Not a Set"
            }
          ]
        };
      }
      const jsonList = await listSchema.json([...parsed], opts);
      return jsonList;
    },
    getType: () => SchemaType.SET
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
var init_set = __esm({
  "src/core/schemas/builders/set/set.ts"() {
    "use strict";
    init_Schema();
    init_list2();
    init_schema_utils();
  }
});

// src/core/schemas/builders/set/index.ts
var init_set2 = __esm({
  "src/core/schemas/builders/set/index.ts"() {
    "use strict";
    init_set();
  }
});

// src/core/schemas/builders/undiscriminated-union/undiscriminatedUnion.ts
function undiscriminatedUnion(schemas) {
  const baseSchema = {
    parse: async (raw, opts) => {
      return validateAndTransformUndiscriminatedUnion(
        (schema) => schema.parse(raw, opts),
        schemas
      );
    },
    json: async (parsed, opts) => {
      return validateAndTransformUndiscriminatedUnion(
        (schema) => schema.json(parsed, opts),
        schemas
      );
    },
    getType: () => SchemaType.UNDISCRIMINATED_UNION
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema)
  };
}
async function validateAndTransformUndiscriminatedUnion(transform2, schemas) {
  const errors = [];
  for (const schema of schemas) {
    const transformed = await transform2(schema);
    if (transformed.ok) {
      return transformed;
    } else if (errors.length === 0) {
      errors.push(...transformed.errors);
    }
  }
  return {
    ok: false,
    errors
  };
}
var init_undiscriminatedUnion = __esm({
  "src/core/schemas/builders/undiscriminated-union/undiscriminatedUnion.ts"() {
    "use strict";
    init_Schema();
    init_schema_utils();
  }
});

// src/core/schemas/builders/undiscriminated-union/index.ts
var init_undiscriminated_union = __esm({
  "src/core/schemas/builders/undiscriminated-union/index.ts"() {
    "use strict";
    init_undiscriminatedUnion();
  }
});

// src/core/schemas/builders/union/discriminant.ts
function discriminant(parsedDiscriminant, rawDiscriminant) {
  return {
    parsedDiscriminant,
    rawDiscriminant
  };
}
var init_discriminant = __esm({
  "src/core/schemas/builders/union/discriminant.ts"() {
    "use strict";
  }
});

// src/core/schemas/builders/union/union.ts
function union(discriminant2, union2) {
  const rawDiscriminant = typeof discriminant2 === "string" ? discriminant2 : discriminant2.rawDiscriminant;
  const parsedDiscriminant = typeof discriminant2 === "string" ? discriminant2 : discriminant2.parsedDiscriminant;
  const discriminantValueSchema = enum_(keys(union2));
  const baseSchema = {
    parse: async (raw, opts) => {
      return transformAndValidateUnion({
        value: raw,
        discriminant: rawDiscriminant,
        transformedDiscriminant: parsedDiscriminant,
        transformDiscriminantValue: (discriminantValue) => discriminantValueSchema.parse(discriminantValue, {
          allowUnrecognizedEnumValues: opts?.allowUnrecognizedUnionMembers
        }),
        getAdditionalPropertiesSchema: (discriminantValue) => union2[discriminantValue],
        allowUnrecognizedUnionMembers: opts?.allowUnrecognizedUnionMembers,
        transformAdditionalProperties: (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.parse(additionalProperties, opts)
      });
    },
    json: async (parsed, opts) => {
      return transformAndValidateUnion({
        value: parsed,
        discriminant: parsedDiscriminant,
        transformedDiscriminant: rawDiscriminant,
        transformDiscriminantValue: (discriminantValue) => discriminantValueSchema.json(discriminantValue, {
          allowUnrecognizedEnumValues: opts?.allowUnrecognizedUnionMembers
        }),
        getAdditionalPropertiesSchema: (discriminantValue) => union2[discriminantValue],
        allowUnrecognizedUnionMembers: opts?.allowUnrecognizedUnionMembers,
        transformAdditionalProperties: (additionalProperties, additionalPropertiesSchema) => additionalPropertiesSchema.json(additionalProperties, opts)
      });
    },
    getType: () => SchemaType.UNION
  };
  return {
    ...baseSchema,
    ...getSchemaUtils(baseSchema),
    ...getObjectLikeUtils(baseSchema)
  };
}
async function transformAndValidateUnion({
  value,
  discriminant: discriminant2,
  transformedDiscriminant,
  transformDiscriminantValue,
  getAdditionalPropertiesSchema,
  allowUnrecognizedUnionMembers = false,
  transformAdditionalProperties
}) {
  if (!isPlainObject(value)) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: NOT_AN_OBJECT_ERROR_MESSAGE
        }
      ]
    };
  }
  const { [discriminant2]: discriminantValue, ...additionalProperties } = value;
  if (discriminantValue == null) {
    return {
      ok: false,
      errors: [
        {
          path: [],
          message: `Missing discriminant ("${discriminant2}")`
        }
      ]
    };
  }
  const transformedDiscriminantValue = await transformDiscriminantValue(discriminantValue);
  if (!transformedDiscriminantValue.ok) {
    return {
      ok: false,
      errors: transformedDiscriminantValue.errors.map((error) => ({
        path: [discriminant2, ...error.path],
        message: error.message
      }))
    };
  }
  const additionalPropertiesSchema = getAdditionalPropertiesSchema(transformedDiscriminantValue.value);
  if (additionalPropertiesSchema == null) {
    if (allowUnrecognizedUnionMembers) {
      return {
        ok: true,
        value: {
          [transformedDiscriminant]: transformedDiscriminantValue.value,
          ...additionalProperties
        }
      };
    } else {
      return {
        ok: false,
        errors: [
          {
            path: [discriminant2],
            message: "Unrecognized discriminant value"
          }
        ]
      };
    }
  }
  const transformedAdditionalProperties = await transformAdditionalProperties(
    additionalProperties,
    additionalPropertiesSchema
  );
  if (!transformedAdditionalProperties.ok) {
    return transformedAdditionalProperties;
  }
  return {
    ok: true,
    value: {
      [transformedDiscriminant]: discriminantValue,
      ...transformedAdditionalProperties.value
    }
  };
}
var init_union = __esm({
  "src/core/schemas/builders/union/union.ts"() {
    "use strict";
    init_Schema();
    init_isPlainObject();
    init_keys();
    init_enum2();
    init_object_like();
    init_schema_utils();
  }
});

// src/core/schemas/builders/union/index.ts
var init_union2 = __esm({
  "src/core/schemas/builders/union/index.ts"() {
    "use strict";
    init_discriminant();
    init_union();
  }
});

// src/core/schemas/builders/index.ts
var init_builders = __esm({
  "src/core/schemas/builders/index.ts"() {
    "use strict";
    init_date2();
    init_enum2();
    init_lazy2();
    init_list2();
    init_literals();
    init_object2();
    init_object_like();
    init_primitives();
    init_record2();
    init_schema_utils();
    init_set2();
    init_undiscriminated_union();
    init_union2();
  }
});

// src/core/schemas/index.ts
var schemas_exports = {};
__export(schemas_exports, {
  JsonError: () => JsonError,
  ParseError: () => ParseError,
  any: () => any,
  boolean: () => boolean,
  date: () => date,
  discriminant: () => discriminant,
  enum_: () => enum_,
  getObjectLikeUtils: () => getObjectLikeUtils,
  getObjectUtils: () => getObjectUtils,
  getSchemaUtils: () => getSchemaUtils,
  isProperty: () => isProperty,
  lazy: () => lazy,
  lazyObject: () => lazyObject,
  list: () => list,
  number: () => number,
  object: () => object,
  optional: () => optional,
  property: () => property,
  record: () => record,
  set: () => set,
  string: () => string,
  stringLiteral: () => stringLiteral,
  transform: () => transform,
  undiscriminatedUnion: () => undiscriminatedUnion,
  union: () => union,
  unknown: () => unknown,
  withParsedProperties: () => withParsedProperties
});
var init_schemas = __esm({
  "src/core/schemas/index.ts"() {
    "use strict";
    init_builders();
    init_Schema();
  }
});

// node_modules/js-base64/base64.mjs
var _TD, _TE, b64ch, b64chs, b64tab, _fromCC, _U8Afrom;
var init_base64 = __esm({
  "node_modules/js-base64/base64.mjs"() {
    _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
    _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
    b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    b64chs = Array.prototype.slice.call(b64ch);
    b64tab = ((a) => {
      let tab = {};
      a.forEach((c, i) => tab[c] = i);
      return tab;
    })(b64chs);
    _fromCC = String.fromCharCode.bind(String);
    _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
  }
});

// src/core/auth/BasicAuth.ts
var init_BasicAuth = __esm({
  "src/core/auth/BasicAuth.ts"() {
    "use strict";
    init_base64();
  }
});

// src/core/auth/BearerToken.ts
var init_BearerToken = __esm({
  "src/core/auth/BearerToken.ts"() {
    "use strict";
  }
});

// src/core/auth/index.ts
var init_auth = __esm({
  "src/core/auth/index.ts"() {
    "use strict";
    init_BasicAuth();
    init_BearerToken();
  }
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  "node_modules/axios/lib/helpers/bind.js"(exports, module) {
    "use strict";
    module.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };
  }
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS({
  "node_modules/axios/lib/utils.js"(exports, module) {
    "use strict";
    var bind = require_bind();
    var toString = Object.prototype.toString;
    var kindOf = function(cache) {
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    }(/* @__PURE__ */ Object.create(null));
    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }
    function isArray(val) {
      return Array.isArray(val);
    }
    function isUndefined(val) {
      return typeof val === "undefined";
    }
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
    var isArrayBuffer = kindOfTest("ArrayBuffer");
    function isArrayBufferView(val) {
      var result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
      }
      return result;
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function isObject(val) {
      return val !== null && typeof val === "object";
    }
    function isPlainObject2(val) {
      if (kindOf(val) !== "object") {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    var isDate = kindOfTest("Date");
    var isFile = kindOfTest("File");
    var isBlob = kindOfTest("Blob");
    var isFileList = kindOfTest("FileList");
    function isFunction(val) {
      return toString.call(val) === "[object Function]";
    }
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    function isFormData(thing) {
      var pattern = "[object FormData]";
      return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
    }
    var isURLSearchParams = kindOfTest("URLSearchParams");
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject2(result[key]) && isPlainObject2(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject2(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === "function") {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }
    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};
      destObj = destObj || {};
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    }
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
    function toArray(thing) {
      if (!thing)
        return null;
      var i = thing.length;
      if (isUndefined(i))
        return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }
    var isTypedArray = function(TypedArray) {
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    }(typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array));
    module.exports = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isObject,
      isPlainObject: isPlainObject2,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isFunction,
      isStream,
      isURLSearchParams,
      isStandardBrowserEnv,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      isTypedArray,
      isFileList
    };
  }
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS({
  "node_modules/axios/lib/helpers/buildURL.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    module.exports = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key = key + "[]";
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + "=" + encode(v));
          });
        });
        serializedParams = parts.join("&");
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    };
  }
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS({
  "node_modules/axios/lib/core/InterceptorManager.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };
    module.exports = InterceptorManager;
  }
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }
});

// node_modules/axios/lib/core/AxiosError.js
var require_AxiosError = __commonJS({
  "node_modules/axios/lib/core/AxiosError.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function AxiosError2(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = "AxiosError";
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }
    utils.inherits(AxiosError2, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });
    var prototype = AxiosError2.prototype;
    var descriptors = {};
    [
      "ERR_BAD_OPTION_VALUE",
      "ERR_BAD_OPTION",
      "ECONNABORTED",
      "ETIMEDOUT",
      "ERR_NETWORK",
      "ERR_FR_TOO_MANY_REDIRECTS",
      "ERR_DEPRECATED",
      "ERR_BAD_RESPONSE",
      "ERR_BAD_REQUEST",
      "ERR_CANCELED"
      // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = { value: code };
    });
    Object.defineProperties(AxiosError2, descriptors);
    Object.defineProperty(prototype, "isAxiosError", { value: true });
    AxiosError2.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);
      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });
      AxiosError2.call(axiosError, error.message, code, config, request, response);
      axiosError.name = error.name;
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    };
    module.exports = AxiosError2;
  }
});

// node_modules/axios/lib/defaults/transitional.js
var require_transitional = __commonJS({
  "node_modules/axios/lib/defaults/transitional.js"(exports, module) {
    "use strict";
    module.exports = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };
  }
});

// node_modules/axios/lib/helpers/toFormData.js
var require_toFormData = __commonJS({
  "node_modules/axios/lib/helpers/toFormData.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function toFormData(obj, formData) {
      formData = formData || new FormData();
      var stack = [];
      function convertValue(value) {
        if (value === null)
          return "";
        if (utils.isDate(value)) {
          return value.toISOString();
        }
        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
        }
        return value;
      }
      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error("Circular reference detected in " + parentKey);
          }
          stack.push(data);
          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value))
              return;
            var fullKey = parentKey ? parentKey + "." + key : key;
            var arr;
            if (value && !parentKey && typeof value === "object") {
              if (utils.endsWith(key, "{}")) {
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, "[]") && (arr = utils.toArray(value))) {
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }
            build(value, fullKey);
          });
          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }
      build(obj);
      return formData;
    }
    module.exports = toFormData;
  }
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  "node_modules/axios/lib/core/settle.js"(exports, module) {
    "use strict";
    var AxiosError2 = require_AxiosError();
    module.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError2(
          "Request failed with status code " + response.status,
          [AxiosError2.ERR_BAD_REQUEST, AxiosError2.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };
  }
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS({
  "node_modules/axios/lib/helpers/cookies.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils.isString(path)) {
            cookie.push("path=" + path);
          }
          if (utils.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }() : function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    }();
  }
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module) {
    "use strict";
    module.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports, module) {
    "use strict";
    module.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  "node_modules/axios/lib/core/buildFullPath.js"(exports, module) {
    "use strict";
    var isAbsoluteURL = require_isAbsoluteURL();
    var combineURLs = require_combineURLs();
    module.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };
  }
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS({
  "node_modules/axios/lib/helpers/parseHeaders.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var ignoreDuplicateOf = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ];
    module.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i = line.indexOf(":");
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS({
  "node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url) {
        var href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    }();
  }
});

// node_modules/axios/lib/cancel/CanceledError.js
var require_CanceledError = __commonJS({
  "node_modules/axios/lib/cancel/CanceledError.js"(exports, module) {
    "use strict";
    var AxiosError2 = require_AxiosError();
    var utils = require_utils();
    function CanceledError(message) {
      AxiosError2.call(this, message == null ? "canceled" : message, AxiosError2.ERR_CANCELED);
      this.name = "CanceledError";
    }
    utils.inherits(CanceledError, AxiosError2, {
      __CANCEL__: true
    });
    module.exports = CanceledError;
  }
});

// node_modules/axios/lib/helpers/parseProtocol.js
var require_parseProtocol = __commonJS({
  "node_modules/axios/lib/helpers/parseProtocol.js"(exports, module) {
    "use strict";
    module.exports = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    };
  }
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS({
  "node_modules/axios/lib/adapters/xhr.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var cookies = require_cookies();
    var buildURL = require_buildURL();
    var buildFullPath = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var transitionalDefaults = require_transitional();
    var AxiosError2 = require_AxiosError();
    var CanceledError = require_CanceledError();
    var parseProtocol = require_parseProtocol();
    module.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(new AxiosError2("Request aborted", AxiosError2.ECONNABORTED, config, request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(new AxiosError2("Network Error", AxiosError2.ERR_NETWORK, config, request, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          var transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError2(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError2.ETIMEDOUT : AxiosError2.ECONNABORTED,
            config,
            request
          ));
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request.addEventListener("progress", config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", config.onUploadProgress);
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || cancel && cancel.type ? new CanceledError() : cancel);
            request.abort();
            request = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        var protocol = parseProtocol(fullPath);
        if (protocol && ["http", "https", "file"].indexOf(protocol) === -1) {
          reject(new AxiosError2("Unsupported protocol " + protocol + ":", AxiosError2.ERR_BAD_REQUEST, config));
          return;
        }
        request.send(requestData);
      });
    };
  }
});

// node_modules/axios/lib/helpers/null.js
var require_null = __commonJS({
  "node_modules/axios/lib/helpers/null.js"(exports, module) {
    module.exports = null;
  }
});

// node_modules/axios/lib/defaults/index.js
var require_defaults = __commonJS({
  "node_modules/axios/lib/defaults/index.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var normalizeHeaderName = require_normalizeHeaderName();
    var AxiosError2 = require_AxiosError();
    var transitionalDefaults = require_transitional();
    var toFormData = require_toFormData();
    var DEFAULT_CONTENT_TYPE = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
        headers["Content-Type"] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== "undefined") {
        adapter = require_xhr();
      } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
        adapter = require_xhr();
      }
      return adapter;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults = {
      transitional: transitionalDefaults,
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, "Accept");
        normalizeHeaderName(headers, "Content-Type");
        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
          return data.toString();
        }
        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers["Content-Type"];
        var isFileList;
        if ((isFileList = utils.isFileList(data)) || isObjectPayload && contentType === "multipart/form-data") {
          var _FormData = this.env && this.env.FormData;
          return toFormData(isFileList ? { "files[]": data } : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === "application/json") {
          setContentTypeIfUnset(headers, "application/json");
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
        if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError2.from(e, AxiosError2.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }
        return data;
      }],
      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: require_null()
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      }
    };
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module.exports = defaults;
  }
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS({
  "node_modules/axios/lib/core/transformData.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var defaults = require_defaults();
    module.exports = function transformData(data, headers, fns) {
      var context = this || defaults;
      utils.forEach(fns, function transform2(fn) {
        data = fn.call(context, data, headers);
      });
      return data;
    };
  }
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  "node_modules/axios/lib/cancel/isCancel.js"(exports, module) {
    "use strict";
    module.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  "node_modules/axios/lib/core/dispatchRequest.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var transformData = require_transformData();
    var isCancel = require_isCancel();
    var defaults = require_defaults();
    var CanceledError = require_CanceledError();
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new CanceledError();
      }
    }
    module.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );
      utils.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS({
  "node_modules/axios/lib/core/mergeConfig.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        }
      }
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      var mergeMap = {
        "url": valueFromConfig2,
        "method": valueFromConfig2,
        "data": valueFromConfig2,
        "baseURL": defaultToConfig2,
        "transformRequest": defaultToConfig2,
        "transformResponse": defaultToConfig2,
        "paramsSerializer": defaultToConfig2,
        "timeout": defaultToConfig2,
        "timeoutMessage": defaultToConfig2,
        "withCredentials": defaultToConfig2,
        "adapter": defaultToConfig2,
        "responseType": defaultToConfig2,
        "xsrfCookieName": defaultToConfig2,
        "xsrfHeaderName": defaultToConfig2,
        "onUploadProgress": defaultToConfig2,
        "onDownloadProgress": defaultToConfig2,
        "decompress": defaultToConfig2,
        "maxContentLength": defaultToConfig2,
        "maxBodyLength": defaultToConfig2,
        "beforeRedirect": defaultToConfig2,
        "transport": defaultToConfig2,
        "httpAgent": defaultToConfig2,
        "httpsAgent": defaultToConfig2,
        "cancelToken": defaultToConfig2,
        "socketPath": defaultToConfig2,
        "responseEncoding": defaultToConfig2,
        "validateStatus": mergeDirectKeys
      };
      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    };
  }
});

// node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  "node_modules/axios/lib/env/data.js"(exports, module) {
    module.exports = {
      "version": "0.27.2"
    };
  }
});

// node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  "node_modules/axios/lib/helpers/validator.js"(exports, module) {
    "use strict";
    var VERSION = require_data().version;
    var AxiosError2 = require_AxiosError();
    var validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings = {};
    validators.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError2(
            formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
            AxiosError2.ERR_DEPRECATED
          );
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new AxiosError2("options must be an object", AxiosError2.ERR_BAD_OPTION_VALUE);
      }
      var keys2 = Object.keys(options);
      var i = keys2.length;
      while (i-- > 0) {
        var opt = keys2[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError2("option " + opt + " must be " + result, AxiosError2.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError2("Unknown option " + opt, AxiosError2.ERR_BAD_OPTION);
        }
      }
    }
    module.exports = {
      assertOptions,
      validators
    };
  }
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS({
  "node_modules/axios/lib/core/Axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var buildURL = require_buildURL();
    var InterceptorManager = require_InterceptorManager();
    var dispatchRequest = require_dispatchRequest();
    var mergeConfig = require_mergeConfig();
    var buildFullPath = require_buildFullPath();
    var validator = require_validator();
    var validators = validator.validators;
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    Axios.prototype.request = function request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = "get";
      }
      var transitional = config.transitional;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, void 0];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }
      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url,
            data
          }));
        };
      }
      Axios.prototype[method] = generateHTTPMethod();
      Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    });
    module.exports = Axios;
  }
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS({
  "node_modules/axios/lib/cancel/CancelToken.js"(exports, module) {
    "use strict";
    var CanceledError = require_CanceledError();
    function CancelToken(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      this.promise.then(function(cancel) {
        if (!token._listeners)
          return;
        var i;
        var l = token._listeners.length;
        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function(onfulfilled) {
        var _resolve;
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };
    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    };
    module.exports = CancelToken;
  }
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS({
  "node_modules/axios/lib/helpers/spread.js"(exports, module) {
    "use strict";
    module.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }
});

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  "node_modules/axios/lib/helpers/isAxiosError.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    module.exports = function isAxiosError(payload) {
      return utils.isObject(payload) && payload.isAxiosError === true;
    };
  }
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  "node_modules/axios/lib/axios.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var bind = require_bind();
    var Axios = require_Axios();
    var mergeConfig = require_mergeConfig();
    var defaults = require_defaults();
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);
      utils.extend(instance, Axios.prototype, context);
      utils.extend(instance, context);
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios2 = createInstance(defaults);
    axios2.Axios = Axios;
    axios2.CanceledError = require_CanceledError();
    axios2.CancelToken = require_CancelToken();
    axios2.isCancel = require_isCancel();
    axios2.VERSION = require_data().version;
    axios2.toFormData = require_toFormData();
    axios2.AxiosError = require_AxiosError();
    axios2.Cancel = axios2.CanceledError;
    axios2.all = function all(promises) {
      return Promise.all(promises);
    };
    axios2.spread = require_spread();
    axios2.isAxiosError = require_isAxiosError();
    module.exports = axios2;
    module.exports.default = axios2;
  }
});

// node_modules/axios/index.js
var require_axios2 = __commonJS({
  "node_modules/axios/index.js"(exports, module) {
    module.exports = require_axios();
  }
});

// src/core/fetcher/Fetcher.ts
var import_axios, fetcher;
var init_Fetcher = __esm({
  "src/core/fetcher/Fetcher.ts"() {
    "use strict";
    import_axios = __toESM(require_axios2());
    fetcher = async (args) => {
      const headers = {};
      if (args.contentType != null) {
        headers["Content-Type"] = args.contentType;
      }
      if (args.headers != null) {
        for (const [key, value] of Object.entries(args.headers)) {
          if (value != null) {
            headers[key] = value;
          }
        }
      }
      try {
        const response = await (0, import_axios.default)({
          url: args.url,
          params: args.queryParameters,
          method: args.method,
          headers,
          data: args.body,
          validateStatus: () => true,
          transformResponse: (response2) => response2,
          timeout: args.timeoutMs ?? 6e4,
          transitional: {
            clarifyTimeoutError: true
          },
          withCredentials: args.withCredentials
        });
        let body;
        if (response.data != null && response.data.length > 0) {
          try {
            body = JSON.parse(response.data) ?? void 0;
          } catch {
            return {
              ok: false,
              error: {
                reason: "non-json",
                statusCode: response.status,
                rawBody: response.data
              }
            };
          }
        }
        if (response.status >= 200 && response.status < 300) {
          return {
            ok: true,
            body
          };
        } else {
          return {
            ok: false,
            error: {
              reason: "status-code",
              statusCode: response.status,
              body
            }
          };
        }
      } catch (error) {
        if (error.code === "ETIMEDOUT") {
          return {
            ok: false,
            error: {
              reason: "timeout"
            }
          };
        }
        return {
          ok: false,
          error: {
            reason: "unknown",
            errorMessage: error.message
          }
        };
      }
    };
  }
});

// src/core/fetcher/Supplier.ts
var Supplier;
var init_Supplier = __esm({
  "src/core/fetcher/Supplier.ts"() {
    "use strict";
    Supplier = {
      get: async (supplier) => {
        if (typeof supplier === "function") {
          return supplier();
        } else {
          return supplier;
        }
      }
    };
  }
});

// src/core/fetcher/index.ts
var init_fetcher = __esm({
  "src/core/fetcher/index.ts"() {
    "use strict";
    init_Fetcher();
    init_Supplier();
  }
});

// src/core/index.ts
var init_core = __esm({
  "src/core/index.ts"() {
    "use strict";
    init_schemas();
    init_auth();
    init_fetcher();
  }
});

// node_modules/url-join/lib/url-join.js
var require_url_join = __commonJS({
  "node_modules/url-join/lib/url-join.js"(exports, module) {
    (function(name, context, definition) {
      if (typeof module !== "undefined" && module.exports)
        module.exports = definition();
      else if (typeof define === "function" && define.amd)
        define(definition);
      else
        context[name] = definition();
    })("urljoin", exports, function() {
      function normalize(strArray) {
        var resultArray = [];
        if (strArray.length === 0) {
          return "";
        }
        if (typeof strArray[0] !== "string") {
          throw new TypeError("Url must be a string. Received " + strArray[0]);
        }
        if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
          var first = strArray.shift();
          strArray[0] = first + strArray[0];
        }
        if (strArray[0].match(/^file:\/\/\//)) {
          strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
        } else {
          strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
        }
        for (var i = 0; i < strArray.length; i++) {
          var component = strArray[i];
          if (typeof component !== "string") {
            throw new TypeError("Url must be a string. Received " + component);
          }
          if (component === "") {
            continue;
          }
          if (i > 0) {
            component = component.replace(/^[\/]+/, "");
          }
          if (i < strArray.length - 1) {
            component = component.replace(/[\/]+$/, "");
          } else {
            component = component.replace(/[\/]+$/, "/");
          }
          resultArray.push(component);
        }
        var str = resultArray.join("/");
        str = str.replace(/\/(\?|&|#[^!])/g, "$1");
        var parts = str.split("?");
        str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
        return str;
      }
      return function() {
        var input;
        if (typeof arguments[0] === "object") {
          input = arguments[0];
        } else {
          input = [].slice.call(arguments);
        }
        return normalize(input);
      };
    });
  }
});

// src/serialization/resources/chat/types/SendMessageRequest.ts
var SendMessageRequest;
var init_SendMessageRequest = __esm({
  "src/serialization/resources/chat/types/SendMessageRequest.ts"() {
    "use strict";
    init_core();
    SendMessageRequest = schemas_exports.object({
      topic: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendTopic),
      messageBody: schemas_exports.property(
        "message_body",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendMessageBody)
      )
    });
  }
});

// src/serialization/resources/chat/types/SendMessageResponse.ts
var SendMessageResponse;
var init_SendMessageResponse = __esm({
  "src/serialization/resources/chat/types/SendMessageResponse.ts"() {
    "use strict";
    init_core();
    SendMessageResponse = schemas_exports.object({
      chatMessageId: schemas_exports.property("chat_message_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/chat/types/GetThreadHistoryResponse.ts
var GetThreadHistoryResponse;
var init_GetThreadHistoryResponse = __esm({
  "src/serialization/resources/chat/types/GetThreadHistoryResponse.ts"() {
    "use strict";
    init_core();
    GetThreadHistoryResponse = schemas_exports.object({
      chatMessages: schemas_exports.property(
        "chat_messages",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Message))
      )
    });
  }
});

// src/serialization/resources/chat/types/WatchThreadResponse.ts
var WatchThreadResponse;
var init_WatchThreadResponse = __esm({
  "src/serialization/resources/chat/types/WatchThreadResponse.ts"() {
    "use strict";
    init_core();
    WatchThreadResponse = schemas_exports.object({
      chatMessages: schemas_exports.property(
        "chat_messages",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Message))
      ),
      typingStatuses: schemas_exports.property(
        "typing_statuses",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.IdentityTypingStatus)).optional()
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/chat/types/SetThreadReadRequest.ts
var SetThreadReadRequest;
var init_SetThreadReadRequest = __esm({
  "src/serialization/resources/chat/types/SetThreadReadRequest.ts"() {
    "use strict";
    init_core();
    SetThreadReadRequest = schemas_exports.object({
      lastReadTs: schemas_exports.property("last_read_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/chat/types/GetThreadTopicResponse.ts
var GetThreadTopicResponse;
var init_GetThreadTopicResponse = __esm({
  "src/serialization/resources/chat/types/GetThreadTopicResponse.ts"() {
    "use strict";
    init_core();
    GetThreadTopicResponse = schemas_exports.object({
      topic: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopic)
    });
  }
});

// src/serialization/resources/chat/types/SetTypingStatusRequest.ts
var SetTypingStatusRequest;
var init_SetTypingStatusRequest = __esm({
  "src/serialization/resources/chat/types/SetTypingStatusRequest.ts"() {
    "use strict";
    init_core();
    SetTypingStatusRequest = schemas_exports.object({
      status: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TypingStatus)
    });
  }
});

// src/serialization/resources/chat/types/index.ts
var init_types = __esm({
  "src/serialization/resources/chat/types/index.ts"() {
    "use strict";
    init_SendMessageRequest();
    init_SendMessageResponse();
    init_GetThreadHistoryResponse();
    init_WatchThreadResponse();
    init_SetThreadReadRequest();
    init_GetThreadTopicResponse();
    init_SetTypingStatusRequest();
  }
});

// src/serialization/resources/chat/resources/common/types/SendTopic.ts
var SendTopic;
var init_SendTopic = __esm({
  "src/serialization/resources/chat/resources/common/types/SendTopic.ts"() {
    "use strict";
    init_core();
    SendTopic = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string().optional()),
      groupId: schemas_exports.property("group_id", schemas_exports.string().optional()),
      partyId: schemas_exports.property("party_id", schemas_exports.string().optional()),
      identityId: schemas_exports.property("identity_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SendMessageBody.ts
var SendMessageBody;
var init_SendMessageBody = __esm({
  "src/serialization/resources/chat/resources/common/types/SendMessageBody.ts"() {
    "use strict";
    init_core();
    SendMessageBody = schemas_exports.object({
      text: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendMessageBodyText).optional(),
      partyInvite: schemas_exports.property(
        "party_invite",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SendMessageBodyPartyInvite).optional()
      )
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SendMessageBodyText.ts
var SendMessageBodyText;
var init_SendMessageBodyText = __esm({
  "src/serialization/resources/chat/resources/common/types/SendMessageBodyText.ts"() {
    "use strict";
    init_core();
    SendMessageBodyText = schemas_exports.object({
      body: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SendMessageBodyPartyInvite.ts
var SendMessageBodyPartyInvite;
var init_SendMessageBodyPartyInvite = __esm({
  "src/serialization/resources/chat/resources/common/types/SendMessageBodyPartyInvite.ts"() {
    "use strict";
    init_core();
    SendMessageBodyPartyInvite = schemas_exports.object({
      token: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/QueryDirection.ts
var QueryDirection2;
var init_QueryDirection = __esm({
  "src/serialization/resources/chat/resources/common/types/QueryDirection.ts"() {
    "use strict";
    init_core();
    QueryDirection2 = schemas_exports.enum_(["before", "after", "before_and_after"]);
  }
});

// src/serialization/resources/chat/resources/common/types/Thread.ts
var Thread;
var init_Thread = __esm({
  "src/serialization/resources/chat/resources/common/types/Thread.ts"() {
    "use strict";
    init_core();
    Thread = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      topic: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Topic),
      tailMessage: schemas_exports.property(
        "tail_message",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Message).optional()
      ),
      lastReadTs: schemas_exports.property("last_read_ts", schemas_exports.date()),
      unreadCount: schemas_exports.property("unread_count", schemas_exports.number()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.ThreadExternalLinks)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/Message.ts
var Message;
var init_Message = __esm({
  "src/serialization/resources/chat/resources/common/types/Message.ts"() {
    "use strict";
    init_core();
    Message = schemas_exports.object({
      chatMessageId: schemas_exports.property("chat_message_id", schemas_exports.string()),
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      sendTs: schemas_exports.property("send_ts", schemas_exports.date()),
      body: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBody)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBody.ts
var MessageBody;
var init_MessageBody = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBody.ts"() {
    "use strict";
    init_core();
    MessageBody = schemas_exports.object({
      text: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyText).optional(),
      chatCreate: schemas_exports.property(
        "chat_create",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyChatCreate).optional()
      ),
      deleted: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyDeleted).optional(),
      identityFollow: schemas_exports.property(
        "identity_follow",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyIdentityFollow).optional()
      ),
      groupJoin: schemas_exports.property(
        "group_join",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyGroupJoin).optional()
      ),
      groupLeave: schemas_exports.property(
        "group_leave",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyGroupLeave).optional()
      ),
      groupMemberKick: schemas_exports.property(
        "group_member_kick",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyGroupMemberKick).optional()
      ),
      partyInvite: schemas_exports.property(
        "party_invite",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyPartyInvite).optional()
      ),
      partyJoinRequest: schemas_exports.property(
        "party_join_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyPartyJoinRequest).optional()
      ),
      partyJoin: schemas_exports.property(
        "party_join",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyPartyJoin).optional()
      ),
      partyLeave: schemas_exports.property(
        "party_leave",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyPartyLeave).optional()
      ),
      partyActivityChange: schemas_exports.property(
        "party_activity_change",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.MessageBodyPartyActivityChange).optional()
      )
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyText.ts
var MessageBodyText;
var init_MessageBodyText = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyText.ts"() {
    "use strict";
    init_core();
    MessageBodyText = schemas_exports.object({
      sender: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      body: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyChatCreate.ts
var MessageBodyChatCreate;
var init_MessageBodyChatCreate = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyChatCreate.ts"() {
    "use strict";
    init_core();
    MessageBodyChatCreate = schemas_exports.object({});
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyDeleted.ts
var MessageBodyDeleted;
var init_MessageBodyDeleted = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyDeleted.ts"() {
    "use strict";
    init_core();
    MessageBodyDeleted = schemas_exports.object({
      sender: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyIdentityFollow.ts
var MessageBodyIdentityFollow;
var init_MessageBodyIdentityFollow = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyIdentityFollow.ts"() {
    "use strict";
    init_core();
    MessageBodyIdentityFollow = schemas_exports.object({});
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyGroupJoin.ts
var MessageBodyGroupJoin;
var init_MessageBodyGroupJoin = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyGroupJoin.ts"() {
    "use strict";
    init_core();
    MessageBodyGroupJoin = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyGroupLeave.ts
var MessageBodyGroupLeave;
var init_MessageBodyGroupLeave = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyGroupLeave.ts"() {
    "use strict";
    init_core();
    MessageBodyGroupLeave = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyGroupMemberKick.ts
var MessageBodyGroupMemberKick;
var init_MessageBodyGroupMemberKick = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyGroupMemberKick.ts"() {
    "use strict";
    init_core();
    MessageBodyGroupMemberKick = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyPartyInvite.ts
var MessageBodyPartyInvite;
var init_MessageBodyPartyInvite = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyPartyInvite.ts"() {
    "use strict";
    init_core();
    MessageBodyPartyInvite = schemas_exports.object({
      sender: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Handle).optional(),
      inviteToken: schemas_exports.property(
        "invite_token",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt).optional()
      )
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyPartyJoinRequest.ts
var MessageBodyPartyJoinRequest;
var init_MessageBodyPartyJoinRequest = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyPartyJoinRequest.ts"() {
    "use strict";
    init_core();
    MessageBodyPartyJoinRequest = schemas_exports.object({
      sender: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyPartyJoin.ts
var MessageBodyPartyJoin;
var init_MessageBodyPartyJoin = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyPartyJoin.ts"() {
    "use strict";
    init_core();
    MessageBodyPartyJoin = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyPartyLeave.ts
var MessageBodyPartyLeave;
var init_MessageBodyPartyLeave = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyPartyLeave.ts"() {
    "use strict";
    init_core();
    MessageBodyPartyLeave = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/MessageBodyPartyActivityChange.ts
var MessageBodyPartyActivityChange;
var init_MessageBodyPartyActivityChange = __esm({
  "src/serialization/resources/chat/resources/common/types/MessageBodyPartyActivityChange.ts"() {
    "use strict";
    init_core();
    MessageBodyPartyActivityChange = schemas_exports.object({});
  }
});

// src/serialization/resources/chat/resources/common/types/Topic.ts
var Topic;
var init_Topic = __esm({
  "src/serialization/resources/chat/resources/common/types/Topic.ts"() {
    "use strict";
    init_core();
    Topic = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TopicGroup).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TopicParty).optional(),
      direct: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TopicDirect).optional()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TopicGroup.ts
var TopicGroup;
var init_TopicGroup = __esm({
  "src/serialization/resources/chat/resources/common/types/TopicGroup.ts"() {
    "use strict";
    init_core();
    TopicGroup = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TopicParty.ts
var TopicParty;
var init_TopicParty = __esm({
  "src/serialization/resources/chat/resources/common/types/TopicParty.ts"() {
    "use strict";
    init_core();
    TopicParty = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Handle)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TopicDirect.ts
var TopicDirect;
var init_TopicDirect = __esm({
  "src/serialization/resources/chat/resources/common/types/TopicDirect.ts"() {
    "use strict";
    init_core();
    TopicDirect = schemas_exports.object({
      identityA: schemas_exports.property(
        "identity_a",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      identityB: schemas_exports.property(
        "identity_b",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      )
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopic.ts
var SimpleTopic;
var init_SimpleTopic = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopic.ts"() {
    "use strict";
    init_core();
    SimpleTopic = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopicGroup).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopicParty).optional(),
      direct: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.SimpleTopicDirect).optional()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopicGroup.ts
var SimpleTopicGroup;
var init_SimpleTopicGroup = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopicGroup.ts"() {
    "use strict";
    init_core();
    SimpleTopicGroup = schemas_exports.object({
      group: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopicParty.ts
var SimpleTopicParty;
var init_SimpleTopicParty = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopicParty.ts"() {
    "use strict";
    init_core();
    SimpleTopicParty = schemas_exports.object({
      party: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/SimpleTopicDirect.ts
var SimpleTopicDirect;
var init_SimpleTopicDirect = __esm({
  "src/serialization/resources/chat/resources/common/types/SimpleTopicDirect.ts"() {
    "use strict";
    init_core();
    SimpleTopicDirect = schemas_exports.object({
      identityA: schemas_exports.property("identity_a", schemas_exports.string()),
      identityB: schemas_exports.property("identity_b", schemas_exports.string())
    });
  }
});

// src/serialization/resources/chat/resources/common/types/ThreadExternalLinks.ts
var ThreadExternalLinks;
var init_ThreadExternalLinks = __esm({
  "src/serialization/resources/chat/resources/common/types/ThreadExternalLinks.ts"() {
    "use strict";
    init_core();
    ThreadExternalLinks = schemas_exports.object({
      chat: schemas_exports.string()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/TypingStatus.ts
var TypingStatus;
var init_TypingStatus = __esm({
  "src/serialization/resources/chat/resources/common/types/TypingStatus.ts"() {
    "use strict";
    init_core();
    TypingStatus = schemas_exports.object({
      idle: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      typing: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional()
    });
  }
});

// src/serialization/resources/chat/resources/common/types/IdentityTypingStatus.ts
var IdentityTypingStatus;
var init_IdentityTypingStatus = __esm({
  "src/serialization/resources/chat/resources/common/types/IdentityTypingStatus.ts"() {
    "use strict";
    init_core();
    IdentityTypingStatus = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      status: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.TypingStatus)
    });
  }
});

// src/serialization/resources/chat/resources/common/types/index.ts
var init_types2 = __esm({
  "src/serialization/resources/chat/resources/common/types/index.ts"() {
    "use strict";
    init_SendTopic();
    init_SendMessageBody();
    init_SendMessageBodyText();
    init_SendMessageBodyPartyInvite();
    init_QueryDirection();
    init_Thread();
    init_Message();
    init_MessageBody();
    init_MessageBodyText();
    init_MessageBodyChatCreate();
    init_MessageBodyDeleted();
    init_MessageBodyIdentityFollow();
    init_MessageBodyGroupJoin();
    init_MessageBodyGroupLeave();
    init_MessageBodyGroupMemberKick();
    init_MessageBodyPartyInvite();
    init_MessageBodyPartyJoinRequest();
    init_MessageBodyPartyJoin();
    init_MessageBodyPartyLeave();
    init_MessageBodyPartyActivityChange();
    init_Topic();
    init_TopicGroup();
    init_TopicParty();
    init_TopicDirect();
    init_SimpleTopic();
    init_SimpleTopicGroup();
    init_SimpleTopicParty();
    init_SimpleTopicDirect();
    init_ThreadExternalLinks();
    init_TypingStatus();
    init_IdentityTypingStatus();
  }
});

// src/serialization/resources/chat/resources/common/index.ts
var common_exports13 = {};
__export(common_exports13, {
  IdentityTypingStatus: () => IdentityTypingStatus,
  Message: () => Message,
  MessageBody: () => MessageBody,
  MessageBodyChatCreate: () => MessageBodyChatCreate,
  MessageBodyDeleted: () => MessageBodyDeleted,
  MessageBodyGroupJoin: () => MessageBodyGroupJoin,
  MessageBodyGroupLeave: () => MessageBodyGroupLeave,
  MessageBodyGroupMemberKick: () => MessageBodyGroupMemberKick,
  MessageBodyIdentityFollow: () => MessageBodyIdentityFollow,
  MessageBodyPartyActivityChange: () => MessageBodyPartyActivityChange,
  MessageBodyPartyInvite: () => MessageBodyPartyInvite,
  MessageBodyPartyJoin: () => MessageBodyPartyJoin,
  MessageBodyPartyJoinRequest: () => MessageBodyPartyJoinRequest,
  MessageBodyPartyLeave: () => MessageBodyPartyLeave,
  MessageBodyText: () => MessageBodyText,
  QueryDirection: () => QueryDirection2,
  SendMessageBody: () => SendMessageBody,
  SendMessageBodyPartyInvite: () => SendMessageBodyPartyInvite,
  SendMessageBodyText: () => SendMessageBodyText,
  SendTopic: () => SendTopic,
  SimpleTopic: () => SimpleTopic,
  SimpleTopicDirect: () => SimpleTopicDirect,
  SimpleTopicGroup: () => SimpleTopicGroup,
  SimpleTopicParty: () => SimpleTopicParty,
  Thread: () => Thread,
  ThreadExternalLinks: () => ThreadExternalLinks,
  Topic: () => Topic,
  TopicDirect: () => TopicDirect,
  TopicGroup: () => TopicGroup,
  TopicParty: () => TopicParty,
  TypingStatus: () => TypingStatus
});
var init_common = __esm({
  "src/serialization/resources/chat/resources/common/index.ts"() {
    "use strict";
    init_types2();
  }
});

// src/serialization/resources/chat/resources/identity/types/GetDirectThreadResponse.ts
var GetDirectThreadResponse;
var init_GetDirectThreadResponse = __esm({
  "src/serialization/resources/chat/resources/identity/types/GetDirectThreadResponse.ts"() {
    "use strict";
    init_core();
    GetDirectThreadResponse = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string().optional()),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle).optional()
    });
  }
});

// src/serialization/resources/chat/resources/identity/types/index.ts
var init_types3 = __esm({
  "src/serialization/resources/chat/resources/identity/types/index.ts"() {
    "use strict";
    init_GetDirectThreadResponse();
  }
});

// src/serialization/resources/chat/resources/identity/index.ts
var identity_exports4 = {};
__export(identity_exports4, {
  GetDirectThreadResponse: () => GetDirectThreadResponse
});
var init_identity = __esm({
  "src/serialization/resources/chat/resources/identity/index.ts"() {
    "use strict";
    init_types3();
  }
});

// src/serialization/resources/chat/resources/index.ts
var init_resources = __esm({
  "src/serialization/resources/chat/resources/index.ts"() {
    "use strict";
    init_common();
    init_types2();
    init_identity();
    init_types3();
  }
});

// src/serialization/resources/chat/index.ts
var chat_exports2 = {};
__export(chat_exports2, {
  GetDirectThreadResponse: () => GetDirectThreadResponse,
  GetThreadHistoryResponse: () => GetThreadHistoryResponse,
  GetThreadTopicResponse: () => GetThreadTopicResponse,
  IdentityTypingStatus: () => IdentityTypingStatus,
  Message: () => Message,
  MessageBody: () => MessageBody,
  MessageBodyChatCreate: () => MessageBodyChatCreate,
  MessageBodyDeleted: () => MessageBodyDeleted,
  MessageBodyGroupJoin: () => MessageBodyGroupJoin,
  MessageBodyGroupLeave: () => MessageBodyGroupLeave,
  MessageBodyGroupMemberKick: () => MessageBodyGroupMemberKick,
  MessageBodyIdentityFollow: () => MessageBodyIdentityFollow,
  MessageBodyPartyActivityChange: () => MessageBodyPartyActivityChange,
  MessageBodyPartyInvite: () => MessageBodyPartyInvite,
  MessageBodyPartyJoin: () => MessageBodyPartyJoin,
  MessageBodyPartyJoinRequest: () => MessageBodyPartyJoinRequest,
  MessageBodyPartyLeave: () => MessageBodyPartyLeave,
  MessageBodyText: () => MessageBodyText,
  QueryDirection: () => QueryDirection2,
  SendMessageBody: () => SendMessageBody,
  SendMessageBodyPartyInvite: () => SendMessageBodyPartyInvite,
  SendMessageBodyText: () => SendMessageBodyText,
  SendMessageRequest: () => SendMessageRequest,
  SendMessageResponse: () => SendMessageResponse,
  SendTopic: () => SendTopic,
  SetThreadReadRequest: () => SetThreadReadRequest,
  SetTypingStatusRequest: () => SetTypingStatusRequest,
  SimpleTopic: () => SimpleTopic,
  SimpleTopicDirect: () => SimpleTopicDirect,
  SimpleTopicGroup: () => SimpleTopicGroup,
  SimpleTopicParty: () => SimpleTopicParty,
  Thread: () => Thread,
  ThreadExternalLinks: () => ThreadExternalLinks,
  Topic: () => Topic,
  TopicDirect: () => TopicDirect,
  TopicGroup: () => TopicGroup,
  TopicParty: () => TopicParty,
  TypingStatus: () => TypingStatus,
  WatchThreadResponse: () => WatchThreadResponse,
  common: () => common_exports13,
  identity: () => identity_exports4
});
var init_chat = __esm({
  "src/serialization/resources/chat/index.ts"() {
    "use strict";
    init_types();
    init_resources();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceRequest.ts
var CreateGameNamespaceRequest;
var init_CreateGameNamespaceRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceRequest.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceResponse.ts
var CreateGameNamespaceResponse;
var init_CreateGameNamespaceResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceResponse.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceResponse = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceRequest.ts
var ValidateGameNamespaceRequest;
var init_ValidateGameNamespaceRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceRequest.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceResponse.ts
var ValidateGameNamespaceResponse;
var init_ValidateGameNamespaceResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceResponse.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceResponse = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/GetGameNamespaceByIdResponse.ts
var GetGameNamespaceByIdResponse;
var init_GetGameNamespaceByIdResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/GetGameNamespaceByIdResponse.ts"() {
    "use strict";
    init_core();
    GetGameNamespaceByIdResponse = schemas_exports.object({
      namespace: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceFull)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateNamespaceCdnAuthUserRequest.ts
var UpdateNamespaceCdnAuthUserRequest;
var init_UpdateNamespaceCdnAuthUserRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateNamespaceCdnAuthUserRequest.ts"() {
    "use strict";
    init_core();
    UpdateNamespaceCdnAuthUserRequest = schemas_exports.object({
      user: schemas_exports.string(),
      password: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/SetNamespaceCdnAuthTypeRequest.ts
var SetNamespaceCdnAuthTypeRequest;
var init_SetNamespaceCdnAuthTypeRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/SetNamespaceCdnAuthTypeRequest.ts"() {
    "use strict";
    init_core();
    SetNamespaceCdnAuthTypeRequest = schemas_exports.object({
      authType: schemas_exports.property(
        "auth_type",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnAuthType)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ToggleNamespaceDomainPublicAuthRequest.ts
var ToggleNamespaceDomainPublicAuthRequest;
var init_ToggleNamespaceDomainPublicAuthRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ToggleNamespaceDomainPublicAuthRequest.ts"() {
    "use strict";
    init_core();
    ToggleNamespaceDomainPublicAuthRequest = schemas_exports.object({
      enabled: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/AddNamespaceDomainRequest.ts
var AddNamespaceDomainRequest;
var init_AddNamespaceDomainRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/AddNamespaceDomainRequest.ts"() {
    "use strict";
    init_core();
    AddNamespaceDomainRequest = schemas_exports.object({
      domain: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceMatchmakerConfigRequest.ts
var UpdateGameNamespaceMatchmakerConfigRequest;
var init_UpdateGameNamespaceMatchmakerConfigRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceMatchmakerConfigRequest.ts"() {
    "use strict";
    init_core();
    UpdateGameNamespaceMatchmakerConfigRequest = schemas_exports.object({
      lobbyCountMax: schemas_exports.property("lobby_count_max", schemas_exports.number()),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/GetGameNamespaceVersionHistoryResponse.ts
var GetGameNamespaceVersionHistoryResponse;
var init_GetGameNamespaceVersionHistoryResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/GetGameNamespaceVersionHistoryResponse.ts"() {
    "use strict";
    init_core();
    GetGameNamespaceVersionHistoryResponse = schemas_exports.object({
      versions: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceVersion)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigRequest.ts
var ValidateGameNamespaceMatchmakerConfigRequest;
var init_ValidateGameNamespaceMatchmakerConfigRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigRequest.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceMatchmakerConfigRequest = schemas_exports.object({
      lobbyCountMax: schemas_exports.property("lobby_count_max", schemas_exports.number()),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigResponse.ts
var ValidateGameNamespaceMatchmakerConfigResponse;
var init_ValidateGameNamespaceMatchmakerConfigResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceMatchmakerConfigResponse.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceMatchmakerConfigResponse = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentRequest.ts
var CreateGameNamespaceTokenDevelopmentRequest;
var init_CreateGameNamespaceTokenDevelopmentRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentRequest.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceTokenDevelopmentRequest = schemas_exports.object({
      hostname: schemas_exports.string(),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.MatchmakerDevelopmentPort
        )
      ).optional(),
      lobbyPorts: schemas_exports.property(
        "lobby_ports",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerPort
          )
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentResponse.ts
var CreateGameNamespaceTokenDevelopmentResponse;
var init_CreateGameNamespaceTokenDevelopmentResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenDevelopmentResponse.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceTokenDevelopmentResponse = schemas_exports.object({
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentRequest.ts
var ValidateGameNamespaceTokenDevelopmentRequest;
var init_ValidateGameNamespaceTokenDevelopmentRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentRequest.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceTokenDevelopmentRequest = schemas_exports.object({
      hostname: schemas_exports.string(),
      lobbyPorts: schemas_exports.property(
        "lobby_ports",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerPort
          )
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentResponse.ts
var ValidateGameNamespaceTokenDevelopmentResponse;
var init_ValidateGameNamespaceTokenDevelopmentResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/ValidateGameNamespaceTokenDevelopmentResponse.ts"() {
    "use strict";
    init_core();
    ValidateGameNamespaceTokenDevelopmentResponse = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenPublicResponse.ts
var CreateGameNamespaceTokenPublicResponse;
var init_CreateGameNamespaceTokenPublicResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/CreateGameNamespaceTokenPublicResponse.ts"() {
    "use strict";
    init_core();
    CreateGameNamespaceTokenPublicResponse = schemas_exports.object({
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceVersionRequest.ts
var UpdateGameNamespaceVersionRequest;
var init_UpdateGameNamespaceVersionRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/UpdateGameNamespaceVersionRequest.ts"() {
    "use strict";
    init_core();
    UpdateGameNamespaceVersionRequest = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/types/index.ts
var init_types4 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/types/index.ts"() {
    "use strict";
    init_CreateGameNamespaceRequest();
    init_CreateGameNamespaceResponse();
    init_ValidateGameNamespaceRequest();
    init_ValidateGameNamespaceResponse();
    init_GetGameNamespaceByIdResponse();
    init_UpdateNamespaceCdnAuthUserRequest();
    init_SetNamespaceCdnAuthTypeRequest();
    init_ToggleNamespaceDomainPublicAuthRequest();
    init_AddNamespaceDomainRequest();
    init_UpdateGameNamespaceMatchmakerConfigRequest();
    init_GetGameNamespaceVersionHistoryResponse();
    init_ValidateGameNamespaceMatchmakerConfigRequest();
    init_ValidateGameNamespaceMatchmakerConfigResponse();
    init_CreateGameNamespaceTokenDevelopmentRequest();
    init_CreateGameNamespaceTokenDevelopmentResponse();
    init_ValidateGameNamespaceTokenDevelopmentRequest();
    init_ValidateGameNamespaceTokenDevelopmentResponse();
    init_CreateGameNamespaceTokenPublicResponse();
    init_UpdateGameNamespaceVersionRequest();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/GetAnalyticsMatchmakerLiveResponse.ts
var GetAnalyticsMatchmakerLiveResponse;
var init_GetAnalyticsMatchmakerLiveResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/GetAnalyticsMatchmakerLiveResponse.ts"() {
    "use strict";
    init_core();
    GetAnalyticsMatchmakerLiveResponse = schemas_exports.object({
      lobbies: schemas_exports.list(
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LobbySummaryAnalytics
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/index.ts
var init_types5 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/types/index.ts"() {
    "use strict";
    init_GetAnalyticsMatchmakerLiveResponse();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/index.ts
var analytics_exports2 = {};
__export(analytics_exports2, {
  GetAnalyticsMatchmakerLiveResponse: () => GetAnalyticsMatchmakerLiveResponse
});
var init_analytics = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/analytics/index.ts"() {
    "use strict";
    init_types5();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/ListNamespaceLobbiesResponse.ts
var ListNamespaceLobbiesResponse;
var init_ListNamespaceLobbiesResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/ListNamespaceLobbiesResponse.ts"() {
    "use strict";
    init_core();
    ListNamespaceLobbiesResponse = schemas_exports.object({
      lobbies: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbySummary)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/GetNamespaceLobbyResponse.ts
var GetNamespaceLobbyResponse;
var init_GetNamespaceLobbyResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/GetNamespaceLobbyResponse.ts"() {
    "use strict";
    init_core();
    GetNamespaceLobbyResponse = schemas_exports.object({
      lobby: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbySummary
      ),
      metrics: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.SvcMetrics).optional(),
      stdoutPresignedUrls: schemas_exports.property(
        "stdout_presigned_urls",
        schemas_exports.list(schemas_exports.string())
      ),
      stderrPresignedUrls: schemas_exports.property(
        "stderr_presigned_urls",
        schemas_exports.list(schemas_exports.string())
      ),
      perfLists: schemas_exports.property(
        "perf_lists",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.SvcPerf)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/index.ts
var init_types6 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/types/index.ts"() {
    "use strict";
    init_ListNamespaceLobbiesResponse();
    init_GetNamespaceLobbyResponse();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/index.ts
var logs_exports3 = {};
__export(logs_exports3, {
  GetNamespaceLobbyResponse: () => GetNamespaceLobbyResponse,
  ListNamespaceLobbiesResponse: () => ListNamespaceLobbiesResponse
});
var init_logs = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/logs/index.ts"() {
    "use strict";
    init_types6();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/resources/index.ts
var init_resources2 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/resources/index.ts"() {
    "use strict";
    init_analytics();
    init_types5();
    init_logs();
    init_types6();
  }
});

// src/serialization/resources/cloud/resources/games/resources/namespaces/index.ts
var namespaces_exports2 = {};
__export(namespaces_exports2, {
  AddNamespaceDomainRequest: () => AddNamespaceDomainRequest,
  CreateGameNamespaceRequest: () => CreateGameNamespaceRequest,
  CreateGameNamespaceResponse: () => CreateGameNamespaceResponse,
  CreateGameNamespaceTokenDevelopmentRequest: () => CreateGameNamespaceTokenDevelopmentRequest,
  CreateGameNamespaceTokenDevelopmentResponse: () => CreateGameNamespaceTokenDevelopmentResponse,
  CreateGameNamespaceTokenPublicResponse: () => CreateGameNamespaceTokenPublicResponse,
  GetAnalyticsMatchmakerLiveResponse: () => GetAnalyticsMatchmakerLiveResponse,
  GetGameNamespaceByIdResponse: () => GetGameNamespaceByIdResponse,
  GetGameNamespaceVersionHistoryResponse: () => GetGameNamespaceVersionHistoryResponse,
  GetNamespaceLobbyResponse: () => GetNamespaceLobbyResponse,
  ListNamespaceLobbiesResponse: () => ListNamespaceLobbiesResponse,
  SetNamespaceCdnAuthTypeRequest: () => SetNamespaceCdnAuthTypeRequest,
  ToggleNamespaceDomainPublicAuthRequest: () => ToggleNamespaceDomainPublicAuthRequest,
  UpdateGameNamespaceMatchmakerConfigRequest: () => UpdateGameNamespaceMatchmakerConfigRequest,
  UpdateGameNamespaceVersionRequest: () => UpdateGameNamespaceVersionRequest,
  UpdateNamespaceCdnAuthUserRequest: () => UpdateNamespaceCdnAuthUserRequest,
  ValidateGameNamespaceMatchmakerConfigRequest: () => ValidateGameNamespaceMatchmakerConfigRequest,
  ValidateGameNamespaceMatchmakerConfigResponse: () => ValidateGameNamespaceMatchmakerConfigResponse,
  ValidateGameNamespaceRequest: () => ValidateGameNamespaceRequest,
  ValidateGameNamespaceResponse: () => ValidateGameNamespaceResponse,
  ValidateGameNamespaceTokenDevelopmentRequest: () => ValidateGameNamespaceTokenDevelopmentRequest,
  ValidateGameNamespaceTokenDevelopmentResponse: () => ValidateGameNamespaceTokenDevelopmentResponse,
  analytics: () => analytics_exports2,
  logs: () => logs_exports3
});
var init_namespaces = __esm({
  "src/serialization/resources/cloud/resources/games/resources/namespaces/index.ts"() {
    "use strict";
    init_types4();
    init_resources2();
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/ListGameCustomAvatarsResponse.ts
var ListGameCustomAvatarsResponse;
var init_ListGameCustomAvatarsResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/ListGameCustomAvatarsResponse.ts"() {
    "use strict";
    init_core();
    ListGameCustomAvatarsResponse = schemas_exports.object({
      customAvatars: schemas_exports.property(
        "custom_avatars",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CustomAvatarSummary)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadRequest.ts
var PrepareCustomAvatarUploadRequest;
var init_PrepareCustomAvatarUploadRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadRequest.ts"() {
    "use strict";
    init_core();
    PrepareCustomAvatarUploadRequest = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadResponse.ts
var PrepareCustomAvatarUploadResponse;
var init_PrepareCustomAvatarUploadResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/PrepareCustomAvatarUploadResponse.ts"() {
    "use strict";
    init_core();
    PrepareCustomAvatarUploadResponse = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/types/index.ts
var init_types7 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/types/index.ts"() {
    "use strict";
    init_ListGameCustomAvatarsResponse();
    init_PrepareCustomAvatarUploadRequest();
    init_PrepareCustomAvatarUploadResponse();
  }
});

// src/serialization/resources/cloud/resources/games/resources/avatars/index.ts
var avatars_exports2 = {};
__export(avatars_exports2, {
  ListGameCustomAvatarsResponse: () => ListGameCustomAvatarsResponse,
  PrepareCustomAvatarUploadRequest: () => PrepareCustomAvatarUploadRequest,
  PrepareCustomAvatarUploadResponse: () => PrepareCustomAvatarUploadResponse
});
var init_avatars = __esm({
  "src/serialization/resources/cloud/resources/games/resources/avatars/index.ts"() {
    "use strict";
    init_types7();
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/ListGameBuildsResponse.ts
var ListGameBuildsResponse;
var init_ListGameBuildsResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/ListGameBuildsResponse.ts"() {
    "use strict";
    init_core();
    ListGameBuildsResponse = schemas_exports.object({
      builds: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.BuildSummary)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildRequest.ts
var CreateGameBuildRequest;
var init_CreateGameBuildRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildRequest.ts"() {
    "use strict";
    init_core();
    CreateGameBuildRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      imageTag: schemas_exports.property("image_tag", schemas_exports.string()),
      imageFile: schemas_exports.property(
        "image_file",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PrepareFile)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildResponse.ts
var CreateGameBuildResponse;
var init_CreateGameBuildResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/CreateGameBuildResponse.ts"() {
    "use strict";
    init_core();
    CreateGameBuildResponse = schemas_exports.object({
      buildId: schemas_exports.property("build_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      imagePresignedRequest: schemas_exports.property(
        "image_presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/types/index.ts
var init_types8 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/types/index.ts"() {
    "use strict";
    init_ListGameBuildsResponse();
    init_CreateGameBuildRequest();
    init_CreateGameBuildResponse();
  }
});

// src/serialization/resources/cloud/resources/games/resources/builds/index.ts
var builds_exports2 = {};
__export(builds_exports2, {
  CreateGameBuildRequest: () => CreateGameBuildRequest,
  CreateGameBuildResponse: () => CreateGameBuildResponse,
  ListGameBuildsResponse: () => ListGameBuildsResponse
});
var init_builds = __esm({
  "src/serialization/resources/cloud/resources/games/resources/builds/index.ts"() {
    "use strict";
    init_types8();
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/ListGameCdnSitesResponse.ts
var ListGameCdnSitesResponse;
var init_ListGameCdnSitesResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/ListGameCdnSitesResponse.ts"() {
    "use strict";
    init_core();
    ListGameCdnSitesResponse = schemas_exports.object({
      sites: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnSiteSummary)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteRequest.ts
var CreateGameCdnSiteRequest;
var init_CreateGameCdnSiteRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteRequest.ts"() {
    "use strict";
    init_core();
    CreateGameCdnSiteRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      files: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PrepareFile)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteResponse.ts
var CreateGameCdnSiteResponse;
var init_CreateGameCdnSiteResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/CreateGameCdnSiteResponse.ts"() {
    "use strict";
    init_core();
    CreateGameCdnSiteResponse = schemas_exports.object({
      siteId: schemas_exports.property("site_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequests: schemas_exports.property(
        "presigned_requests",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/types/index.ts
var init_types9 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/types/index.ts"() {
    "use strict";
    init_ListGameCdnSitesResponse();
    init_CreateGameCdnSiteRequest();
    init_CreateGameCdnSiteResponse();
  }
});

// src/serialization/resources/cloud/resources/games/resources/cdn/index.ts
var cdn_exports3 = {};
__export(cdn_exports3, {
  CreateGameCdnSiteRequest: () => CreateGameCdnSiteRequest,
  CreateGameCdnSiteResponse: () => CreateGameCdnSiteResponse,
  ListGameCdnSitesResponse: () => ListGameCdnSitesResponse
});
var init_cdn = __esm({
  "src/serialization/resources/cloud/resources/games/resources/cdn/index.ts"() {
    "use strict";
    init_types9();
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GetGamesResponse.ts
var GetGamesResponse;
var init_GetGamesResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GetGamesResponse.ts"() {
    "use strict";
    init_core();
    GetGamesResponse = schemas_exports.object({
      games: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.games.GameSummary)
      ),
      groups: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameRequest.ts
var CreateGameRequest;
var init_CreateGameRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameRequest.ts"() {
    "use strict";
    init_core();
    CreateGameRequest = schemas_exports.object({
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      developerGroupId: schemas_exports.property("developer_group_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameResponse.ts
var CreateGameResponse;
var init_CreateGameResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/CreateGameResponse.ts"() {
    "use strict";
    init_core();
    CreateGameResponse = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameRequest.ts
var ValidateGameRequest;
var init_ValidateGameRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameRequest.ts"() {
    "use strict";
    init_core();
    ValidateGameRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameResponse.ts
var ValidateGameResponse;
var init_ValidateGameResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/ValidateGameResponse.ts"() {
    "use strict";
    init_core();
    ValidateGameResponse = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GetGameByIdResponse.ts
var GetGameByIdResponse;
var init_GetGameByIdResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GetGameByIdResponse.ts"() {
    "use strict";
    init_core();
    GetGameByIdResponse = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GameFull),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareRequest.ts
var GameBannerUploadPrepareRequest;
var init_GameBannerUploadPrepareRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareRequest.ts"() {
    "use strict";
    init_core();
    GameBannerUploadPrepareRequest = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareResponse.ts
var GameBannerUploadPrepareResponse;
var init_GameBannerUploadPrepareResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameBannerUploadPrepareResponse.ts"() {
    "use strict";
    init_core();
    GameBannerUploadPrepareResponse = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareRequest.ts
var GameLogoUploadPrepareRequest;
var init_GameLogoUploadPrepareRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareRequest.ts"() {
    "use strict";
    init_core();
    GameLogoUploadPrepareRequest = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareResponse.ts
var GameLogoUploadPrepareResponse;
var init_GameLogoUploadPrepareResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameLogoUploadPrepareResponse.ts"() {
    "use strict";
    init_core();
    GameLogoUploadPrepareResponse = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GetAnalyticsResponse.ts
var GetAnalyticsResponse;
var init_GetAnalyticsResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GetAnalyticsResponse.ts"() {
    "use strict";
    init_core();
    GetAnalyticsResponse = schemas_exports.object({
      dataSets: schemas_exports.property(
        "data_sets",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceAnalyticsDataSet
          )
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/GameSummary.ts
var GameSummary;
var init_GameSummary = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/GameSummary.ts"() {
    "use strict";
    init_core();
    GameSummary = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      developerGroupId: schemas_exports.property("developer_group_id", schemas_exports.string()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number().optional()),
      logoUrl: schemas_exports.property("logo_url", schemas_exports.string().optional()),
      bannerUrl: schemas_exports.property("banner_url", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/types/index.ts
var init_types10 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/types/index.ts"() {
    "use strict";
    init_GetGamesResponse();
    init_CreateGameRequest();
    init_CreateGameResponse();
    init_ValidateGameRequest();
    init_ValidateGameResponse();
    init_GetGameByIdResponse();
    init_GameBannerUploadPrepareRequest();
    init_GameBannerUploadPrepareResponse();
    init_GameLogoUploadPrepareRequest();
    init_GameLogoUploadPrepareResponse();
    init_GetAnalyticsResponse();
    init_GameSummary();
  }
});

// src/serialization/resources/cloud/resources/games/resources/games/index.ts
var games_exports3 = {};
__export(games_exports3, {
  CreateGameRequest: () => CreateGameRequest,
  CreateGameResponse: () => CreateGameResponse,
  GameBannerUploadPrepareRequest: () => GameBannerUploadPrepareRequest,
  GameBannerUploadPrepareResponse: () => GameBannerUploadPrepareResponse,
  GameLogoUploadPrepareRequest: () => GameLogoUploadPrepareRequest,
  GameLogoUploadPrepareResponse: () => GameLogoUploadPrepareResponse,
  GameSummary: () => GameSummary,
  GetAnalyticsResponse: () => GetAnalyticsResponse,
  GetGameByIdResponse: () => GetGameByIdResponse,
  GetGamesResponse: () => GetGamesResponse,
  ValidateGameRequest: () => ValidateGameRequest,
  ValidateGameResponse: () => ValidateGameResponse
});
var init_games = __esm({
  "src/serialization/resources/cloud/resources/games/resources/games/index.ts"() {
    "use strict";
    init_types10();
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryRequest.ts
var ExportMatchmakerLobbyHistoryRequest;
var init_ExportMatchmakerLobbyHistoryRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryRequest.ts"() {
    "use strict";
    init_core();
    ExportMatchmakerLobbyHistoryRequest = schemas_exports.object({
      queryStart: schemas_exports.property("query_start", schemas_exports.number().optional()),
      queryEnd: schemas_exports.property("query_end", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryResponse.ts
var ExportMatchmakerLobbyHistoryResponse;
var init_ExportMatchmakerLobbyHistoryResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportMatchmakerLobbyHistoryResponse.ts"() {
    "use strict";
    init_core();
    ExportMatchmakerLobbyHistoryResponse = schemas_exports.object({
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/DeleteMatchmakerLobbyResponse.ts
var DeleteMatchmakerLobbyResponse;
var init_DeleteMatchmakerLobbyResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/DeleteMatchmakerLobbyResponse.ts"() {
    "use strict";
    init_core();
    DeleteMatchmakerLobbyResponse = schemas_exports.object({
      didRemove: schemas_exports.property("did_remove", schemas_exports.boolean().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/GetLobbyLogsResponse.ts
var GetLobbyLogsResponse;
var init_GetLobbyLogsResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/GetLobbyLogsResponse.ts"() {
    "use strict";
    init_core();
    GetLobbyLogsResponse = schemas_exports.object({
      lines: schemas_exports.list(schemas_exports.string()),
      timestamps: schemas_exports.list(schemas_exports.string()),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsRequest.ts
var ExportLobbyLogsRequest;
var init_ExportLobbyLogsRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsRequest.ts"() {
    "use strict";
    init_core();
    ExportLobbyLogsRequest = schemas_exports.object({
      stream: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.games.LogStream)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsResponse.ts
var ExportLobbyLogsResponse;
var init_ExportLobbyLogsResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/ExportLobbyLogsResponse.ts"() {
    "use strict";
    init_core();
    ExportLobbyLogsResponse = schemas_exports.object({
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/LogStream.ts
var LogStream2;
var init_LogStream = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/LogStream.ts"() {
    "use strict";
    init_core();
    LogStream2 = schemas_exports.enum_(["std_out", "std_err"]);
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/types/index.ts
var init_types11 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/types/index.ts"() {
    "use strict";
    init_ExportMatchmakerLobbyHistoryRequest();
    init_ExportMatchmakerLobbyHistoryResponse();
    init_DeleteMatchmakerLobbyResponse();
    init_GetLobbyLogsResponse();
    init_ExportLobbyLogsRequest();
    init_ExportLobbyLogsResponse();
    init_LogStream();
  }
});

// src/serialization/resources/cloud/resources/games/resources/matchmaker/index.ts
var matchmaker_exports5 = {};
__export(matchmaker_exports5, {
  DeleteMatchmakerLobbyResponse: () => DeleteMatchmakerLobbyResponse,
  ExportLobbyLogsRequest: () => ExportLobbyLogsRequest,
  ExportLobbyLogsResponse: () => ExportLobbyLogsResponse,
  ExportMatchmakerLobbyHistoryRequest: () => ExportMatchmakerLobbyHistoryRequest,
  ExportMatchmakerLobbyHistoryResponse: () => ExportMatchmakerLobbyHistoryResponse,
  GetLobbyLogsResponse: () => GetLobbyLogsResponse,
  LogStream: () => LogStream2
});
var init_matchmaker = __esm({
  "src/serialization/resources/cloud/resources/games/resources/matchmaker/index.ts"() {
    "use strict";
    init_types11();
  }
});

// src/serialization/resources/cloud/resources/games/resources/tokens/types/CreateCloudTokenResponse.ts
var CreateCloudTokenResponse;
var init_CreateCloudTokenResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/tokens/types/CreateCloudTokenResponse.ts"() {
    "use strict";
    init_core();
    CreateCloudTokenResponse = schemas_exports.object({
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/tokens/types/index.ts
var init_types12 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/tokens/types/index.ts"() {
    "use strict";
    init_CreateCloudTokenResponse();
  }
});

// src/serialization/resources/cloud/resources/games/resources/tokens/index.ts
var tokens_exports2 = {};
__export(tokens_exports2, {
  CreateCloudTokenResponse: () => CreateCloudTokenResponse
});
var init_tokens = __esm({
  "src/serialization/resources/cloud/resources/games/resources/tokens/index.ts"() {
    "use strict";
    init_types12();
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionRequest.ts
var CreateGameVersionRequest;
var init_CreateGameVersionRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionRequest.ts"() {
    "use strict";
    init_core();
    CreateGameVersionRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Config)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionResponse.ts
var CreateGameVersionResponse;
var init_CreateGameVersionResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/CreateGameVersionResponse.ts"() {
    "use strict";
    init_core();
    CreateGameVersionResponse = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionRequest.ts
var ValidateGameVersionRequest;
var init_ValidateGameVersionRequest = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionRequest.ts"() {
    "use strict";
    init_core();
    ValidateGameVersionRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Config)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionResponse.ts
var ValidateGameVersionResponse;
var init_ValidateGameVersionResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/ValidateGameVersionResponse.ts"() {
    "use strict";
    init_core();
    ValidateGameVersionResponse = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/GetGameVersionByIdResponse.ts
var GetGameVersionByIdResponse;
var init_GetGameVersionByIdResponse = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/GetGameVersionByIdResponse.ts"() {
    "use strict";
    init_core();
    GetGameVersionByIdResponse = schemas_exports.object({
      version: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Full)
    });
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/types/index.ts
var init_types13 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/types/index.ts"() {
    "use strict";
    init_CreateGameVersionRequest();
    init_CreateGameVersionResponse();
    init_ValidateGameVersionRequest();
    init_ValidateGameVersionResponse();
    init_GetGameVersionByIdResponse();
  }
});

// src/serialization/resources/cloud/resources/games/resources/versions/index.ts
var versions_exports2 = {};
__export(versions_exports2, {
  CreateGameVersionRequest: () => CreateGameVersionRequest,
  CreateGameVersionResponse: () => CreateGameVersionResponse,
  GetGameVersionByIdResponse: () => GetGameVersionByIdResponse,
  ValidateGameVersionRequest: () => ValidateGameVersionRequest,
  ValidateGameVersionResponse: () => ValidateGameVersionResponse
});
var init_versions = __esm({
  "src/serialization/resources/cloud/resources/games/resources/versions/index.ts"() {
    "use strict";
    init_types13();
  }
});

// src/serialization/resources/cloud/resources/games/resources/index.ts
var init_resources3 = __esm({
  "src/serialization/resources/cloud/resources/games/resources/index.ts"() {
    "use strict";
    init_namespaces();
    init_avatars();
    init_types7();
    init_builds();
    init_types8();
    init_cdn();
    init_types9();
    init_games();
    init_types10();
    init_matchmaker();
    init_types11();
    init_tokens();
    init_types12();
    init_versions();
    init_types13();
  }
});

// src/serialization/resources/cloud/resources/games/index.ts
var games_exports4 = {};
__export(games_exports4, {
  CreateCloudTokenResponse: () => CreateCloudTokenResponse,
  CreateGameBuildRequest: () => CreateGameBuildRequest,
  CreateGameBuildResponse: () => CreateGameBuildResponse,
  CreateGameCdnSiteRequest: () => CreateGameCdnSiteRequest,
  CreateGameCdnSiteResponse: () => CreateGameCdnSiteResponse,
  CreateGameRequest: () => CreateGameRequest,
  CreateGameResponse: () => CreateGameResponse,
  CreateGameVersionRequest: () => CreateGameVersionRequest,
  CreateGameVersionResponse: () => CreateGameVersionResponse,
  DeleteMatchmakerLobbyResponse: () => DeleteMatchmakerLobbyResponse,
  ExportLobbyLogsRequest: () => ExportLobbyLogsRequest,
  ExportLobbyLogsResponse: () => ExportLobbyLogsResponse,
  ExportMatchmakerLobbyHistoryRequest: () => ExportMatchmakerLobbyHistoryRequest,
  ExportMatchmakerLobbyHistoryResponse: () => ExportMatchmakerLobbyHistoryResponse,
  GameBannerUploadPrepareRequest: () => GameBannerUploadPrepareRequest,
  GameBannerUploadPrepareResponse: () => GameBannerUploadPrepareResponse,
  GameLogoUploadPrepareRequest: () => GameLogoUploadPrepareRequest,
  GameLogoUploadPrepareResponse: () => GameLogoUploadPrepareResponse,
  GameSummary: () => GameSummary,
  GetAnalyticsResponse: () => GetAnalyticsResponse,
  GetGameByIdResponse: () => GetGameByIdResponse,
  GetGameVersionByIdResponse: () => GetGameVersionByIdResponse,
  GetGamesResponse: () => GetGamesResponse,
  GetLobbyLogsResponse: () => GetLobbyLogsResponse,
  ListGameBuildsResponse: () => ListGameBuildsResponse,
  ListGameCdnSitesResponse: () => ListGameCdnSitesResponse,
  ListGameCustomAvatarsResponse: () => ListGameCustomAvatarsResponse,
  LogStream: () => LogStream2,
  PrepareCustomAvatarUploadRequest: () => PrepareCustomAvatarUploadRequest,
  PrepareCustomAvatarUploadResponse: () => PrepareCustomAvatarUploadResponse,
  ValidateGameRequest: () => ValidateGameRequest,
  ValidateGameResponse: () => ValidateGameResponse,
  ValidateGameVersionRequest: () => ValidateGameVersionRequest,
  ValidateGameVersionResponse: () => ValidateGameVersionResponse,
  avatars: () => avatars_exports2,
  builds: () => builds_exports2,
  cdn: () => cdn_exports3,
  games: () => games_exports3,
  matchmaker: () => matchmaker_exports5,
  namespaces: () => namespaces_exports2,
  tokens: () => tokens_exports2,
  versions: () => versions_exports2
});
var init_games2 = __esm({
  "src/serialization/resources/cloud/resources/games/index.ts"() {
    "use strict";
    init_resources3();
  }
});

// src/serialization/resources/cloud/resources/version/types/Config.ts
var Config;
var init_Config = __esm({
  "src/serialization/resources/cloud/resources/version/types/Config.ts"() {
    "use strict";
    init_core();
    Config = schemas_exports.object({
      cdn: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Config).optional(),
      matchmaker: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.Config).optional(),
      kv: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.kv.Config).optional(),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.identity.Config).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/types/Full.ts
var Full;
var init_Full = __esm({
  "src/serialization/resources/cloud/resources/version/types/Full.ts"() {
    "use strict";
    init_core();
    Full = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Config)
    });
  }
});

// src/serialization/resources/cloud/resources/version/types/Summary.ts
var Summary;
var init_Summary = __esm({
  "src/serialization/resources/cloud/resources/version/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary = schemas_exports.object({
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/version/types/index.ts
var init_types14 = __esm({
  "src/serialization/resources/cloud/resources/version/types/index.ts"() {
    "use strict";
    init_Config();
    init_Full();
    init_Summary();
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Config.ts
var Config2;
var init_Config2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Config.ts"() {
    "use strict";
    init_core();
    Config2 = schemas_exports.object({
      buildCommand: schemas_exports.property("build_command", schemas_exports.string().optional()),
      buildOutput: schemas_exports.property("build_output", schemas_exports.string().optional()),
      siteId: schemas_exports.property("site_id", schemas_exports.string().optional()),
      routes: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Route)).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Route.ts
var Route;
var init_Route = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Route.ts"() {
    "use strict";
    init_core();
    Route = schemas_exports.object({
      glob: schemas_exports.string(),
      priority: schemas_exports.number(),
      middlewares: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Middleware)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Middleware.ts
var Middleware;
var init_Middleware = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Middleware.ts"() {
    "use strict";
    init_core();
    Middleware = schemas_exports.object({
      kind: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.MiddlewareKind
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/MiddlewareKind.ts
var MiddlewareKind;
var init_MiddlewareKind = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/MiddlewareKind.ts"() {
    "use strict";
    init_core();
    MiddlewareKind = schemas_exports.object({
      customHeaders: schemas_exports.property(
        "custom_headers",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.CustomHeadersMiddleware).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/CustomHeadersMiddleware.ts
var CustomHeadersMiddleware;
var init_CustomHeadersMiddleware = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/CustomHeadersMiddleware.ts"() {
    "use strict";
    init_core();
    CustomHeadersMiddleware = schemas_exports.object({
      headers: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.cdn.Header)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/Header.ts
var Header;
var init_Header = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/Header.ts"() {
    "use strict";
    init_core();
    Header = schemas_exports.object({
      name: schemas_exports.string(),
      value: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/types/index.ts
var init_types15 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/types/index.ts"() {
    "use strict";
    init_Config2();
    init_Route();
    init_Middleware();
    init_MiddlewareKind();
    init_CustomHeadersMiddleware();
    init_Header();
  }
});

// src/serialization/resources/cloud/resources/version/resources/cdn/index.ts
var cdn_exports4 = {};
__export(cdn_exports4, {
  Config: () => Config2,
  CustomHeadersMiddleware: () => CustomHeadersMiddleware,
  Header: () => Header,
  Middleware: () => Middleware,
  MiddlewareKind: () => MiddlewareKind,
  Route: () => Route
});
var init_cdn2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/cdn/index.ts"() {
    "use strict";
    init_types15();
  }
});

// src/serialization/resources/cloud/resources/version/resources/kv/types/Config.ts
var Config3;
var init_Config3 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/kv/types/Config.ts"() {
    "use strict";
    init_core();
    Config3 = schemas_exports.object({});
  }
});

// src/serialization/resources/cloud/resources/version/resources/kv/types/index.ts
var init_types16 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/kv/types/index.ts"() {
    "use strict";
    init_Config3();
  }
});

// src/serialization/resources/cloud/resources/version/resources/kv/index.ts
var kv_exports3 = {};
__export(kv_exports3, {
  Config: () => Config3
});
var init_kv = __esm({
  "src/serialization/resources/cloud/resources/version/resources/kv/index.ts"() {
    "use strict";
    init_types16();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/types/Config.ts
var Config4;
var init_Config4 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/types/Config.ts"() {
    "use strict";
    init_core();
    Config4 = schemas_exports.object({
      gameModes: schemas_exports.property(
        "game_modes",
        schemas_exports.record(
          schemas_exports.string(),
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameMode
          )
        ).optional()
      ),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.Captcha).optional(),
      devHostname: schemas_exports.property("dev_hostname", schemas_exports.string().optional()),
      regions: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRegion
        )
      ).optional(),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number().optional()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number().optional()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number().optional()),
      docker: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRuntimeDocker).optional(),
      tier: schemas_exports.string().optional(),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeIdleLobbiesConfig
        ).optional()
      ),
      lobbyGroups: schemas_exports.property(
        "lobby_groups",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroup
          )
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/types/index.ts
var init_types17 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/types/index.ts"() {
    "use strict";
    init_Config4();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/PortRange.ts
var PortRange;
var init_PortRange = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/PortRange.ts"() {
    "use strict";
    init_core();
    PortRange = schemas_exports.object({
      min: schemas_exports.number(),
      max: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/PortProtocol.ts
var PortProtocol2;
var init_PortProtocol = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/PortProtocol.ts"() {
    "use strict";
    init_core();
    PortProtocol2 = schemas_exports.enum_(["http", "https", "tcp", "tcp_tls", "udp"]);
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/ProxyKind.ts
var ProxyKind2;
var init_ProxyKind = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/ProxyKind.ts"() {
    "use strict";
    init_core();
    ProxyKind2 = schemas_exports.enum_(["none", "game_guard"]);
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/Captcha.ts
var Captcha;
var init_Captcha = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/Captcha.ts"() {
    "use strict";
    init_core();
    Captcha = schemas_exports.object({
      requestsBeforeReverify: schemas_exports.property("requests_before_reverify", schemas_exports.number()),
      verificationTtl: schemas_exports.property("verification_ttl", schemas_exports.number()),
      hcaptcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.CaptchaHcaptcha).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptcha.ts
var CaptchaHcaptcha;
var init_CaptchaHcaptcha = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptcha.ts"() {
    "use strict";
    init_core();
    CaptchaHcaptcha = schemas_exports.object({
      level: schemas_exports.lazy(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.CaptchaHcaptchaLevel
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptchaLevel.ts
var CaptchaHcaptchaLevel2;
var init_CaptchaHcaptchaLevel = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptchaLevel.ts"() {
    "use strict";
    init_core();
    CaptchaHcaptchaLevel2 = schemas_exports.enum_(["easy", "moderate", "difficult", "always_on"]);
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/NetworkMode.ts
var NetworkMode2;
var init_NetworkMode = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/NetworkMode.ts"() {
    "use strict";
    init_core();
    NetworkMode2 = schemas_exports.enum_(["bridge", "host"]);
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/index.ts
var init_types18 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/types/index.ts"() {
    "use strict";
    init_PortRange();
    init_PortProtocol();
    init_ProxyKind();
    init_Captcha();
    init_CaptchaHcaptcha();
    init_CaptchaHcaptchaLevel();
    init_NetworkMode();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/index.ts
var common_exports14 = {};
__export(common_exports14, {
  Captcha: () => Captcha,
  CaptchaHcaptcha: () => CaptchaHcaptcha,
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel2,
  NetworkMode: () => NetworkMode2,
  PortProtocol: () => PortProtocol2,
  PortRange: () => PortRange,
  ProxyKind: () => ProxyKind2
});
var init_common2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/common/index.ts"() {
    "use strict";
    init_types18();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameMode.ts
var GameMode;
var init_GameMode = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameMode.ts"() {
    "use strict";
    init_core();
    GameMode = schemas_exports.object({
      regions: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRegion
        )
      ).optional(),
      maxPlayers: schemas_exports.property("max_players", schemas_exports.number().optional()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number().optional()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number().optional()),
      docker: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRuntimeDocker
      ).optional(),
      tier: schemas_exports.string().optional(),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeIdleLobbiesConfig
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRegion.ts
var GameModeRegion;
var init_GameModeRegion = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRegion.ts"() {
    "use strict";
    init_core();
    GameModeRegion = schemas_exports.object({
      tier: schemas_exports.string().optional(),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeIdleLobbiesConfig
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDocker.ts
var GameModeRuntimeDocker;
var init_GameModeRuntimeDocker = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDocker.ts"() {
    "use strict";
    init_core();
    GameModeRuntimeDocker = schemas_exports.object({
      dockerfile: schemas_exports.string().optional(),
      image: schemas_exports.string().optional(),
      imageId: schemas_exports.property("image_id", schemas_exports.string().optional()),
      args: schemas_exports.list(schemas_exports.string()).optional(),
      env: schemas_exports.record(schemas_exports.string(), schemas_exports.string()).optional(),
      networkMode: schemas_exports.property(
        "network_mode",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.NetworkMode).optional()
      ),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.GameModeRuntimeDockerPort
        )
      ).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDockerPort.ts
var GameModeRuntimeDockerPort;
var init_GameModeRuntimeDockerPort = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeRuntimeDockerPort.ts"() {
    "use strict";
    init_core();
    GameModeRuntimeDockerPort = schemas_exports.object({
      port: schemas_exports.number().optional(),
      portRange: schemas_exports.property(
        "port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortRange).optional()
      ),
      protocol: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortProtocol).optional(),
      proxy: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.ProxyKind).optional(),
      devPort: schemas_exports.property("dev_port", schemas_exports.number().optional()),
      devPortRange: schemas_exports.property(
        "dev_port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortRange).optional()
      ),
      devProtocol: schemas_exports.property(
        "dev_protocol",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortProtocol).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeIdleLobbiesConfig.ts
var GameModeIdleLobbiesConfig;
var init_GameModeIdleLobbiesConfig = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/GameModeIdleLobbiesConfig.ts"() {
    "use strict";
    init_core();
    GameModeIdleLobbiesConfig = schemas_exports.object({
      min: schemas_exports.number(),
      max: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/index.ts
var init_types19 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/types/index.ts"() {
    "use strict";
    init_GameMode();
    init_GameModeRegion();
    init_GameModeRuntimeDocker();
    init_GameModeRuntimeDockerPort();
    init_GameModeIdleLobbiesConfig();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/index.ts
var gameMode_exports2 = {};
__export(gameMode_exports2, {
  GameMode: () => GameMode,
  GameModeIdleLobbiesConfig: () => GameModeIdleLobbiesConfig,
  GameModeRegion: () => GameModeRegion,
  GameModeRuntimeDocker: () => GameModeRuntimeDocker,
  GameModeRuntimeDockerPort: () => GameModeRuntimeDockerPort
});
var init_gameMode = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/index.ts"() {
    "use strict";
    init_types19();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroup.ts
var LobbyGroup;
var init_LobbyGroup = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroup.ts"() {
    "use strict";
    init_core();
    LobbyGroup = schemas_exports.object({
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      regions: schemas_exports.list(
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRegion
        )
      ),
      maxPlayersNormal: schemas_exports.property("max_players_normal", schemas_exports.number()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number()),
      runtime: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntime
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntime.ts
var LobbyGroupRuntime;
var init_LobbyGroupRuntime = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntime.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntime = schemas_exports.object({
      docker: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDocker
      ).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRegion.ts
var LobbyGroupRegion;
var init_LobbyGroupRegion = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRegion.ts"() {
    "use strict";
    init_core();
    LobbyGroupRegion = schemas_exports.object({
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      tierNameId: schemas_exports.property("tier_name_id", schemas_exports.string()),
      idleLobbies: schemas_exports.property(
        "idle_lobbies",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupIdleLobbiesConfig
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDocker.ts
var LobbyGroupRuntimeDocker;
var init_LobbyGroupRuntimeDocker = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDocker.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntimeDocker = schemas_exports.object({
      buildId: schemas_exports.property("build_id", schemas_exports.string().optional()),
      args: schemas_exports.list(schemas_exports.string()),
      envVars: schemas_exports.property(
        "env_vars",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerEnvVar
          )
        )
      ),
      networkMode: schemas_exports.property(
        "network_mode",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.NetworkMode).optional()
      ),
      ports: schemas_exports.list(
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.LobbyGroupRuntimeDockerPort
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerEnvVar.ts
var LobbyGroupRuntimeDockerEnvVar;
var init_LobbyGroupRuntimeDockerEnvVar = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerEnvVar.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntimeDockerEnvVar = schemas_exports.object({
      key: schemas_exports.string(),
      value: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerPort.ts
var LobbyGroupRuntimeDockerPort;
var init_LobbyGroupRuntimeDockerPort = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupRuntimeDockerPort.ts"() {
    "use strict";
    init_core();
    LobbyGroupRuntimeDockerPort = schemas_exports.object({
      label: schemas_exports.string(),
      targetPort: schemas_exports.property("target_port", schemas_exports.number().optional()),
      portRange: schemas_exports.property(
        "port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortRange).optional()
      ),
      proxyProtocol: schemas_exports.property(
        "proxy_protocol",
        schemas_exports.lazy(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortProtocol
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupIdleLobbiesConfig.ts
var LobbyGroupIdleLobbiesConfig;
var init_LobbyGroupIdleLobbiesConfig = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/LobbyGroupIdleLobbiesConfig.ts"() {
    "use strict";
    init_core();
    LobbyGroupIdleLobbiesConfig = schemas_exports.object({
      minIdleLobbies: schemas_exports.property("min_idle_lobbies", schemas_exports.number()),
      maxIdleLobbies: schemas_exports.property("max_idle_lobbies", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/index.ts
var init_types20 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/types/index.ts"() {
    "use strict";
    init_LobbyGroup();
    init_LobbyGroupRuntime();
    init_LobbyGroupRegion();
    init_LobbyGroupRuntimeDocker();
    init_LobbyGroupRuntimeDockerEnvVar();
    init_LobbyGroupRuntimeDockerPort();
    init_LobbyGroupIdleLobbiesConfig();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/index.ts
var lobbyGroup_exports2 = {};
__export(lobbyGroup_exports2, {
  LobbyGroup: () => LobbyGroup,
  LobbyGroupIdleLobbiesConfig: () => LobbyGroupIdleLobbiesConfig,
  LobbyGroupRegion: () => LobbyGroupRegion,
  LobbyGroupRuntime: () => LobbyGroupRuntime,
  LobbyGroupRuntimeDocker: () => LobbyGroupRuntimeDocker,
  LobbyGroupRuntimeDockerEnvVar: () => LobbyGroupRuntimeDockerEnvVar,
  LobbyGroupRuntimeDockerPort: () => LobbyGroupRuntimeDockerPort
});
var init_lobbyGroup = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/index.ts"() {
    "use strict";
    init_types20();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/index.ts
var init_resources4 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/resources/index.ts"() {
    "use strict";
    init_common2();
    init_types18();
    init_gameMode();
    init_types19();
    init_lobbyGroup();
    init_types20();
  }
});

// src/serialization/resources/cloud/resources/version/resources/matchmaker/index.ts
var matchmaker_exports6 = {};
__export(matchmaker_exports6, {
  Captcha: () => Captcha,
  CaptchaHcaptcha: () => CaptchaHcaptcha,
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel2,
  Config: () => Config4,
  GameMode: () => GameMode,
  GameModeIdleLobbiesConfig: () => GameModeIdleLobbiesConfig,
  GameModeRegion: () => GameModeRegion,
  GameModeRuntimeDocker: () => GameModeRuntimeDocker,
  GameModeRuntimeDockerPort: () => GameModeRuntimeDockerPort,
  LobbyGroup: () => LobbyGroup,
  LobbyGroupIdleLobbiesConfig: () => LobbyGroupIdleLobbiesConfig,
  LobbyGroupRegion: () => LobbyGroupRegion,
  LobbyGroupRuntime: () => LobbyGroupRuntime,
  LobbyGroupRuntimeDocker: () => LobbyGroupRuntimeDocker,
  LobbyGroupRuntimeDockerEnvVar: () => LobbyGroupRuntimeDockerEnvVar,
  LobbyGroupRuntimeDockerPort: () => LobbyGroupRuntimeDockerPort,
  NetworkMode: () => NetworkMode2,
  PortProtocol: () => PortProtocol2,
  PortRange: () => PortRange,
  ProxyKind: () => ProxyKind2,
  common: () => common_exports14,
  gameMode: () => gameMode_exports2,
  lobbyGroup: () => lobbyGroup_exports2
});
var init_matchmaker2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/matchmaker/index.ts"() {
    "use strict";
    init_types17();
    init_resources4();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/Config.ts
var Config5;
var init_Config5 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/Config.ts"() {
    "use strict";
    init_core();
    Config5 = schemas_exports.object({
      displayNames: schemas_exports.property(
        "display_names",
        schemas_exports.list(schemas_exports.string()).optional()
      ),
      avatars: schemas_exports.list(schemas_exports.string()).optional(),
      customDisplayNames: schemas_exports.property(
        "custom_display_names",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.identity.CustomDisplayName
          )
        ).optional()
      ),
      customAvatars: schemas_exports.property(
        "custom_avatars",
        schemas_exports.list(
          schemas_exports.lazyObject(
            async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.identity.CustomAvatar
          )
        ).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomDisplayName.ts
var CustomDisplayName;
var init_CustomDisplayName = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomDisplayName.ts"() {
    "use strict";
    init_core();
    CustomDisplayName = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomAvatar.ts
var CustomAvatar;
var init_CustomAvatar = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/CustomAvatar.ts"() {
    "use strict";
    init_core();
    CustomAvatar = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/index.ts
var init_types21 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/types/index.ts"() {
    "use strict";
    init_Config5();
    init_CustomDisplayName();
    init_CustomAvatar();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/index.ts
var pacakge_exports2 = {};
__export(pacakge_exports2, {
  Config: () => Config5,
  CustomAvatar: () => CustomAvatar,
  CustomDisplayName: () => CustomDisplayName
});
var init_pacakge = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/pacakge/index.ts"() {
    "use strict";
    init_types21();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/resources/index.ts
var init_resources5 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/resources/index.ts"() {
    "use strict";
    init_pacakge();
    init_types21();
  }
});

// src/serialization/resources/cloud/resources/version/resources/identity/index.ts
var identity_exports5 = {};
__export(identity_exports5, {
  Config: () => Config5,
  CustomAvatar: () => CustomAvatar,
  CustomDisplayName: () => CustomDisplayName,
  pacakge: () => pacakge_exports2
});
var init_identity2 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/identity/index.ts"() {
    "use strict";
    init_resources5();
  }
});

// src/serialization/resources/cloud/resources/version/resources/index.ts
var init_resources6 = __esm({
  "src/serialization/resources/cloud/resources/version/resources/index.ts"() {
    "use strict";
    init_cdn2();
    init_kv();
    init_matchmaker2();
    init_identity2();
  }
});

// src/serialization/resources/cloud/resources/version/index.ts
var version_exports2 = {};
__export(version_exports2, {
  Config: () => Config,
  Full: () => Full,
  Summary: () => Summary,
  cdn: () => cdn_exports4,
  identity: () => identity_exports5,
  kv: () => kv_exports3,
  matchmaker: () => matchmaker_exports6
});
var init_version = __esm({
  "src/serialization/resources/cloud/resources/version/index.ts"() {
    "use strict";
    init_types14();
    init_resources6();
  }
});

// src/serialization/resources/cloud/resources/auth/types/InspectResponse.ts
var InspectResponse;
var init_InspectResponse = __esm({
  "src/serialization/resources/cloud/resources/auth/types/InspectResponse.ts"() {
    "use strict";
    init_core();
    InspectResponse = schemas_exports.object({
      agent: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AuthAgent)
    });
  }
});

// src/serialization/resources/cloud/resources/auth/types/index.ts
var init_types22 = __esm({
  "src/serialization/resources/cloud/resources/auth/types/index.ts"() {
    "use strict";
    init_InspectResponse();
  }
});

// src/serialization/resources/cloud/resources/auth/index.ts
var auth_exports2 = {};
__export(auth_exports2, {
  InspectResponse: () => InspectResponse
});
var init_auth2 = __esm({
  "src/serialization/resources/cloud/resources/auth/index.ts"() {
    "use strict";
    init_types22();
  }
});

// src/serialization/resources/cloud/resources/common/types/SvcPerf.ts
var SvcPerf;
var init_SvcPerf = __esm({
  "src/serialization/resources/cloud/resources/common/types/SvcPerf.ts"() {
    "use strict";
    init_core();
    SvcPerf = schemas_exports.object({
      svcName: schemas_exports.property("svc_name", schemas_exports.string()),
      ts: schemas_exports.date(),
      duration: schemas_exports.number(),
      reqId: schemas_exports.property("req_id", schemas_exports.string().optional()),
      spans: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsPerfSpan)
      ),
      marks: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsPerfMark)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsPerfSpan.ts
var LogsPerfSpan;
var init_LogsPerfSpan = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsPerfSpan.ts"() {
    "use strict";
    init_core();
    LogsPerfSpan = schemas_exports.object({
      label: schemas_exports.string(),
      startTs: schemas_exports.property("start_ts", schemas_exports.date()),
      finishTs: schemas_exports.property("finish_ts", schemas_exports.date().optional()),
      reqId: schemas_exports.property("req_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsPerfMark.ts
var LogsPerfMark;
var init_LogsPerfMark = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsPerfMark.ts"() {
    "use strict";
    init_core();
    LogsPerfMark = schemas_exports.object({
      label: schemas_exports.string(),
      ts: schemas_exports.date(),
      rayId: schemas_exports.property("ray_id", schemas_exports.string().optional()),
      reqId: schemas_exports.property("req_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LobbySummaryAnalytics.ts
var LobbySummaryAnalytics;
var init_LobbySummaryAnalytics = __esm({
  "src/serialization/resources/cloud/resources/common/types/LobbySummaryAnalytics.ts"() {
    "use strict";
    init_core();
    LobbySummaryAnalytics = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      lobbyGroupId: schemas_exports.property("lobby_group_id", schemas_exports.string()),
      lobbyGroupNameId: schemas_exports.property("lobby_group_name_id", schemas_exports.string()),
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      isReady: schemas_exports.property("is_ready", schemas_exports.boolean()),
      isIdle: schemas_exports.property("is_idle", schemas_exports.boolean()),
      isClosed: schemas_exports.property("is_closed", schemas_exports.boolean()),
      isOutdated: schemas_exports.property("is_outdated", schemas_exports.boolean()),
      maxPlayersNormal: schemas_exports.property("max_players_normal", schemas_exports.number()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number()),
      registeredPlayerCount: schemas_exports.property("registered_player_count", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsLobbySummary.ts
var LogsLobbySummary;
var init_LogsLobbySummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsLobbySummary.ts"() {
    "use strict";
    init_core();
    LogsLobbySummary = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      lobbyGroupNameId: schemas_exports.property("lobby_group_name_id", schemas_exports.string()),
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      startTs: schemas_exports.property("start_ts", schemas_exports.date().optional()),
      readyTs: schemas_exports.property("ready_ts", schemas_exports.date().optional()),
      status: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbyStatus)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsLobbyStatus.ts
var LogsLobbyStatus;
var init_LogsLobbyStatus = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsLobbyStatus.ts"() {
    "use strict";
    init_core();
    LogsLobbyStatus = schemas_exports.object({
      running: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject),
      stopped: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LogsLobbyStatusStopped).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LogsLobbyStatusStopped.ts
var LogsLobbyStatusStopped;
var init_LogsLobbyStatusStopped = __esm({
  "src/serialization/resources/cloud/resources/common/types/LogsLobbyStatusStopped.ts"() {
    "use strict";
    init_core();
    LogsLobbyStatusStopped = schemas_exports.object({
      stopTs: schemas_exports.property("stop_ts", schemas_exports.date()),
      failed: schemas_exports.boolean(),
      exitCode: schemas_exports.property("exit_code", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/SvcMetrics.ts
var SvcMetrics;
var init_SvcMetrics = __esm({
  "src/serialization/resources/cloud/resources/common/types/SvcMetrics.ts"() {
    "use strict";
    init_core();
    SvcMetrics = schemas_exports.object({
      job: schemas_exports.string(),
      cpu: schemas_exports.list(schemas_exports.number()),
      memory: schemas_exports.list(schemas_exports.number()),
      memoryMax: schemas_exports.property("memory_max", schemas_exports.list(schemas_exports.number())),
      allocatedMemory: schemas_exports.property("allocated_memory", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AuthAgent.ts
var AuthAgent;
var init_AuthAgent = __esm({
  "src/serialization/resources/cloud/resources/common/types/AuthAgent.ts"() {
    "use strict";
    init_core();
    AuthAgent = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AuthAgentIdentity).optional(),
      gameCloud: schemas_exports.property(
        "game_cloud",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AuthAgentGameCloud).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AuthAgentIdentity.ts
var AuthAgentIdentity;
var init_AuthAgentIdentity = __esm({
  "src/serialization/resources/cloud/resources/common/types/AuthAgentIdentity.ts"() {
    "use strict";
    init_core();
    AuthAgentIdentity = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AuthAgentGameCloud.ts
var AuthAgentGameCloud;
var init_AuthAgentGameCloud = __esm({
  "src/serialization/resources/cloud/resources/common/types/AuthAgentGameCloud.ts"() {
    "use strict";
    init_core();
    AuthAgentGameCloud = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CustomAvatarSummary.ts
var CustomAvatarSummary;
var init_CustomAvatarSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/CustomAvatarSummary.ts"() {
    "use strict";
    init_core();
    CustomAvatarSummary = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      url: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number()),
      complete: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/BuildSummary.ts
var BuildSummary;
var init_BuildSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/BuildSummary.ts"() {
    "use strict";
    init_core();
    BuildSummary = schemas_exports.object({
      buildId: schemas_exports.property("build_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      contentLength: schemas_exports.property("content_length", schemas_exports.number()),
      complete: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnSiteSummary.ts
var CdnSiteSummary;
var init_CdnSiteSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnSiteSummary.ts"() {
    "use strict";
    init_core();
    CdnSiteSummary = schemas_exports.object({
      siteId: schemas_exports.property("site_id", schemas_exports.string()),
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      contentLength: schemas_exports.property("content_length", schemas_exports.number()),
      complete: schemas_exports.boolean()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GameFull.ts
var GameFull;
var init_GameFull = __esm({
  "src/serialization/resources/cloud/resources/common/types/GameFull.ts"() {
    "use strict";
    init_core();
    GameFull = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      developerGroupId: schemas_exports.property("developer_group_id", schemas_exports.string()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number()),
      logoUrl: schemas_exports.property("logo_url", schemas_exports.string().optional()),
      bannerUrl: schemas_exports.property("banner_url", schemas_exports.string().optional()),
      namespaces: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceSummary)
      ),
      versions: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.Summary)
      ),
      availableRegions: schemas_exports.property(
        "available_regions",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionSummary)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceSummary.ts
var NamespaceSummary;
var init_NamespaceSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceSummary.ts"() {
    "use strict";
    init_core();
    NamespaceSummary = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/RegionSummary.ts
var RegionSummary;
var init_RegionSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/RegionSummary.ts"() {
    "use strict";
    init_core();
    RegionSummary = schemas_exports.object({
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      regionNameId: schemas_exports.property("region_name_id", schemas_exports.string()),
      provider: schemas_exports.string(),
      universalRegion: schemas_exports.property("universal_region", schemas_exports.number()),
      providerDisplayName: schemas_exports.property("provider_display_name", schemas_exports.string()),
      regionDisplayName: schemas_exports.property("region_display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingSummary.ts
var GroupBillingSummary;
var init_GroupBillingSummary = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingSummary.ts"() {
    "use strict";
    init_core();
    GroupBillingSummary = schemas_exports.object({
      games: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GameLobbyExpenses)
      ),
      balance: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GameLobbyExpenses.ts
var GameLobbyExpenses;
var init_GameLobbyExpenses = __esm({
  "src/serialization/resources/cloud/resources/common/types/GameLobbyExpenses.ts"() {
    "use strict";
    init_core();
    GameLobbyExpenses = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      namespaces: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceSummary)
      ),
      expenses: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionTierExpenses)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/RegionTierExpenses.ts
var RegionTierExpenses;
var init_RegionTierExpenses = __esm({
  "src/serialization/resources/cloud/resources/common/types/RegionTierExpenses.ts"() {
    "use strict";
    init_core();
    RegionTierExpenses = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      tierNameId: schemas_exports.property("tier_name_id", schemas_exports.string()),
      lobbyGroupNameId: schemas_exports.property("lobby_group_name_id", schemas_exports.string()),
      uptime: schemas_exports.number(),
      expenses: schemas_exports.number()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBankSource.ts
var GroupBankSource;
var init_GroupBankSource = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBankSource.ts"() {
    "use strict";
    init_core();
    GroupBankSource = schemas_exports.object({
      accountNumber: schemas_exports.property("account_number", schemas_exports.string()),
      routingNumber: schemas_exports.property("routing_number", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingInvoice.ts
var GroupBillingInvoice;
var init_GroupBillingInvoice = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingInvoice.ts"() {
    "use strict";
    init_core();
    GroupBillingInvoice = schemas_exports.object({
      csvUrl: schemas_exports.property("csv_url", schemas_exports.string()),
      pdfUrl: schemas_exports.property("pdf_url", schemas_exports.string()),
      periodStartTs: schemas_exports.property("period_start_ts", schemas_exports.date()),
      periodEndTs: schemas_exports.property("period_end_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingPayment.ts
var GroupBillingPayment;
var init_GroupBillingPayment = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingPayment.ts"() {
    "use strict";
    init_core();
    GroupBillingPayment = schemas_exports.object({
      amount: schemas_exports.number(),
      description: schemas_exports.string().optional(),
      fromInvoice: schemas_exports.property("from_invoice", schemas_exports.boolean()),
      createdTs: schemas_exports.property("created_ts", schemas_exports.date()),
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingStatus)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingStatus.ts
var GroupBillingStatus2;
var init_GroupBillingStatus = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingStatus.ts"() {
    "use strict";
    init_core();
    GroupBillingStatus2 = schemas_exports.enum_(["succeeded", "processing", "refunded"]);
  }
});

// src/serialization/resources/cloud/resources/common/types/GroupBillingTransfer.ts
var GroupBillingTransfer;
var init_GroupBillingTransfer = __esm({
  "src/serialization/resources/cloud/resources/common/types/GroupBillingTransfer.ts"() {
    "use strict";
    init_core();
    GroupBillingTransfer = schemas_exports.object({
      amount: schemas_exports.number(),
      description: schemas_exports.string().optional(),
      createdTs: schemas_exports.property("created_ts", schemas_exports.date()),
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingStatus)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/RegionTier.ts
var RegionTier;
var init_RegionTier = __esm({
  "src/serialization/resources/cloud/resources/common/types/RegionTier.ts"() {
    "use strict";
    init_core();
    RegionTier = schemas_exports.object({
      tierNameId: schemas_exports.property("tier_name_id", schemas_exports.string()),
      rivetCoresNumerator: schemas_exports.property("rivet_cores_numerator", schemas_exports.number()),
      rivetCoresDenominator: schemas_exports.property("rivet_cores_denominator", schemas_exports.number()),
      cpu: schemas_exports.number(),
      memory: schemas_exports.number(),
      disk: schemas_exports.number(),
      bandwidth: schemas_exports.number(),
      pricePerSecond: schemas_exports.property("price_per_second", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceFull.ts
var NamespaceFull;
var init_NamespaceFull = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceFull.ts"() {
    "use strict";
    init_core();
    NamespaceFull = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      nameId: schemas_exports.property("name_id", schemas_exports.string()),
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NamespaceConfig)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceConfig.ts
var NamespaceConfig;
var init_NamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceConfig.ts"() {
    "use strict";
    init_core();
    NamespaceConfig = schemas_exports.object({
      cdn: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceConfig),
      matchmaker: schemas_exports.lazyObject(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.MatchmakerNamespaceConfig
      ),
      kv: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.KvNamespaceConfig),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.IdentityNamespaceConfig)
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceConfig.ts
var CdnNamespaceConfig;
var init_CdnNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceConfig.ts"() {
    "use strict";
    init_core();
    CdnNamespaceConfig = schemas_exports.object({
      enableDomainPublicAuth: schemas_exports.property("enable_domain_public_auth", schemas_exports.boolean()),
      domains: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomain)
      ),
      authType: schemas_exports.property(
        "auth_type",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnAuthType)
      ),
      authUserList: schemas_exports.property(
        "auth_user_list",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceAuthUser)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/MatchmakerNamespaceConfig.ts
var MatchmakerNamespaceConfig;
var init_MatchmakerNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/MatchmakerNamespaceConfig.ts"() {
    "use strict";
    init_core();
    MatchmakerNamespaceConfig = schemas_exports.object({
      lobbyCountMax: schemas_exports.property("lobby_count_max", schemas_exports.number()),
      maxPlayersPerClient: schemas_exports.property("max_players_per_client", schemas_exports.number()),
      maxPlayersPerClientVpn: schemas_exports.property("max_players_per_client_vpn", schemas_exports.number()),
      maxPlayersPerClientProxy: schemas_exports.property("max_players_per_client_proxy", schemas_exports.number()),
      maxPlayersPerClientTor: schemas_exports.property("max_players_per_client_tor", schemas_exports.number()),
      maxPlayersPerClientHosting: schemas_exports.property(
        "max_players_per_client_hosting",
        schemas_exports.number()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/KvNamespaceConfig.ts
var KvNamespaceConfig;
var init_KvNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/KvNamespaceConfig.ts"() {
    "use strict";
    init_core();
    KvNamespaceConfig = schemas_exports.object({});
  }
});

// src/serialization/resources/cloud/resources/common/types/IdentityNamespaceConfig.ts
var IdentityNamespaceConfig;
var init_IdentityNamespaceConfig = __esm({
  "src/serialization/resources/cloud/resources/common/types/IdentityNamespaceConfig.ts"() {
    "use strict";
    init_core();
    IdentityNamespaceConfig = schemas_exports.object({});
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnAuthType.ts
var CdnAuthType2;
var init_CdnAuthType = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnAuthType.ts"() {
    "use strict";
    init_core();
    CdnAuthType2 = schemas_exports.enum_(["none", "basic"]);
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomain.ts
var CdnNamespaceDomain;
var init_CdnNamespaceDomain = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomain.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomain = schemas_exports.object({
      domain: schemas_exports.string(),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      verificationStatus: schemas_exports.property(
        "verification_status",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomainVerificationStatus)
      ),
      verificationMethod: schemas_exports.property(
        "verification_method",
        schemas_exports.lazyObject(
          async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomainVerificationMethod
        )
      ),
      verificationErrors: schemas_exports.property(
        "verification_errors",
        schemas_exports.list(schemas_exports.string())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethod.ts
var CdnNamespaceDomainVerificationMethod;
var init_CdnNamespaceDomainVerificationMethod = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethod.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomainVerificationMethod = schemas_exports.object({
      invalid: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      http: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.CdnNamespaceDomainVerificationMethodHttp).optional()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethodHttp.ts
var CdnNamespaceDomainVerificationMethodHttp;
var init_CdnNamespaceDomainVerificationMethodHttp = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationMethodHttp.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomainVerificationMethodHttp = schemas_exports.object({
      cnameRecord: schemas_exports.property("cname_record", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationStatus.ts
var CdnNamespaceDomainVerificationStatus2;
var init_CdnNamespaceDomainVerificationStatus = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationStatus.ts"() {
    "use strict";
    init_core();
    CdnNamespaceDomainVerificationStatus2 = schemas_exports.enum_(["active", "pending", "failed"]);
  }
});

// src/serialization/resources/cloud/resources/common/types/CdnNamespaceAuthUser.ts
var CdnNamespaceAuthUser;
var init_CdnNamespaceAuthUser = __esm({
  "src/serialization/resources/cloud/resources/common/types/CdnNamespaceAuthUser.ts"() {
    "use strict";
    init_core();
    CdnNamespaceAuthUser = schemas_exports.object({
      user: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/MatchmakerDevelopmentPort.ts
var MatchmakerDevelopmentPort;
var init_MatchmakerDevelopmentPort = __esm({
  "src/serialization/resources/cloud/resources/common/types/MatchmakerDevelopmentPort.ts"() {
    "use strict";
    init_core();
    MatchmakerDevelopmentPort = schemas_exports.object({
      port: schemas_exports.number().optional(),
      portRange: schemas_exports.property(
        "port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortRange).optional()
      ),
      protocol: schemas_exports.lazy(
        async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.version.matchmaker.PortProtocol
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceVersion.ts
var NamespaceVersion;
var init_NamespaceVersion = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceVersion.ts"() {
    "use strict";
    init_core();
    NamespaceVersion = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      versionId: schemas_exports.property("version_id", schemas_exports.string()),
      deployTs: schemas_exports.property("deploy_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NamespaceAnalyticsDataSet.ts
var NamespaceAnalyticsDataSet;
var init_NamespaceAnalyticsDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/NamespaceAnalyticsDataSet.ts"() {
    "use strict";
    init_core();
    NamespaceAnalyticsDataSet = schemas_exports.object({
      matchmakerOverview: schemas_exports.property(
        "matchmaker_overview",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.MatchmakerOverviewDataSet).optional()
      ),
      playerCount: schemas_exports.property(
        "player_count",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.PlayerCountDataSet).optional()
      ),
      playerCountByRegion: schemas_exports.property(
        "player_count_by_region",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.PlayerCountByRegionDataSet).optional()
      ),
      playerCountByGameMode: schemas_exports.property(
        "player_count_by_game_mode",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.PlayerCountByGameModeDataSet).optional()
      ),
      lobbyCount: schemas_exports.property(
        "lobby_count",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LobbyCountDataSet).optional()
      ),
      lobbyCountByRegion: schemas_exports.property(
        "lobby_count_by_region",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LobbyCountByRegionDataSet).optional()
      ),
      lobbyCountByGameMode: schemas_exports.property(
        "lobby_count_by_game_mode",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LobbyCountByGameModeDataSet).optional()
      ),
      avgPlayDuration: schemas_exports.property(
        "avg_play_duration",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AvgPlayDurationDataSet).optional()
      ),
      avgPlayDurationByRegion: schemas_exports.property(
        "avg_play_duration_by_region",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AvgPlayDurationByRegionDataSet).optional()
      ),
      avgPlayDurationByGameMode: schemas_exports.property(
        "avg_play_duration_by_game_mode",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.AvgPlayDurationByGameModeDataSet).optional()
      ),
      newPlayersPerSecond: schemas_exports.property(
        "new_players_per_second",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NewPlayersPerSecondDataSet).optional()
      ),
      newLobbiesPerSecond: schemas_exports.property(
        "new_lobbies_per_second",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.NewLobbiesPerSecondDataSet).optional()
      ),
      destroyedLobbiesByFailure: schemas_exports.property(
        "destroyed_lobbies_by_failure",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.DestroyedLobbiesByFailureDataSet).optional()
      ),
      destroyedLobbiesByExitCode: schemas_exports.property(
        "destroyed_lobbies_by_exit_code",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.DestroyedLobbiesByExitCodeDataSet).optional()
      ),
      failedLobbies: schemas_exports.property(
        "failed_lobbies",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.FailedLobbiesDataSet).optional()
      ),
      lobbyReadyTime: schemas_exports.property(
        "lobby_ready_time",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.LobbyReadyTimeDataSet).optional()
      ),
      identityAccounts: schemas_exports.property(
        "identity_accounts",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.IdentityAccountsDataSet).optional()
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/MatchmakerOverviewDataSet.ts
var MatchmakerOverviewDataSet;
var init_MatchmakerOverviewDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/MatchmakerOverviewDataSet.ts"() {
    "use strict";
    init_core();
    MatchmakerOverviewDataSet = schemas_exports.object({
      playerCount: schemas_exports.property("player_count", schemas_exports.number()),
      lobbyCount: schemas_exports.property("lobby_count", schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/PlayerCountDataSet.ts
var PlayerCountDataSet;
var init_PlayerCountDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/PlayerCountDataSet.ts"() {
    "use strict";
    init_core();
    PlayerCountDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      playerCount: schemas_exports.property("player_count", schemas_exports.list(schemas_exports.number())),
      playerUnreadyCount: schemas_exports.property(
        "player_unready_count",
        schemas_exports.list(schemas_exports.number())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/PlayerCountByRegionDataSet.ts
var PlayerCountByRegionDataSet;
var init_PlayerCountByRegionDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/PlayerCountByRegionDataSet.ts"() {
    "use strict";
    init_core();
    PlayerCountByRegionDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      regionNameId: schemas_exports.property("region_name_id", schemas_exports.list(schemas_exports.string())),
      playerCount: schemas_exports.property("player_count", schemas_exports.list(schemas_exports.number()))
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/PlayerCountByGameModeDataSet.ts
var PlayerCountByGameModeDataSet;
var init_PlayerCountByGameModeDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/PlayerCountByGameModeDataSet.ts"() {
    "use strict";
    init_core();
    PlayerCountByGameModeDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      gameModeNameId: schemas_exports.property(
        "game_mode_name_id",
        schemas_exports.list(schemas_exports.string())
      ),
      playerCount: schemas_exports.property("player_count", schemas_exports.list(schemas_exports.number()))
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LobbyCountDataSet.ts
var LobbyCountDataSet;
var init_LobbyCountDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/LobbyCountDataSet.ts"() {
    "use strict";
    init_core();
    LobbyCountDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      lobbyCount: schemas_exports.property("lobby_count", schemas_exports.list(schemas_exports.number())),
      lobbyPreemptiveCount: schemas_exports.property(
        "lobby_preemptive_count",
        schemas_exports.list(schemas_exports.number())
      ),
      lobbyUnreadyCount: schemas_exports.property(
        "lobby_unready_count",
        schemas_exports.list(schemas_exports.number())
      ),
      lobbyClosedCount: schemas_exports.property(
        "lobby_closed_count",
        schemas_exports.list(schemas_exports.number())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LobbyCountByRegionDataSet.ts
var LobbyCountByRegionDataSet;
var init_LobbyCountByRegionDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/LobbyCountByRegionDataSet.ts"() {
    "use strict";
    init_core();
    LobbyCountByRegionDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      regionNameId: schemas_exports.property("region_name_id", schemas_exports.list(schemas_exports.string())),
      lobbyCount: schemas_exports.property("lobby_count", schemas_exports.list(schemas_exports.number()))
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LobbyCountByGameModeDataSet.ts
var LobbyCountByGameModeDataSet;
var init_LobbyCountByGameModeDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/LobbyCountByGameModeDataSet.ts"() {
    "use strict";
    init_core();
    LobbyCountByGameModeDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      gameModeNameId: schemas_exports.property(
        "game_mode_name_id",
        schemas_exports.list(schemas_exports.string())
      ),
      lobbyCount: schemas_exports.property("lobby_count", schemas_exports.list(schemas_exports.number()))
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AvgPlayDurationDataSet.ts
var AvgPlayDurationDataSet;
var init_AvgPlayDurationDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/AvgPlayDurationDataSet.ts"() {
    "use strict";
    init_core();
    AvgPlayDurationDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      duration: schemas_exports.list(schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AvgPlayDurationByRegionDataSet.ts
var AvgPlayDurationByRegionDataSet;
var init_AvgPlayDurationByRegionDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/AvgPlayDurationByRegionDataSet.ts"() {
    "use strict";
    init_core();
    AvgPlayDurationByRegionDataSet = schemas_exports.object({
      regionNameId: schemas_exports.property("region_name_id", schemas_exports.list(schemas_exports.string())),
      duration: schemas_exports.list(schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AvgPlayDurationByGameModeDataSet.ts
var AvgPlayDurationByGameModeDataSet;
var init_AvgPlayDurationByGameModeDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/AvgPlayDurationByGameModeDataSet.ts"() {
    "use strict";
    init_core();
    AvgPlayDurationByGameModeDataSet = schemas_exports.object({
      gameModeNameId: schemas_exports.property(
        "game_mode_name_id",
        schemas_exports.list(schemas_exports.string())
      ),
      duration: schemas_exports.list(schemas_exports.number())
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NewPlayersPerSecondDataSet.ts
var NewPlayersPerSecondDataSet;
var init_NewPlayersPerSecondDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/NewPlayersPerSecondDataSet.ts"() {
    "use strict";
    init_core();
    NewPlayersPerSecondDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      newPlayerCount: schemas_exports.property(
        "new_player_count",
        schemas_exports.list(schemas_exports.number())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/NewLobbiesPerSecondDataSet.ts
var NewLobbiesPerSecondDataSet;
var init_NewLobbiesPerSecondDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/NewLobbiesPerSecondDataSet.ts"() {
    "use strict";
    init_core();
    NewLobbiesPerSecondDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      newLobbyCount: schemas_exports.property("new_lobby_count", schemas_exports.list(schemas_exports.number()))
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/DestroyedLobbiesByFailureDataSet.ts
var DestroyedLobbiesByFailureDataSet;
var init_DestroyedLobbiesByFailureDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/DestroyedLobbiesByFailureDataSet.ts"() {
    "use strict";
    init_core();
    DestroyedLobbiesByFailureDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      failed: schemas_exports.list(schemas_exports.boolean()),
      destroyedLobbyCount: schemas_exports.property(
        "destroyed_lobby_count",
        schemas_exports.list(schemas_exports.number())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/DestroyedLobbiesByExitCodeDataSet.ts
var DestroyedLobbiesByExitCodeDataSet;
var init_DestroyedLobbiesByExitCodeDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/DestroyedLobbiesByExitCodeDataSet.ts"() {
    "use strict";
    init_core();
    DestroyedLobbiesByExitCodeDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      exitCode: schemas_exports.property("exit_code", schemas_exports.list(schemas_exports.number())),
      destroyedLobbyCount: schemas_exports.property(
        "destroyed_lobby_count",
        schemas_exports.list(schemas_exports.number())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/FailedLobbiesDataSet.ts
var FailedLobbiesDataSet;
var init_FailedLobbiesDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/FailedLobbiesDataSet.ts"() {
    "use strict";
    init_core();
    FailedLobbiesDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      destroyedLobbyCount: schemas_exports.property(
        "destroyed_lobby_count",
        schemas_exports.list(schemas_exports.number())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/LobbyReadyTimeDataSet.ts
var LobbyReadyTimeDataSet;
var init_LobbyReadyTimeDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/LobbyReadyTimeDataSet.ts"() {
    "use strict";
    init_core();
    LobbyReadyTimeDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      readyDuration: schemas_exports.property("ready_duration", schemas_exports.list(schemas_exports.number()))
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/IdentityAccountsDataSet.ts
var IdentityAccountsDataSet;
var init_IdentityAccountsDataSet = __esm({
  "src/serialization/resources/cloud/resources/common/types/IdentityAccountsDataSet.ts"() {
    "use strict";
    init_core();
    IdentityAccountsDataSet = schemas_exports.object({
      ts: schemas_exports.list(schemas_exports.number()),
      totalAccountCount: schemas_exports.property(
        "total_account_count",
        schemas_exports.list(schemas_exports.number())
      ),
      registeredAccountCount: schemas_exports.property(
        "registered_account_count",
        schemas_exports.list(schemas_exports.number())
      )
    });
  }
});

// src/serialization/resources/cloud/resources/common/types/AnalyticsVariantQuery.ts
var AnalyticsVariantQuery2;
var init_AnalyticsVariantQuery = __esm({
  "src/serialization/resources/cloud/resources/common/types/AnalyticsVariantQuery.ts"() {
    "use strict";
    init_core();
    AnalyticsVariantQuery2 = schemas_exports.enum_([
      "matchmaker_overview",
      "player_count",
      "player_count_by_region",
      "player_count_by_game_mode",
      "lobby_count",
      "lobby_count_by_region",
      "lobby_count_by_game_mode",
      "avg_play_duration",
      "avg_play_duration_by_region",
      "avg_play_duration_by_game_mode",
      "new_players_per_second",
      "new_lobbies_per_second",
      "destroyed_lobbies_by_failure",
      "destroyed_lobbies_by_exit_code",
      "failed_lobbies",
      "lobby_ready_time",
      "identity_accounts"
    ]);
  }
});

// src/serialization/resources/cloud/resources/common/types/index.ts
var init_types23 = __esm({
  "src/serialization/resources/cloud/resources/common/types/index.ts"() {
    "use strict";
    init_SvcPerf();
    init_LogsPerfSpan();
    init_LogsPerfMark();
    init_LobbySummaryAnalytics();
    init_LogsLobbySummary();
    init_LogsLobbyStatus();
    init_LogsLobbyStatusStopped();
    init_SvcMetrics();
    init_AuthAgent();
    init_AuthAgentIdentity();
    init_AuthAgentGameCloud();
    init_CustomAvatarSummary();
    init_BuildSummary();
    init_CdnSiteSummary();
    init_GameFull();
    init_NamespaceSummary();
    init_RegionSummary();
    init_GroupBillingSummary();
    init_GameLobbyExpenses();
    init_RegionTierExpenses();
    init_GroupBankSource();
    init_GroupBillingInvoice();
    init_GroupBillingPayment();
    init_GroupBillingStatus();
    init_GroupBillingTransfer();
    init_RegionTier();
    init_NamespaceFull();
    init_NamespaceConfig();
    init_CdnNamespaceConfig();
    init_MatchmakerNamespaceConfig();
    init_KvNamespaceConfig();
    init_IdentityNamespaceConfig();
    init_CdnAuthType();
    init_CdnNamespaceDomain();
    init_CdnNamespaceDomainVerificationMethod();
    init_CdnNamespaceDomainVerificationMethodHttp();
    init_CdnNamespaceDomainVerificationStatus();
    init_CdnNamespaceAuthUser();
    init_MatchmakerDevelopmentPort();
    init_NamespaceVersion();
    init_NamespaceAnalyticsDataSet();
    init_MatchmakerOverviewDataSet();
    init_PlayerCountDataSet();
    init_PlayerCountByRegionDataSet();
    init_PlayerCountByGameModeDataSet();
    init_LobbyCountDataSet();
    init_LobbyCountByRegionDataSet();
    init_LobbyCountByGameModeDataSet();
    init_AvgPlayDurationDataSet();
    init_AvgPlayDurationByRegionDataSet();
    init_AvgPlayDurationByGameModeDataSet();
    init_NewPlayersPerSecondDataSet();
    init_NewLobbiesPerSecondDataSet();
    init_DestroyedLobbiesByFailureDataSet();
    init_DestroyedLobbiesByExitCodeDataSet();
    init_FailedLobbiesDataSet();
    init_LobbyReadyTimeDataSet();
    init_IdentityAccountsDataSet();
    init_AnalyticsVariantQuery();
  }
});

// src/serialization/resources/cloud/resources/common/index.ts
var common_exports15 = {};
__export(common_exports15, {
  AnalyticsVariantQuery: () => AnalyticsVariantQuery2,
  AuthAgent: () => AuthAgent,
  AuthAgentGameCloud: () => AuthAgentGameCloud,
  AuthAgentIdentity: () => AuthAgentIdentity,
  AvgPlayDurationByGameModeDataSet: () => AvgPlayDurationByGameModeDataSet,
  AvgPlayDurationByRegionDataSet: () => AvgPlayDurationByRegionDataSet,
  AvgPlayDurationDataSet: () => AvgPlayDurationDataSet,
  BuildSummary: () => BuildSummary,
  CdnAuthType: () => CdnAuthType2,
  CdnNamespaceAuthUser: () => CdnNamespaceAuthUser,
  CdnNamespaceConfig: () => CdnNamespaceConfig,
  CdnNamespaceDomain: () => CdnNamespaceDomain,
  CdnNamespaceDomainVerificationMethod: () => CdnNamespaceDomainVerificationMethod,
  CdnNamespaceDomainVerificationMethodHttp: () => CdnNamespaceDomainVerificationMethodHttp,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus2,
  CdnSiteSummary: () => CdnSiteSummary,
  CustomAvatarSummary: () => CustomAvatarSummary,
  DestroyedLobbiesByExitCodeDataSet: () => DestroyedLobbiesByExitCodeDataSet,
  DestroyedLobbiesByFailureDataSet: () => DestroyedLobbiesByFailureDataSet,
  FailedLobbiesDataSet: () => FailedLobbiesDataSet,
  GameFull: () => GameFull,
  GameLobbyExpenses: () => GameLobbyExpenses,
  GroupBankSource: () => GroupBankSource,
  GroupBillingInvoice: () => GroupBillingInvoice,
  GroupBillingPayment: () => GroupBillingPayment,
  GroupBillingStatus: () => GroupBillingStatus2,
  GroupBillingSummary: () => GroupBillingSummary,
  GroupBillingTransfer: () => GroupBillingTransfer,
  IdentityAccountsDataSet: () => IdentityAccountsDataSet,
  IdentityNamespaceConfig: () => IdentityNamespaceConfig,
  KvNamespaceConfig: () => KvNamespaceConfig,
  LobbyCountByGameModeDataSet: () => LobbyCountByGameModeDataSet,
  LobbyCountByRegionDataSet: () => LobbyCountByRegionDataSet,
  LobbyCountDataSet: () => LobbyCountDataSet,
  LobbyReadyTimeDataSet: () => LobbyReadyTimeDataSet,
  LobbySummaryAnalytics: () => LobbySummaryAnalytics,
  LogsLobbyStatus: () => LogsLobbyStatus,
  LogsLobbyStatusStopped: () => LogsLobbyStatusStopped,
  LogsLobbySummary: () => LogsLobbySummary,
  LogsPerfMark: () => LogsPerfMark,
  LogsPerfSpan: () => LogsPerfSpan,
  MatchmakerDevelopmentPort: () => MatchmakerDevelopmentPort,
  MatchmakerNamespaceConfig: () => MatchmakerNamespaceConfig,
  MatchmakerOverviewDataSet: () => MatchmakerOverviewDataSet,
  NamespaceAnalyticsDataSet: () => NamespaceAnalyticsDataSet,
  NamespaceConfig: () => NamespaceConfig,
  NamespaceFull: () => NamespaceFull,
  NamespaceSummary: () => NamespaceSummary,
  NamespaceVersion: () => NamespaceVersion,
  NewLobbiesPerSecondDataSet: () => NewLobbiesPerSecondDataSet,
  NewPlayersPerSecondDataSet: () => NewPlayersPerSecondDataSet,
  PlayerCountByGameModeDataSet: () => PlayerCountByGameModeDataSet,
  PlayerCountByRegionDataSet: () => PlayerCountByRegionDataSet,
  PlayerCountDataSet: () => PlayerCountDataSet,
  RegionSummary: () => RegionSummary,
  RegionTier: () => RegionTier,
  RegionTierExpenses: () => RegionTierExpenses,
  SvcMetrics: () => SvcMetrics,
  SvcPerf: () => SvcPerf
});
var init_common3 = __esm({
  "src/serialization/resources/cloud/resources/common/index.ts"() {
    "use strict";
    init_types23();
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/types/PrepareDeviceLinkResponse.ts
var PrepareDeviceLinkResponse;
var init_PrepareDeviceLinkResponse = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/types/PrepareDeviceLinkResponse.ts"() {
    "use strict";
    init_core();
    PrepareDeviceLinkResponse = schemas_exports.object({
      deviceLinkId: schemas_exports.property("device_link_id", schemas_exports.string()),
      deviceLinkToken: schemas_exports.property("device_link_token", schemas_exports.string()),
      deviceLinkUrl: schemas_exports.property("device_link_url", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/types/GetDeviceLinkResponse.ts
var GetDeviceLinkResponse;
var init_GetDeviceLinkResponse = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/types/GetDeviceLinkResponse.ts"() {
    "use strict";
    init_core();
    GetDeviceLinkResponse = schemas_exports.object({
      cloudToken: schemas_exports.property("cloud_token", schemas_exports.string().optional()),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/types/index.ts
var init_types24 = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/types/index.ts"() {
    "use strict";
    init_PrepareDeviceLinkResponse();
    init_GetDeviceLinkResponse();
  }
});

// src/serialization/resources/cloud/resources/devices/resources/links/index.ts
var links_exports3 = {};
__export(links_exports3, {
  GetDeviceLinkResponse: () => GetDeviceLinkResponse,
  PrepareDeviceLinkResponse: () => PrepareDeviceLinkResponse
});
var init_links = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/links/index.ts"() {
    "use strict";
    init_types24();
  }
});

// src/serialization/resources/cloud/resources/devices/resources/index.ts
var init_resources7 = __esm({
  "src/serialization/resources/cloud/resources/devices/resources/index.ts"() {
    "use strict";
    init_links();
    init_types24();
  }
});

// src/serialization/resources/cloud/resources/devices/index.ts
var devices_exports2 = {};
__export(devices_exports2, {
  GetDeviceLinkResponse: () => GetDeviceLinkResponse,
  PrepareDeviceLinkResponse: () => PrepareDeviceLinkResponse,
  links: () => links_exports3
});
var init_devices = __esm({
  "src/serialization/resources/cloud/resources/devices/index.ts"() {
    "use strict";
    init_resources7();
  }
});

// src/serialization/resources/cloud/resources/groups/types/ValidateGroupRequest.ts
var ValidateGroupRequest;
var init_ValidateGroupRequest = __esm({
  "src/serialization/resources/cloud/resources/groups/types/ValidateGroupRequest.ts"() {
    "use strict";
    init_core();
    ValidateGroupRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/ValidateGroupResponse.ts
var ValidateGroupResponse;
var init_ValidateGroupResponse = __esm({
  "src/serialization/resources/cloud/resources/groups/types/ValidateGroupResponse.ts"() {
    "use strict";
    init_core();
    ValidateGroupResponse = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetBillingResponse.ts
var GetBillingResponse;
var init_GetBillingResponse = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetBillingResponse.ts"() {
    "use strict";
    init_core();
    GetBillingResponse = schemas_exports.object({
      billing: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingSummary),
      bankSource: schemas_exports.property(
        "bank_source",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBankSource)
      ),
      availableRegions: schemas_exports.property(
        "available_regions",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionSummary)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetInvoicesListResponse.ts
var GetInvoicesListResponse;
var init_GetInvoicesListResponse = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetInvoicesListResponse.ts"() {
    "use strict";
    init_core();
    GetInvoicesListResponse = schemas_exports.object({
      invoices: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingInvoice)
      ),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetPaymentsListResponse.ts
var GetPaymentsListResponse;
var init_GetPaymentsListResponse = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetPaymentsListResponse.ts"() {
    "use strict";
    init_core();
    GetPaymentsListResponse = schemas_exports.object({
      payments: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingPayment)
      ),
      endPaymentId: schemas_exports.property("end_payment_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GetTransfersListResponse.ts
var GetTransfersListResponse;
var init_GetTransfersListResponse = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GetTransfersListResponse.ts"() {
    "use strict";
    init_core();
    GetTransfersListResponse = schemas_exports.object({
      transfers: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.GroupBillingTransfer)
      ),
      endTransferId: schemas_exports.property("end_transfer_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutRequest.ts
var GroupBillingCheckoutRequest;
var init_GroupBillingCheckoutRequest = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutRequest.ts"() {
    "use strict";
    init_core();
    GroupBillingCheckoutRequest = schemas_exports.object({
      amount: schemas_exports.number().optional()
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutResponse.ts
var GroupBillingCheckoutResponse;
var init_GroupBillingCheckoutResponse = __esm({
  "src/serialization/resources/cloud/resources/groups/types/GroupBillingCheckoutResponse.ts"() {
    "use strict";
    init_core();
    GroupBillingCheckoutResponse = schemas_exports.object({
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/cloud/resources/groups/types/index.ts
var init_types25 = __esm({
  "src/serialization/resources/cloud/resources/groups/types/index.ts"() {
    "use strict";
    init_ValidateGroupRequest();
    init_ValidateGroupResponse();
    init_GetBillingResponse();
    init_GetInvoicesListResponse();
    init_GetPaymentsListResponse();
    init_GetTransfersListResponse();
    init_GroupBillingCheckoutRequest();
    init_GroupBillingCheckoutResponse();
  }
});

// src/serialization/resources/cloud/resources/groups/index.ts
var groups_exports2 = {};
__export(groups_exports2, {
  GetBillingResponse: () => GetBillingResponse,
  GetInvoicesListResponse: () => GetInvoicesListResponse,
  GetPaymentsListResponse: () => GetPaymentsListResponse,
  GetTransfersListResponse: () => GetTransfersListResponse,
  GroupBillingCheckoutRequest: () => GroupBillingCheckoutRequest,
  GroupBillingCheckoutResponse: () => GroupBillingCheckoutResponse,
  ValidateGroupRequest: () => ValidateGroupRequest,
  ValidateGroupResponse: () => ValidateGroupResponse
});
var init_groups = __esm({
  "src/serialization/resources/cloud/resources/groups/index.ts"() {
    "use strict";
    init_types25();
  }
});

// src/serialization/resources/cloud/resources/logs/types/GetRayPerfLogsResponse.ts
var GetRayPerfLogsResponse;
var init_GetRayPerfLogsResponse = __esm({
  "src/serialization/resources/cloud/resources/logs/types/GetRayPerfLogsResponse.ts"() {
    "use strict";
    init_core();
    GetRayPerfLogsResponse = schemas_exports.object({
      perfLists: schemas_exports.property(
        "perf_lists",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.SvcPerf)
        )
      )
    });
  }
});

// src/serialization/resources/cloud/resources/logs/types/index.ts
var init_types26 = __esm({
  "src/serialization/resources/cloud/resources/logs/types/index.ts"() {
    "use strict";
    init_GetRayPerfLogsResponse();
  }
});

// src/serialization/resources/cloud/resources/logs/index.ts
var logs_exports4 = {};
__export(logs_exports4, {
  GetRayPerfLogsResponse: () => GetRayPerfLogsResponse
});
var init_logs2 = __esm({
  "src/serialization/resources/cloud/resources/logs/index.ts"() {
    "use strict";
    init_types26();
  }
});

// src/serialization/resources/cloud/resources/tiers/types/GetRegionTiersResponse.ts
var GetRegionTiersResponse;
var init_GetRegionTiersResponse = __esm({
  "src/serialization/resources/cloud/resources/tiers/types/GetRegionTiersResponse.ts"() {
    "use strict";
    init_core();
    GetRegionTiersResponse = schemas_exports.object({
      tiers: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).cloud.RegionTier)
      )
    });
  }
});

// src/serialization/resources/cloud/resources/tiers/types/index.ts
var init_types27 = __esm({
  "src/serialization/resources/cloud/resources/tiers/types/index.ts"() {
    "use strict";
    init_GetRegionTiersResponse();
  }
});

// src/serialization/resources/cloud/resources/tiers/index.ts
var tiers_exports2 = {};
__export(tiers_exports2, {
  GetRegionTiersResponse: () => GetRegionTiersResponse
});
var init_tiers = __esm({
  "src/serialization/resources/cloud/resources/tiers/index.ts"() {
    "use strict";
    init_types27();
  }
});

// src/serialization/resources/cloud/resources/index.ts
var init_resources8 = __esm({
  "src/serialization/resources/cloud/resources/index.ts"() {
    "use strict";
    init_games2();
    init_version();
    init_auth2();
    init_types22();
    init_common3();
    init_types23();
    init_devices();
    init_groups();
    init_types25();
    init_logs2();
    init_types26();
    init_tiers();
    init_types27();
  }
});

// src/serialization/resources/cloud/index.ts
var cloud_exports2 = {};
__export(cloud_exports2, {
  AnalyticsVariantQuery: () => AnalyticsVariantQuery2,
  AuthAgent: () => AuthAgent,
  AuthAgentGameCloud: () => AuthAgentGameCloud,
  AuthAgentIdentity: () => AuthAgentIdentity,
  AvgPlayDurationByGameModeDataSet: () => AvgPlayDurationByGameModeDataSet,
  AvgPlayDurationByRegionDataSet: () => AvgPlayDurationByRegionDataSet,
  AvgPlayDurationDataSet: () => AvgPlayDurationDataSet,
  BuildSummary: () => BuildSummary,
  CdnAuthType: () => CdnAuthType2,
  CdnNamespaceAuthUser: () => CdnNamespaceAuthUser,
  CdnNamespaceConfig: () => CdnNamespaceConfig,
  CdnNamespaceDomain: () => CdnNamespaceDomain,
  CdnNamespaceDomainVerificationMethod: () => CdnNamespaceDomainVerificationMethod,
  CdnNamespaceDomainVerificationMethodHttp: () => CdnNamespaceDomainVerificationMethodHttp,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus2,
  CdnSiteSummary: () => CdnSiteSummary,
  CustomAvatarSummary: () => CustomAvatarSummary,
  DestroyedLobbiesByExitCodeDataSet: () => DestroyedLobbiesByExitCodeDataSet,
  DestroyedLobbiesByFailureDataSet: () => DestroyedLobbiesByFailureDataSet,
  FailedLobbiesDataSet: () => FailedLobbiesDataSet,
  GameFull: () => GameFull,
  GameLobbyExpenses: () => GameLobbyExpenses,
  GetBillingResponse: () => GetBillingResponse,
  GetInvoicesListResponse: () => GetInvoicesListResponse,
  GetPaymentsListResponse: () => GetPaymentsListResponse,
  GetRayPerfLogsResponse: () => GetRayPerfLogsResponse,
  GetRegionTiersResponse: () => GetRegionTiersResponse,
  GetTransfersListResponse: () => GetTransfersListResponse,
  GroupBankSource: () => GroupBankSource,
  GroupBillingCheckoutRequest: () => GroupBillingCheckoutRequest,
  GroupBillingCheckoutResponse: () => GroupBillingCheckoutResponse,
  GroupBillingInvoice: () => GroupBillingInvoice,
  GroupBillingPayment: () => GroupBillingPayment,
  GroupBillingStatus: () => GroupBillingStatus2,
  GroupBillingSummary: () => GroupBillingSummary,
  GroupBillingTransfer: () => GroupBillingTransfer,
  IdentityAccountsDataSet: () => IdentityAccountsDataSet,
  IdentityNamespaceConfig: () => IdentityNamespaceConfig,
  InspectResponse: () => InspectResponse,
  KvNamespaceConfig: () => KvNamespaceConfig,
  LobbyCountByGameModeDataSet: () => LobbyCountByGameModeDataSet,
  LobbyCountByRegionDataSet: () => LobbyCountByRegionDataSet,
  LobbyCountDataSet: () => LobbyCountDataSet,
  LobbyReadyTimeDataSet: () => LobbyReadyTimeDataSet,
  LobbySummaryAnalytics: () => LobbySummaryAnalytics,
  LogsLobbyStatus: () => LogsLobbyStatus,
  LogsLobbyStatusStopped: () => LogsLobbyStatusStopped,
  LogsLobbySummary: () => LogsLobbySummary,
  LogsPerfMark: () => LogsPerfMark,
  LogsPerfSpan: () => LogsPerfSpan,
  MatchmakerDevelopmentPort: () => MatchmakerDevelopmentPort,
  MatchmakerNamespaceConfig: () => MatchmakerNamespaceConfig,
  MatchmakerOverviewDataSet: () => MatchmakerOverviewDataSet,
  NamespaceAnalyticsDataSet: () => NamespaceAnalyticsDataSet,
  NamespaceConfig: () => NamespaceConfig,
  NamespaceFull: () => NamespaceFull,
  NamespaceSummary: () => NamespaceSummary,
  NamespaceVersion: () => NamespaceVersion,
  NewLobbiesPerSecondDataSet: () => NewLobbiesPerSecondDataSet,
  NewPlayersPerSecondDataSet: () => NewPlayersPerSecondDataSet,
  PlayerCountByGameModeDataSet: () => PlayerCountByGameModeDataSet,
  PlayerCountByRegionDataSet: () => PlayerCountByRegionDataSet,
  PlayerCountDataSet: () => PlayerCountDataSet,
  RegionSummary: () => RegionSummary,
  RegionTier: () => RegionTier,
  RegionTierExpenses: () => RegionTierExpenses,
  SvcMetrics: () => SvcMetrics,
  SvcPerf: () => SvcPerf,
  ValidateGroupRequest: () => ValidateGroupRequest,
  ValidateGroupResponse: () => ValidateGroupResponse,
  auth: () => auth_exports2,
  common: () => common_exports15,
  devices: () => devices_exports2,
  games: () => games_exports4,
  groups: () => groups_exports2,
  logs: () => logs_exports4,
  tiers: () => tiers_exports2,
  version: () => version_exports2
});
var init_cloud = __esm({
  "src/serialization/resources/cloud/index.ts"() {
    "use strict";
    init_resources8();
  }
});

// src/serialization/resources/group/types/ListSuggestedResponse.ts
var ListSuggestedResponse;
var init_ListSuggestedResponse = __esm({
  "src/serialization/resources/group/types/ListSuggestedResponse.ts"() {
    "use strict";
    init_core();
    ListSuggestedResponse = schemas_exports.object({
      groups: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Summary)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/CreateRequest.ts
var CreateRequest;
var init_CreateRequest = __esm({
  "src/serialization/resources/group/types/CreateRequest.ts"() {
    "use strict";
    init_core();
    CreateRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string())
    });
  }
});

// src/serialization/resources/group/types/CreateResponse.ts
var CreateResponse;
var init_CreateResponse = __esm({
  "src/serialization/resources/group/types/CreateResponse.ts"() {
    "use strict";
    init_core();
    CreateResponse = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/group/types/PrepareAvatarUploadRequest.ts
var PrepareAvatarUploadRequest;
var init_PrepareAvatarUploadRequest = __esm({
  "src/serialization/resources/group/types/PrepareAvatarUploadRequest.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadRequest = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string().optional(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/group/types/PrepareAvatarUploadResponse.ts
var PrepareAvatarUploadResponse;
var init_PrepareAvatarUploadResponse = __esm({
  "src/serialization/resources/group/types/PrepareAvatarUploadResponse.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadResponse = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/group/types/ValidateProfileRequest.ts
var ValidateProfileRequest;
var init_ValidateProfileRequest = __esm({
  "src/serialization/resources/group/types/ValidateProfileRequest.ts"() {
    "use strict";
    init_core();
    ValidateProfileRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string().optional()),
      bio: schemas_exports.string().optional(),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity).optional()
    });
  }
});

// src/serialization/resources/group/types/ValidateProfileResponse.ts
var ValidateProfileResponse;
var init_ValidateProfileResponse = __esm({
  "src/serialization/resources/group/types/ValidateProfileResponse.ts"() {
    "use strict";
    init_core();
    ValidateProfileResponse = schemas_exports.object({
      errors: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ValidationError)
      )
    });
  }
});

// src/serialization/resources/group/types/SearchResponse.ts
var SearchResponse;
var init_SearchResponse = __esm({
  "src/serialization/resources/group/types/SearchResponse.ts"() {
    "use strict";
    init_core();
    SearchResponse = schemas_exports.object({
      groups: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/group/types/GetBansResponse.ts
var GetBansResponse;
var init_GetBansResponse = __esm({
  "src/serialization/resources/group/types/GetBansResponse.ts"() {
    "use strict";
    init_core();
    GetBansResponse = schemas_exports.object({
      bannedIdentities: schemas_exports.property(
        "banned_identities",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.BannedIdentity)
        )
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/GetJoinRequestsResponse.ts
var GetJoinRequestsResponse;
var init_GetJoinRequestsResponse = __esm({
  "src/serialization/resources/group/types/GetJoinRequestsResponse.ts"() {
    "use strict";
    init_core();
    GetJoinRequestsResponse = schemas_exports.object({
      joinRequests: schemas_exports.property(
        "join_requests",
        schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.JoinRequest))
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/GetMembersResponse.ts
var GetMembersResponse;
var init_GetMembersResponse = __esm({
  "src/serialization/resources/group/types/GetMembersResponse.ts"() {
    "use strict";
    init_core();
    GetMembersResponse = schemas_exports.object({
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Member)
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/GetProfileResponse.ts
var GetProfileResponse;
var init_GetProfileResponse = __esm({
  "src/serialization/resources/group/types/GetProfileResponse.ts"() {
    "use strict";
    init_core();
    GetProfileResponse = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Profile),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/group/types/UpdateProfileRequest.ts
var UpdateProfileRequest;
var init_UpdateProfileRequest = __esm({
  "src/serialization/resources/group/types/UpdateProfileRequest.ts"() {
    "use strict";
    init_core();
    UpdateProfileRequest = schemas_exports.object({
      displayName: schemas_exports.property("display_name", schemas_exports.string().optional()),
      bio: schemas_exports.string().optional(),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity).optional()
    });
  }
});

// src/serialization/resources/group/types/GetSummaryResponse.ts
var GetSummaryResponse;
var init_GetSummaryResponse = __esm({
  "src/serialization/resources/group/types/GetSummaryResponse.ts"() {
    "use strict";
    init_core();
    GetSummaryResponse = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Summary)
    });
  }
});

// src/serialization/resources/group/types/TransferOwnershipRequest.ts
var TransferOwnershipRequest;
var init_TransferOwnershipRequest = __esm({
  "src/serialization/resources/group/types/TransferOwnershipRequest.ts"() {
    "use strict";
    init_core();
    TransferOwnershipRequest = schemas_exports.object({
      newOwnerIdentityId: schemas_exports.property("new_owner_identity_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/group/types/index.ts
var init_types28 = __esm({
  "src/serialization/resources/group/types/index.ts"() {
    "use strict";
    init_ListSuggestedResponse();
    init_CreateRequest();
    init_CreateResponse();
    init_PrepareAvatarUploadRequest();
    init_PrepareAvatarUploadResponse();
    init_ValidateProfileRequest();
    init_ValidateProfileResponse();
    init_SearchResponse();
    init_GetBansResponse();
    init_GetJoinRequestsResponse();
    init_GetMembersResponse();
    init_GetProfileResponse();
    init_UpdateProfileRequest();
    init_GetSummaryResponse();
    init_TransferOwnershipRequest();
  }
});

// src/serialization/resources/group/resources/common/types/Summary.ts
var Summary2;
var init_Summary2 = __esm({
  "src/serialization/resources/group/resources/common/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary2 = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string().optional()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.ExternalLinks),
      isDeveloper: schemas_exports.property("is_developer", schemas_exports.boolean()),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio),
      isCurrentIdentityMember: schemas_exports.property(
        "is_current_identity_member",
        schemas_exports.boolean()
      ),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity),
      memberCount: schemas_exports.property("member_count", schemas_exports.number()),
      ownerIdentityId: schemas_exports.property("owner_identity_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/group/resources/common/types/Publicity.ts
var Publicity2;
var init_Publicity = __esm({
  "src/serialization/resources/group/resources/common/types/Publicity.ts"() {
    "use strict";
    init_core();
    Publicity2 = schemas_exports.enum_(["open", "closed"]);
  }
});

// src/serialization/resources/group/resources/common/types/Handle.ts
var Handle;
var init_Handle = __esm({
  "src/serialization/resources/group/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string().optional()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.ExternalLinks),
      isDeveloper: schemas_exports.property("is_developer", schemas_exports.boolean().optional())
    });
  }
});

// src/serialization/resources/group/resources/common/types/ExternalLinks.ts
var ExternalLinks;
var init_ExternalLinks = __esm({
  "src/serialization/resources/group/resources/common/types/ExternalLinks.ts"() {
    "use strict";
    init_core();
    ExternalLinks = schemas_exports.object({
      profile: schemas_exports.string(),
      chat: schemas_exports.string()
    });
  }
});

// src/serialization/resources/group/resources/common/types/JoinRequest.ts
var JoinRequest;
var init_JoinRequest = __esm({
  "src/serialization/resources/group/resources/common/types/JoinRequest.ts"() {
    "use strict";
    init_core();
    JoinRequest = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      ts: schemas_exports.date()
    });
  }
});

// src/serialization/resources/group/resources/common/types/Member.ts
var Member;
var init_Member = __esm({
  "src/serialization/resources/group/resources/common/types/Member.ts"() {
    "use strict";
    init_core();
    Member = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
    });
  }
});

// src/serialization/resources/group/resources/common/types/Profile.ts
var Profile;
var init_Profile = __esm({
  "src/serialization/resources/group/resources/common/types/Profile.ts"() {
    "use strict";
    init_core();
    Profile = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string()),
      displayName: schemas_exports.property("display_name", schemas_exports.string()),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string().optional()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.ExternalLinks),
      isDeveloper: schemas_exports.property("is_developer", schemas_exports.boolean().optional()),
      bio: schemas_exports.string(),
      isCurrentIdentityMember: schemas_exports.property(
        "is_current_identity_member",
        schemas_exports.boolean().optional()
      ),
      publicity: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Publicity),
      memberCount: schemas_exports.property("member_count", schemas_exports.number().optional()),
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Member)
      ),
      joinRequests: schemas_exports.property(
        "join_requests",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.JoinRequest)
        )
      ),
      isCurrentIdentityRequestingJoin: schemas_exports.property(
        "is_current_identity_requesting_join",
        schemas_exports.boolean().optional()
      ),
      ownerIdentityId: schemas_exports.property("owner_identity_id", schemas_exports.string()),
      threadId: schemas_exports.property("thread_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/group/resources/common/types/BannedIdentity.ts
var BannedIdentity;
var init_BannedIdentity = __esm({
  "src/serialization/resources/group/resources/common/types/BannedIdentity.ts"() {
    "use strict";
    init_core();
    BannedIdentity = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      banTs: schemas_exports.property("ban_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/group/resources/common/types/index.ts
var init_types29 = __esm({
  "src/serialization/resources/group/resources/common/types/index.ts"() {
    "use strict";
    init_Summary2();
    init_Publicity();
    init_Handle();
    init_ExternalLinks();
    init_JoinRequest();
    init_Member();
    init_Profile();
    init_BannedIdentity();
  }
});

// src/serialization/resources/group/resources/common/index.ts
var common_exports16 = {};
__export(common_exports16, {
  BannedIdentity: () => BannedIdentity,
  ExternalLinks: () => ExternalLinks,
  Handle: () => Handle,
  JoinRequest: () => JoinRequest,
  Member: () => Member,
  Profile: () => Profile,
  Publicity: () => Publicity2,
  Summary: () => Summary2
});
var init_common4 = __esm({
  "src/serialization/resources/group/resources/common/index.ts"() {
    "use strict";
    init_types29();
  }
});

// src/serialization/resources/group/resources/invites/types/GetInviteResponse.ts
var GetInviteResponse;
var init_GetInviteResponse = __esm({
  "src/serialization/resources/group/resources/invites/types/GetInviteResponse.ts"() {
    "use strict";
    init_core();
    GetInviteResponse = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
    });
  }
});

// src/serialization/resources/group/resources/invites/types/ConsumeInviteResponse.ts
var ConsumeInviteResponse;
var init_ConsumeInviteResponse = __esm({
  "src/serialization/resources/group/resources/invites/types/ConsumeInviteResponse.ts"() {
    "use strict";
    init_core();
    ConsumeInviteResponse = schemas_exports.object({
      groupId: schemas_exports.property("group_id", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/group/resources/invites/types/CreateInviteRequest.ts
var CreateInviteRequest;
var init_CreateInviteRequest = __esm({
  "src/serialization/resources/group/resources/invites/types/CreateInviteRequest.ts"() {
    "use strict";
    init_core();
    CreateInviteRequest = schemas_exports.object({
      ttl: schemas_exports.number().optional(),
      useCount: schemas_exports.property("use_count", schemas_exports.number().optional())
    });
  }
});

// src/serialization/resources/group/resources/invites/types/CreateInviteResponse.ts
var CreateInviteResponse;
var init_CreateInviteResponse = __esm({
  "src/serialization/resources/group/resources/invites/types/CreateInviteResponse.ts"() {
    "use strict";
    init_core();
    CreateInviteResponse = schemas_exports.object({
      code: schemas_exports.string()
    });
  }
});

// src/serialization/resources/group/resources/invites/types/index.ts
var init_types30 = __esm({
  "src/serialization/resources/group/resources/invites/types/index.ts"() {
    "use strict";
    init_GetInviteResponse();
    init_ConsumeInviteResponse();
    init_CreateInviteRequest();
    init_CreateInviteResponse();
  }
});

// src/serialization/resources/group/resources/invites/index.ts
var invites_exports2 = {};
__export(invites_exports2, {
  ConsumeInviteResponse: () => ConsumeInviteResponse,
  CreateInviteRequest: () => CreateInviteRequest,
  CreateInviteResponse: () => CreateInviteResponse,
  GetInviteResponse: () => GetInviteResponse
});
var init_invites = __esm({
  "src/serialization/resources/group/resources/invites/index.ts"() {
    "use strict";
    init_types30();
  }
});

// src/serialization/resources/group/resources/joinRequests/types/ResolveJoinRequestRequest.ts
var ResolveJoinRequestRequest;
var init_ResolveJoinRequestRequest = __esm({
  "src/serialization/resources/group/resources/joinRequests/types/ResolveJoinRequestRequest.ts"() {
    "use strict";
    init_core();
    ResolveJoinRequestRequest = schemas_exports.object({
      resolution: schemas_exports.boolean().optional()
    });
  }
});

// src/serialization/resources/group/resources/joinRequests/types/index.ts
var init_types31 = __esm({
  "src/serialization/resources/group/resources/joinRequests/types/index.ts"() {
    "use strict";
    init_ResolveJoinRequestRequest();
  }
});

// src/serialization/resources/group/resources/joinRequests/index.ts
var joinRequests_exports2 = {};
__export(joinRequests_exports2, {
  ResolveJoinRequestRequest: () => ResolveJoinRequestRequest
});
var init_joinRequests = __esm({
  "src/serialization/resources/group/resources/joinRequests/index.ts"() {
    "use strict";
    init_types31();
  }
});

// src/serialization/resources/group/resources/index.ts
var init_resources9 = __esm({
  "src/serialization/resources/group/resources/index.ts"() {
    "use strict";
    init_common4();
    init_types29();
    init_invites();
    init_types30();
    init_joinRequests();
    init_types31();
  }
});

// src/serialization/resources/group/index.ts
var group_exports2 = {};
__export(group_exports2, {
  BannedIdentity: () => BannedIdentity,
  ConsumeInviteResponse: () => ConsumeInviteResponse,
  CreateInviteRequest: () => CreateInviteRequest,
  CreateInviteResponse: () => CreateInviteResponse,
  CreateRequest: () => CreateRequest,
  CreateResponse: () => CreateResponse,
  ExternalLinks: () => ExternalLinks,
  GetBansResponse: () => GetBansResponse,
  GetInviteResponse: () => GetInviteResponse,
  GetJoinRequestsResponse: () => GetJoinRequestsResponse,
  GetMembersResponse: () => GetMembersResponse,
  GetProfileResponse: () => GetProfileResponse,
  GetSummaryResponse: () => GetSummaryResponse,
  Handle: () => Handle,
  JoinRequest: () => JoinRequest,
  ListSuggestedResponse: () => ListSuggestedResponse,
  Member: () => Member,
  PrepareAvatarUploadRequest: () => PrepareAvatarUploadRequest,
  PrepareAvatarUploadResponse: () => PrepareAvatarUploadResponse,
  Profile: () => Profile,
  Publicity: () => Publicity2,
  ResolveJoinRequestRequest: () => ResolveJoinRequestRequest,
  SearchResponse: () => SearchResponse,
  Summary: () => Summary2,
  TransferOwnershipRequest: () => TransferOwnershipRequest,
  UpdateProfileRequest: () => UpdateProfileRequest,
  ValidateProfileRequest: () => ValidateProfileRequest,
  ValidateProfileResponse: () => ValidateProfileResponse,
  common: () => common_exports16,
  invites: () => invites_exports2,
  joinRequests: () => joinRequests_exports2
});
var init_group = __esm({
  "src/serialization/resources/group/index.ts"() {
    "use strict";
    init_types28();
    init_resources9();
  }
});

// src/serialization/resources/identity/types/SetupResponse.ts
var SetupResponse;
var init_SetupResponse = __esm({
  "src/serialization/resources/identity/types/SetupResponse.ts"() {
    "use strict";
    init_core();
    SetupResponse = schemas_exports.object({
      identityToken: schemas_exports.property(
        "identity_token",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
      ),
      identityTokenExpireTs: schemas_exports.property("identity_token_expire_ts", schemas_exports.date()),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile),
      gameId: schemas_exports.property("game_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/identity/types/GetProfileResponse.ts
var GetProfileResponse2;
var init_GetProfileResponse2 = __esm({
  "src/serialization/resources/identity/types/GetProfileResponse.ts"() {
    "use strict";
    init_core();
    GetProfileResponse2 = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/GetHandlesResponse.ts
var GetHandlesResponse;
var init_GetHandlesResponse = __esm({
  "src/serialization/resources/identity/types/GetHandlesResponse.ts"() {
    "use strict";
    init_core();
    GetHandlesResponse = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/GetSummariesResponse.ts
var GetSummariesResponse;
var init_GetSummariesResponse = __esm({
  "src/serialization/resources/identity/types/GetSummariesResponse.ts"() {
    "use strict";
    init_core();
    GetSummariesResponse = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Summary)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/SearchResponse.ts
var SearchResponse2;
var init_SearchResponse2 = __esm({
  "src/serialization/resources/identity/types/SearchResponse.ts"() {
    "use strict";
    init_core();
    SearchResponse2 = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/identity/types/PrepareAvatarUploadResponse.ts
var PrepareAvatarUploadResponse2;
var init_PrepareAvatarUploadResponse2 = __esm({
  "src/serialization/resources/identity/types/PrepareAvatarUploadResponse.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadResponse2 = schemas_exports.object({
      uploadId: schemas_exports.property("upload_id", schemas_exports.string()),
      presignedRequest: schemas_exports.property(
        "presigned_request",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).upload.PresignedRequest)
      )
    });
  }
});

// src/serialization/resources/identity/types/ListFollowersResponse.ts
var ListFollowersResponse;
var init_ListFollowersResponse = __esm({
  "src/serialization/resources/identity/types/ListFollowersResponse.ts"() {
    "use strict";
    init_core();
    ListFollowersResponse = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/ListFollowingResponse.ts
var ListFollowingResponse;
var init_ListFollowingResponse = __esm({
  "src/serialization/resources/identity/types/ListFollowingResponse.ts"() {
    "use strict";
    init_core();
    ListFollowingResponse = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/ListRecentFollowersResponse.ts
var ListRecentFollowersResponse;
var init_ListRecentFollowersResponse = __esm({
  "src/serialization/resources/identity/types/ListRecentFollowersResponse.ts"() {
    "use strict";
    init_core();
    ListRecentFollowersResponse = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/ListFriendsResponse.ts
var ListFriendsResponse;
var init_ListFriendsResponse = __esm({
  "src/serialization/resources/identity/types/ListFriendsResponse.ts"() {
    "use strict";
    init_core();
    ListFriendsResponse = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/types/ListMutualFriendsResponse.ts
var ListMutualFriendsResponse;
var init_ListMutualFriendsResponse = __esm({
  "src/serialization/resources/identity/types/ListMutualFriendsResponse.ts"() {
    "use strict";
    init_core();
    ListMutualFriendsResponse = schemas_exports.object({
      identities: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      anchor: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/identity/types/index.ts
var init_types32 = __esm({
  "src/serialization/resources/identity/types/index.ts"() {
    "use strict";
    init_SetupResponse();
    init_GetProfileResponse2();
    init_GetHandlesResponse();
    init_GetSummariesResponse();
    init_SearchResponse2();
    init_PrepareAvatarUploadResponse2();
    init_ListFollowersResponse();
    init_ListFollowingResponse();
    init_ListRecentFollowersResponse();
    init_ListFriendsResponse();
    init_ListMutualFriendsResponse();
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEvent.ts
var GlobalEvent;
var init_GlobalEvent = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEvent.ts"() {
    "use strict";
    init_core();
    GlobalEvent = schemas_exports.object({
      ts: schemas_exports.date(),
      kind: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventKind),
      notification: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventNotification).optional()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventKind.ts
var GlobalEventKind;
var init_GlobalEventKind = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventKind.ts"() {
    "use strict";
    init_core();
    GlobalEventKind = schemas_exports.object({
      chatMessage: schemas_exports.property(
        "chat_message",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventChatMessage).optional()
      ),
      chatRead: schemas_exports.property(
        "chat_read",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventChatRead).optional()
      ),
      partyUpdate: schemas_exports.property(
        "party_update",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventPartyUpdate).optional()
      ),
      identityUpdate: schemas_exports.property(
        "identity_update",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventIdentityUpdate).optional()
      ),
      matchmakerLobbyJoin: schemas_exports.property(
        "matchmaker_lobby_join",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventMatchmakerLobbyJoin).optional()
      ),
      chatThreadRemove: schemas_exports.property(
        "chat_thread_remove",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEventChatThreadRemove).optional()
      )
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventNotification.ts
var GlobalEventNotification;
var init_GlobalEventNotification = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventNotification.ts"() {
    "use strict";
    init_core();
    GlobalEventNotification = schemas_exports.object({
      title: schemas_exports.string(),
      description: schemas_exports.string(),
      thumbnailUrl: schemas_exports.property("thumbnail_url", schemas_exports.string()),
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventChatMessage.ts
var GlobalEventChatMessage;
var init_GlobalEventChatMessage = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventChatMessage.ts"() {
    "use strict";
    init_core();
    GlobalEventChatMessage = schemas_exports.object({
      thread: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).chat.Thread)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventChatRead.ts
var GlobalEventChatRead;
var init_GlobalEventChatRead = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventChatRead.ts"() {
    "use strict";
    init_core();
    GlobalEventChatRead = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      readTs: schemas_exports.property("read_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventPartyUpdate.ts
var GlobalEventPartyUpdate;
var init_GlobalEventPartyUpdate = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventPartyUpdate.ts"() {
    "use strict";
    init_core();
    GlobalEventPartyUpdate = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary).optional()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventIdentityUpdate.ts
var GlobalEventIdentityUpdate;
var init_GlobalEventIdentityUpdate = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventIdentityUpdate.ts"() {
    "use strict";
    init_core();
    GlobalEventIdentityUpdate = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventMatchmakerLobbyJoin.ts
var GlobalEventMatchmakerLobbyJoin;
var init_GlobalEventMatchmakerLobbyJoin = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventMatchmakerLobbyJoin.ts"() {
    "use strict";
    init_core();
    GlobalEventMatchmakerLobbyJoin = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinLobby),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort)
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GlobalEventChatThreadRemove.ts
var GlobalEventChatThreadRemove;
var init_GlobalEventChatThreadRemove = __esm({
  "src/serialization/resources/identity/resources/common/types/GlobalEventChatThreadRemove.ts"() {
    "use strict";
    init_core();
    GlobalEventChatThreadRemove = schemas_exports.object({
      threadId: schemas_exports.property("thread_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/UpdateGameActivity.ts
var UpdateGameActivity;
var init_UpdateGameActivity = __esm({
  "src/serialization/resources/identity/resources/common/types/UpdateGameActivity.ts"() {
    "use strict";
    init_core();
    UpdateGameActivity = schemas_exports.object({
      message: schemas_exports.string().optional(),
      publicMetadata: schemas_exports.property("public_metadata", schemas_exports.unknown()),
      mutualMetadata: schemas_exports.property("mutual_metadata", schemas_exports.unknown())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Handle.ts
var Handle2;
var init_Handle2 = __esm({
  "src/serialization/resources/identity/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle2 = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string()),
      presence: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Presence).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Handle).optional(),
      isRegistered: schemas_exports.property("is_registered", schemas_exports.boolean()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.ExternalLinks)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Summary.ts
var Summary3;
var init_Summary3 = __esm({
  "src/serialization/resources/identity/resources/common/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary3 = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string()),
      presence: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Presence).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Handle).optional(),
      isRegistered: schemas_exports.property("is_registered", schemas_exports.boolean()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.ExternalLinks),
      following: schemas_exports.boolean(),
      isFollowingMe: schemas_exports.property("is_following_me", schemas_exports.boolean()),
      isMutualFollowing: schemas_exports.property("is_mutual_following", schemas_exports.boolean())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Profile.ts
var Profile2;
var init_Profile2 = __esm({
  "src/serialization/resources/identity/resources/common/types/Profile.ts"() {
    "use strict";
    init_core();
    Profile2 = schemas_exports.object({
      identityId: schemas_exports.property("identity_id", schemas_exports.string()),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber)
      ),
      avatarUrl: schemas_exports.property("avatar_url", schemas_exports.string()),
      presence: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Presence).optional(),
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary).optional(),
      isRegistered: schemas_exports.property("is_registered", schemas_exports.boolean()),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.ExternalLinks),
      isAdmin: schemas_exports.property("is_admin", schemas_exports.boolean()),
      isGameLinked: schemas_exports.property("is_game_linked", schemas_exports.boolean().optional()),
      devState: schemas_exports.property(
        "dev_state",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.DevState).optional()
      ),
      followerCount: schemas_exports.property("follower_count", schemas_exports.number()),
      followingCount: schemas_exports.property("following_count", schemas_exports.number()),
      following: schemas_exports.boolean(),
      isFollowingMe: schemas_exports.property("is_following_me", schemas_exports.boolean()),
      isMutualFollowing: schemas_exports.property("is_mutual_following", schemas_exports.boolean()),
      joinTs: schemas_exports.property("join_ts", schemas_exports.date()),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio),
      linkedAccounts: schemas_exports.property(
        "linked_accounts",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.LinkedAccount)
        )
      ),
      groups: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Group)
      ),
      games: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatSummary)
      ),
      awaitingDeletion: schemas_exports.property("awaiting_deletion", schemas_exports.boolean().optional())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/ExternalLinks.ts
var ExternalLinks2;
var init_ExternalLinks2 = __esm({
  "src/serialization/resources/identity/resources/common/types/ExternalLinks.ts"() {
    "use strict";
    init_core();
    ExternalLinks2 = schemas_exports.object({
      profile: schemas_exports.string(),
      settings: schemas_exports.string().optional(),
      chat: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Presence.ts
var Presence;
var init_Presence = __esm({
  "src/serialization/resources/identity/resources/common/types/Presence.ts"() {
    "use strict";
    init_core();
    Presence = schemas_exports.object({
      updateTs: schemas_exports.property("update_ts", schemas_exports.date()),
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Status),
      gameActivity: schemas_exports.property(
        "game_activity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GameActivity).optional()
      )
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Status.ts
var Status2;
var init_Status = __esm({
  "src/serialization/resources/identity/resources/common/types/Status.ts"() {
    "use strict";
    init_core();
    Status2 = schemas_exports.enum_(["online", "away", "offline"]);
  }
});

// src/serialization/resources/identity/resources/common/types/GameActivity.ts
var GameActivity;
var init_GameActivity = __esm({
  "src/serialization/resources/identity/resources/common/types/GameActivity.ts"() {
    "use strict";
    init_core();
    GameActivity = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      message: schemas_exports.string(),
      publicMetadata: schemas_exports.property("public_metadata", schemas_exports.unknown()),
      mutualMetadata: schemas_exports.property("mutual_metadata", schemas_exports.unknown())
    });
  }
});

// src/serialization/resources/identity/resources/common/types/Group.ts
var Group;
var init_Group = __esm({
  "src/serialization/resources/identity/resources/common/types/Group.ts"() {
    "use strict";
    init_core();
    Group = schemas_exports.object({
      group: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).group.Handle)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/DevState.ts
var DevState2;
var init_DevState = __esm({
  "src/serialization/resources/identity/resources/common/types/DevState.ts"() {
    "use strict";
    init_core();
    DevState2 = schemas_exports.enum_(["inactive", "pending", "accepted"]);
  }
});

// src/serialization/resources/identity/resources/common/types/LinkedAccount.ts
var LinkedAccount;
var init_LinkedAccount = __esm({
  "src/serialization/resources/identity/resources/common/types/LinkedAccount.ts"() {
    "use strict";
    init_core();
    LinkedAccount = schemas_exports.object({
      email: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.EmailLinkedAccount).optional()
    });
  }
});

// src/serialization/resources/identity/resources/common/types/EmailLinkedAccount.ts
var EmailLinkedAccount;
var init_EmailLinkedAccount = __esm({
  "src/serialization/resources/identity/resources/common/types/EmailLinkedAccount.ts"() {
    "use strict";
    init_core();
    EmailLinkedAccount = schemas_exports.object({
      email: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Email)
    });
  }
});

// src/serialization/resources/identity/resources/common/types/GameLinkStatus.ts
var GameLinkStatus2;
var init_GameLinkStatus = __esm({
  "src/serialization/resources/identity/resources/common/types/GameLinkStatus.ts"() {
    "use strict";
    init_core();
    GameLinkStatus2 = schemas_exports.enum_(["incomplete", "complete", "cancelled"]);
  }
});

// src/serialization/resources/identity/resources/common/types/index.ts
var init_types33 = __esm({
  "src/serialization/resources/identity/resources/common/types/index.ts"() {
    "use strict";
    init_GlobalEvent();
    init_GlobalEventKind();
    init_GlobalEventNotification();
    init_GlobalEventChatMessage();
    init_GlobalEventChatRead();
    init_GlobalEventPartyUpdate();
    init_GlobalEventIdentityUpdate();
    init_GlobalEventMatchmakerLobbyJoin();
    init_GlobalEventChatThreadRemove();
    init_UpdateGameActivity();
    init_Handle2();
    init_Summary3();
    init_Profile2();
    init_ExternalLinks2();
    init_Presence();
    init_Status();
    init_GameActivity();
    init_Group();
    init_DevState();
    init_LinkedAccount();
    init_EmailLinkedAccount();
    init_GameLinkStatus();
  }
});

// src/serialization/resources/identity/resources/common/index.ts
var common_exports17 = {};
__export(common_exports17, {
  DevState: () => DevState2,
  EmailLinkedAccount: () => EmailLinkedAccount,
  ExternalLinks: () => ExternalLinks2,
  GameActivity: () => GameActivity,
  GameLinkStatus: () => GameLinkStatus2,
  GlobalEvent: () => GlobalEvent,
  GlobalEventChatMessage: () => GlobalEventChatMessage,
  GlobalEventChatRead: () => GlobalEventChatRead,
  GlobalEventChatThreadRemove: () => GlobalEventChatThreadRemove,
  GlobalEventIdentityUpdate: () => GlobalEventIdentityUpdate,
  GlobalEventKind: () => GlobalEventKind,
  GlobalEventMatchmakerLobbyJoin: () => GlobalEventMatchmakerLobbyJoin,
  GlobalEventNotification: () => GlobalEventNotification,
  GlobalEventPartyUpdate: () => GlobalEventPartyUpdate,
  Group: () => Group,
  Handle: () => Handle2,
  LinkedAccount: () => LinkedAccount,
  Presence: () => Presence,
  Profile: () => Profile2,
  Status: () => Status2,
  Summary: () => Summary3,
  UpdateGameActivity: () => UpdateGameActivity
});
var init_common5 = __esm({
  "src/serialization/resources/identity/resources/common/index.ts"() {
    "use strict";
    init_types33();
  }
});

// src/serialization/resources/identity/resources/events/types/WatchEventsResponse.ts
var WatchEventsResponse;
var init_WatchEventsResponse = __esm({
  "src/serialization/resources/identity/resources/events/types/WatchEventsResponse.ts"() {
    "use strict";
    init_core();
    WatchEventsResponse = schemas_exports.object({
      events: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GlobalEvent)
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/resources/events/types/index.ts
var init_types34 = __esm({
  "src/serialization/resources/identity/resources/events/types/index.ts"() {
    "use strict";
    init_WatchEventsResponse();
  }
});

// src/serialization/resources/identity/resources/events/index.ts
var events_exports2 = {};
__export(events_exports2, {
  WatchEventsResponse: () => WatchEventsResponse
});
var init_events = __esm({
  "src/serialization/resources/identity/resources/events/index.ts"() {
    "use strict";
    init_types34();
  }
});

// src/serialization/resources/identity/resources/links/types/PrepareGameLinkResponse.ts
var PrepareGameLinkResponse;
var init_PrepareGameLinkResponse = __esm({
  "src/serialization/resources/identity/resources/links/types/PrepareGameLinkResponse.ts"() {
    "use strict";
    init_core();
    PrepareGameLinkResponse = schemas_exports.object({
      identityLinkToken: schemas_exports.property("identity_link_token", schemas_exports.string()),
      identityLinkUrl: schemas_exports.property("identity_link_url", schemas_exports.string()),
      expireTs: schemas_exports.property("expire_ts", schemas_exports.date())
    });
  }
});

// src/serialization/resources/identity/resources/links/types/GetGameLinkResponse.ts
var GetGameLinkResponse;
var init_GetGameLinkResponse = __esm({
  "src/serialization/resources/identity/resources/links/types/GetGameLinkResponse.ts"() {
    "use strict";
    init_core();
    GetGameLinkResponse = schemas_exports.object({
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GameLinkStatus),
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      currentIdentity: schemas_exports.property(
        "current_identity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle)
      ),
      newIdentity: schemas_exports.property(
        "new_identity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.GetGameLinkNewIdentity).optional()
      ),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/identity/resources/links/types/GetGameLinkNewIdentity.ts
var GetGameLinkNewIdentity;
var init_GetGameLinkNewIdentity = __esm({
  "src/serialization/resources/identity/resources/links/types/GetGameLinkNewIdentity.ts"() {
    "use strict";
    init_core();
    GetGameLinkNewIdentity = schemas_exports.object({
      identityToken: schemas_exports.property(
        "identity_token",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
      ),
      identityTokenExpireTs: schemas_exports.property("identity_token_expire_ts", schemas_exports.date()),
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Profile)
    });
  }
});

// src/serialization/resources/identity/resources/links/types/index.ts
var init_types35 = __esm({
  "src/serialization/resources/identity/resources/links/types/index.ts"() {
    "use strict";
    init_PrepareGameLinkResponse();
    init_GetGameLinkResponse();
    init_GetGameLinkNewIdentity();
  }
});

// src/serialization/resources/identity/resources/links/index.ts
var links_exports4 = {};
__export(links_exports4, {
  GetGameLinkNewIdentity: () => GetGameLinkNewIdentity,
  GetGameLinkResponse: () => GetGameLinkResponse,
  PrepareGameLinkResponse: () => PrepareGameLinkResponse
});
var init_links2 = __esm({
  "src/serialization/resources/identity/resources/links/index.ts"() {
    "use strict";
    init_types35();
  }
});

// src/serialization/resources/identity/resources/index.ts
var init_resources10 = __esm({
  "src/serialization/resources/identity/resources/index.ts"() {
    "use strict";
    init_common5();
    init_types33();
    init_events();
    init_types34();
    init_links2();
    init_types35();
  }
});

// src/serialization/resources/identity/client/requests/SetupRequest.ts
var SetupRequest;
var init_SetupRequest = __esm({
  "src/serialization/resources/identity/client/requests/SetupRequest.ts"() {
    "use strict";
    init_core();
    SetupRequest = schemas_exports.object({
      existingIdentityToken: schemas_exports.property(
        "existing_identity_token",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt).optional()
      )
    });
  }
});

// src/serialization/resources/identity/client/requests/UpdateProfileRequest.ts
var UpdateProfileRequest2;
var init_UpdateProfileRequest2 = __esm({
  "src/serialization/resources/identity/client/requests/UpdateProfileRequest.ts"() {
    "use strict";
    init_core();
    UpdateProfileRequest2 = schemas_exports.object({
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName).optional()
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber).optional()
      ),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio).optional()
    });
  }
});

// src/serialization/resources/identity/client/requests/ValidateProfileRequest.ts
var ValidateProfileRequest2;
var init_ValidateProfileRequest2 = __esm({
  "src/serialization/resources/identity/client/requests/ValidateProfileRequest.ts"() {
    "use strict";
    init_core();
    ValidateProfileRequest2 = schemas_exports.object({
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName).optional()
      ),
      accountNumber: schemas_exports.property(
        "account_number",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).AccountNumber).optional()
      ),
      bio: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Bio).optional()
    });
  }
});

// src/serialization/resources/identity/client/requests/SetGameActivityRequest.ts
var SetGameActivityRequest;
var init_SetGameActivityRequest = __esm({
  "src/serialization/resources/identity/client/requests/SetGameActivityRequest.ts"() {
    "use strict";
    init_core();
    SetGameActivityRequest = schemas_exports.object({
      gameActivity: schemas_exports.property(
        "game_activity",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.UpdateGameActivity)
      )
    });
  }
});

// src/serialization/resources/identity/client/requests/UpdateStatusRequest.ts
var UpdateStatusRequest;
var init_UpdateStatusRequest = __esm({
  "src/serialization/resources/identity/client/requests/UpdateStatusRequest.ts"() {
    "use strict";
    init_core();
    UpdateStatusRequest = schemas_exports.object({
      status: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Status)
    });
  }
});

// src/serialization/resources/identity/client/requests/PrepareAvatarUploadRequest.ts
var PrepareAvatarUploadRequest2;
var init_PrepareAvatarUploadRequest2 = __esm({
  "src/serialization/resources/identity/client/requests/PrepareAvatarUploadRequest.ts"() {
    "use strict";
    init_core();
    PrepareAvatarUploadRequest2 = schemas_exports.object({
      path: schemas_exports.string(),
      mime: schemas_exports.string(),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/identity/client/requests/SignupForBetaRequest.ts
var SignupForBetaRequest;
var init_SignupForBetaRequest = __esm({
  "src/serialization/resources/identity/client/requests/SignupForBetaRequest.ts"() {
    "use strict";
    init_core();
    SignupForBetaRequest = schemas_exports.object({
      name: schemas_exports.string(),
      companyName: schemas_exports.property("company_name", schemas_exports.string().optional()),
      companySize: schemas_exports.property("company_size", schemas_exports.string()),
      preferredTools: schemas_exports.property("preferred_tools", schemas_exports.string()),
      goals: schemas_exports.string()
    });
  }
});

// src/serialization/resources/identity/client/requests/ReportRequest.ts
var ReportRequest;
var init_ReportRequest = __esm({
  "src/serialization/resources/identity/client/requests/ReportRequest.ts"() {
    "use strict";
    init_core();
    ReportRequest = schemas_exports.object({
      reason: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/identity/client/requests/index.ts
var init_requests = __esm({
  "src/serialization/resources/identity/client/requests/index.ts"() {
    "use strict";
    init_SetupRequest();
    init_UpdateProfileRequest2();
    init_ValidateProfileRequest2();
    init_SetGameActivityRequest();
    init_UpdateStatusRequest();
    init_PrepareAvatarUploadRequest2();
    init_SignupForBetaRequest();
    init_ReportRequest();
  }
});

// src/serialization/resources/identity/client/index.ts
var init_client = __esm({
  "src/serialization/resources/identity/client/index.ts"() {
    "use strict";
    init_requests();
  }
});

// src/serialization/resources/identity/index.ts
var identity_exports6 = {};
__export(identity_exports6, {
  DevState: () => DevState2,
  EmailLinkedAccount: () => EmailLinkedAccount,
  ExternalLinks: () => ExternalLinks2,
  GameActivity: () => GameActivity,
  GameLinkStatus: () => GameLinkStatus2,
  GetGameLinkNewIdentity: () => GetGameLinkNewIdentity,
  GetGameLinkResponse: () => GetGameLinkResponse,
  GetHandlesResponse: () => GetHandlesResponse,
  GetProfileResponse: () => GetProfileResponse2,
  GetSummariesResponse: () => GetSummariesResponse,
  GlobalEvent: () => GlobalEvent,
  GlobalEventChatMessage: () => GlobalEventChatMessage,
  GlobalEventChatRead: () => GlobalEventChatRead,
  GlobalEventChatThreadRemove: () => GlobalEventChatThreadRemove,
  GlobalEventIdentityUpdate: () => GlobalEventIdentityUpdate,
  GlobalEventKind: () => GlobalEventKind,
  GlobalEventMatchmakerLobbyJoin: () => GlobalEventMatchmakerLobbyJoin,
  GlobalEventNotification: () => GlobalEventNotification,
  GlobalEventPartyUpdate: () => GlobalEventPartyUpdate,
  Group: () => Group,
  Handle: () => Handle2,
  LinkedAccount: () => LinkedAccount,
  ListFollowersResponse: () => ListFollowersResponse,
  ListFollowingResponse: () => ListFollowingResponse,
  ListFriendsResponse: () => ListFriendsResponse,
  ListMutualFriendsResponse: () => ListMutualFriendsResponse,
  ListRecentFollowersResponse: () => ListRecentFollowersResponse,
  PrepareAvatarUploadRequest: () => PrepareAvatarUploadRequest2,
  PrepareAvatarUploadResponse: () => PrepareAvatarUploadResponse2,
  PrepareGameLinkResponse: () => PrepareGameLinkResponse,
  Presence: () => Presence,
  Profile: () => Profile2,
  ReportRequest: () => ReportRequest,
  SearchResponse: () => SearchResponse2,
  SetGameActivityRequest: () => SetGameActivityRequest,
  SetupRequest: () => SetupRequest,
  SetupResponse: () => SetupResponse,
  SignupForBetaRequest: () => SignupForBetaRequest,
  Status: () => Status2,
  Summary: () => Summary3,
  UpdateGameActivity: () => UpdateGameActivity,
  UpdateProfileRequest: () => UpdateProfileRequest2,
  UpdateStatusRequest: () => UpdateStatusRequest,
  ValidateProfileRequest: () => ValidateProfileRequest2,
  WatchEventsResponse: () => WatchEventsResponse,
  common: () => common_exports17,
  events: () => events_exports2,
  links: () => links_exports4
});
var init_identity3 = __esm({
  "src/serialization/resources/identity/index.ts"() {
    "use strict";
    init_types32();
    init_resources10();
    init_client();
  }
});

// src/serialization/resources/kv/types/GetResponse.ts
var GetResponse;
var init_GetResponse = __esm({
  "src/serialization/resources/kv/types/GetResponse.ts"() {
    "use strict";
    init_core();
    GetResponse = schemas_exports.object({
      value: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Value),
      deleted: schemas_exports.boolean().optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/kv/types/PutRequest.ts
var PutRequest;
var init_PutRequest = __esm({
  "src/serialization/resources/kv/types/PutRequest.ts"() {
    "use strict";
    init_core();
    PutRequest = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string().optional()),
      key: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Key),
      value: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Value)
    });
  }
});

// src/serialization/resources/kv/types/GetBatchResponse.ts
var GetBatchResponse;
var init_GetBatchResponse = __esm({
  "src/serialization/resources/kv/types/GetBatchResponse.ts"() {
    "use strict";
    init_core();
    GetBatchResponse = schemas_exports.object({
      entries: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Entry)),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/kv/types/PutBatchRequest.ts
var PutBatchRequest;
var init_PutBatchRequest = __esm({
  "src/serialization/resources/kv/types/PutBatchRequest.ts"() {
    "use strict";
    init_core();
    PutBatchRequest = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string().optional()),
      entries: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.PutEntry))
    });
  }
});

// src/serialization/resources/kv/types/index.ts
var init_types36 = __esm({
  "src/serialization/resources/kv/types/index.ts"() {
    "use strict";
    init_GetResponse();
    init_PutRequest();
    init_GetBatchResponse();
    init_PutBatchRequest();
  }
});

// src/serialization/resources/kv/resources/common/types/Key.ts
var Key;
var init_Key = __esm({
  "src/serialization/resources/kv/resources/common/types/Key.ts"() {
    "use strict";
    init_core();
    Key = schemas_exports.string();
  }
});

// src/serialization/resources/kv/resources/common/types/Value.ts
var Value;
var init_Value = __esm({
  "src/serialization/resources/kv/resources/common/types/Value.ts"() {
    "use strict";
    init_core();
    Value = schemas_exports.unknown();
  }
});

// src/serialization/resources/kv/resources/common/types/Entry.ts
var Entry;
var init_Entry = __esm({
  "src/serialization/resources/kv/resources/common/types/Entry.ts"() {
    "use strict";
    init_core();
    Entry = schemas_exports.object({
      key: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Key),
      value: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Value),
      deleted: schemas_exports.boolean().optional()
    });
  }
});

// src/serialization/resources/kv/resources/common/types/PutEntry.ts
var PutEntry;
var init_PutEntry = __esm({
  "src/serialization/resources/kv/resources/common/types/PutEntry.ts"() {
    "use strict";
    init_core();
    PutEntry = schemas_exports.object({
      key: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Key),
      value: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).kv.Value)
    });
  }
});

// src/serialization/resources/kv/resources/common/types/index.ts
var init_types37 = __esm({
  "src/serialization/resources/kv/resources/common/types/index.ts"() {
    "use strict";
    init_Key();
    init_Value();
    init_Entry();
    init_PutEntry();
  }
});

// src/serialization/resources/kv/resources/common/index.ts
var common_exports18 = {};
__export(common_exports18, {
  Entry: () => Entry,
  Key: () => Key,
  PutEntry: () => PutEntry,
  Value: () => Value
});
var init_common6 = __esm({
  "src/serialization/resources/kv/resources/common/index.ts"() {
    "use strict";
    init_types37();
  }
});

// src/serialization/resources/kv/resources/index.ts
var init_resources11 = __esm({
  "src/serialization/resources/kv/resources/index.ts"() {
    "use strict";
    init_common6();
    init_types37();
  }
});

// src/serialization/resources/kv/index.ts
var kv_exports4 = {};
__export(kv_exports4, {
  Entry: () => Entry,
  GetBatchResponse: () => GetBatchResponse,
  GetResponse: () => GetResponse,
  Key: () => Key,
  PutBatchRequest: () => PutBatchRequest,
  PutEntry: () => PutEntry,
  PutRequest: () => PutRequest,
  Value: () => Value,
  common: () => common_exports18
});
var init_kv2 = __esm({
  "src/serialization/resources/kv/index.ts"() {
    "use strict";
    init_types36();
    init_resources11();
  }
});

// src/serialization/resources/captcha/resources/config/types/Config.ts
var Config6;
var init_Config6 = __esm({
  "src/serialization/resources/captcha/resources/config/types/Config.ts"() {
    "use strict";
    init_core();
    Config6 = schemas_exports.object({
      hcaptcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.ConfigHcaptcha).optional(),
      turnstile: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.ConfigTurnstile).optional()
    });
  }
});

// src/serialization/resources/captcha/resources/config/types/ConfigHcaptcha.ts
var ConfigHcaptcha;
var init_ConfigHcaptcha = __esm({
  "src/serialization/resources/captcha/resources/config/types/ConfigHcaptcha.ts"() {
    "use strict";
    init_core();
    ConfigHcaptcha = schemas_exports.object({
      clientResponse: schemas_exports.property("client_response", schemas_exports.string())
    });
  }
});

// src/serialization/resources/captcha/resources/config/types/ConfigTurnstile.ts
var ConfigTurnstile;
var init_ConfigTurnstile = __esm({
  "src/serialization/resources/captcha/resources/config/types/ConfigTurnstile.ts"() {
    "use strict";
    init_core();
    ConfigTurnstile = schemas_exports.object({
      clientResponse: schemas_exports.property("client_response", schemas_exports.string())
    });
  }
});

// src/serialization/resources/captcha/resources/config/types/index.ts
var init_types38 = __esm({
  "src/serialization/resources/captcha/resources/config/types/index.ts"() {
    "use strict";
    init_Config6();
    init_ConfigHcaptcha();
    init_ConfigTurnstile();
  }
});

// src/serialization/resources/captcha/resources/config/index.ts
var config_exports2 = {};
__export(config_exports2, {
  Config: () => Config6,
  ConfigHcaptcha: () => ConfigHcaptcha,
  ConfigTurnstile: () => ConfigTurnstile
});
var init_config = __esm({
  "src/serialization/resources/captcha/resources/config/index.ts"() {
    "use strict";
    init_types38();
  }
});

// src/serialization/resources/captcha/resources/index.ts
var init_resources12 = __esm({
  "src/serialization/resources/captcha/resources/index.ts"() {
    "use strict";
    init_config();
    init_types38();
  }
});

// src/serialization/resources/captcha/index.ts
var captcha_exports2 = {};
__export(captcha_exports2, {
  Config: () => Config6,
  ConfigHcaptcha: () => ConfigHcaptcha,
  ConfigTurnstile: () => ConfigTurnstile,
  config: () => config_exports2
});
var init_captcha = __esm({
  "src/serialization/resources/captcha/index.ts"() {
    "use strict";
    init_resources12();
  }
});

// src/serialization/resources/common/types/Identifier.ts
var Identifier;
var init_Identifier = __esm({
  "src/serialization/resources/common/types/Identifier.ts"() {
    "use strict";
    init_core();
    Identifier = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/Bio.ts
var Bio;
var init_Bio = __esm({
  "src/serialization/resources/common/types/Bio.ts"() {
    "use strict";
    init_core();
    Bio = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/Email.ts
var Email;
var init_Email = __esm({
  "src/serialization/resources/common/types/Email.ts"() {
    "use strict";
    init_core();
    Email = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/Jwt.ts
var Jwt;
var init_Jwt = __esm({
  "src/serialization/resources/common/types/Jwt.ts"() {
    "use strict";
    init_core();
    Jwt = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/WatchQuery.ts
var WatchQuery;
var init_WatchQuery = __esm({
  "src/serialization/resources/common/types/WatchQuery.ts"() {
    "use strict";
    init_core();
    WatchQuery = schemas_exports.string().optional();
  }
});

// src/serialization/resources/common/types/WatchResponse.ts
var WatchResponse;
var init_WatchResponse = __esm({
  "src/serialization/resources/common/types/WatchResponse.ts"() {
    "use strict";
    init_core();
    WatchResponse = schemas_exports.object({
      index: schemas_exports.string()
    });
  }
});

// src/serialization/resources/common/types/DisplayName.ts
var DisplayName;
var init_DisplayName = __esm({
  "src/serialization/resources/common/types/DisplayName.ts"() {
    "use strict";
    init_core();
    DisplayName = schemas_exports.string();
  }
});

// src/serialization/resources/common/types/AccountNumber.ts
var AccountNumber;
var init_AccountNumber = __esm({
  "src/serialization/resources/common/types/AccountNumber.ts"() {
    "use strict";
    init_core();
    AccountNumber = schemas_exports.number();
  }
});

// src/serialization/resources/common/types/ValidationError.ts
var ValidationError5;
var init_ValidationError = __esm({
  "src/serialization/resources/common/types/ValidationError.ts"() {
    "use strict";
    init_core();
    ValidationError5 = schemas_exports.object({
      path: schemas_exports.list(schemas_exports.string())
    });
  }
});

// src/serialization/resources/common/types/EmptyObject.ts
var EmptyObject;
var init_EmptyObject = __esm({
  "src/serialization/resources/common/types/EmptyObject.ts"() {
    "use strict";
    init_core();
    EmptyObject = schemas_exports.object({});
  }
});

// src/serialization/resources/common/types/ErrorMetadata.ts
var ErrorMetadata;
var init_ErrorMetadata = __esm({
  "src/serialization/resources/common/types/ErrorMetadata.ts"() {
    "use strict";
    init_core();
    ErrorMetadata = schemas_exports.unknown();
  }
});

// src/serialization/resources/common/types/ErrorBody.ts
var ErrorBody;
var init_ErrorBody = __esm({
  "src/serialization/resources/common/types/ErrorBody.ts"() {
    "use strict";
    init_core();
    ErrorBody = schemas_exports.object({
      code: schemas_exports.string(),
      message: schemas_exports.string(),
      documentation: schemas_exports.string().optional(),
      metadata: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).ErrorMetadata).optional()
    });
  }
});

// src/serialization/resources/common/types/index.ts
var init_types39 = __esm({
  "src/serialization/resources/common/types/index.ts"() {
    "use strict";
    init_Identifier();
    init_Bio();
    init_Email();
    init_Jwt();
    init_WatchQuery();
    init_WatchResponse();
    init_DisplayName();
    init_AccountNumber();
    init_ValidationError();
    init_EmptyObject();
    init_ErrorMetadata();
    init_ErrorBody();
  }
});

// src/serialization/resources/common/index.ts
var common_exports19 = {};
__export(common_exports19, {
  AccountNumber: () => AccountNumber,
  Bio: () => Bio,
  DisplayName: () => DisplayName,
  Email: () => Email,
  EmptyObject: () => EmptyObject,
  ErrorBody: () => ErrorBody,
  ErrorMetadata: () => ErrorMetadata,
  Identifier: () => Identifier,
  Jwt: () => Jwt,
  ValidationError: () => ValidationError5,
  WatchQuery: () => WatchQuery,
  WatchResponse: () => WatchResponse
});
var init_common7 = __esm({
  "src/serialization/resources/common/index.ts"() {
    "use strict";
    init_types39();
  }
});

// src/serialization/resources/game/resources/common/types/Handle.ts
var Handle3;
var init_Handle3 = __esm({
  "src/serialization/resources/game/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle3 = schemas_exports.object({
      gameId: schemas_exports.property("game_id", schemas_exports.string()),
      nameId: schemas_exports.property(
        "name_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      ),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      logoUrl: schemas_exports.property("logo_url", schemas_exports.string().optional()),
      bannerUrl: schemas_exports.property("banner_url", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/game/resources/common/types/StatSummary.ts
var StatSummary;
var init_StatSummary = __esm({
  "src/serialization/resources/game/resources/common/types/StatSummary.ts"() {
    "use strict";
    init_core();
    StatSummary = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle),
      stats: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Stat)
      )
    });
  }
});

// src/serialization/resources/game/resources/common/types/Stat.ts
var Stat;
var init_Stat = __esm({
  "src/serialization/resources/game/resources/common/types/Stat.ts"() {
    "use strict";
    init_core();
    Stat = schemas_exports.object({
      config: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatConfig),
      overallValue: schemas_exports.property("overall_value", schemas_exports.number())
    });
  }
});

// src/serialization/resources/game/resources/common/types/StatConfig.ts
var StatConfig;
var init_StatConfig = __esm({
  "src/serialization/resources/game/resources/common/types/StatConfig.ts"() {
    "use strict";
    init_core();
    StatConfig = schemas_exports.object({
      recordId: schemas_exports.property("record_id", schemas_exports.string()),
      iconId: schemas_exports.property("icon_id", schemas_exports.string()),
      format: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatFormatMethod),
      aggregation: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatAggregationMethod),
      sorting: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.StatSortingMethod),
      priority: schemas_exports.number(),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      ),
      postfixSingular: schemas_exports.property("postfix_singular", schemas_exports.string().optional()),
      postfixPlural: schemas_exports.property("postfix_plural", schemas_exports.string().optional()),
      prefixSingular: schemas_exports.property("prefix_singular", schemas_exports.string().optional()),
      prefixPlural: schemas_exports.property("prefix_plural", schemas_exports.string().optional())
    });
  }
});

// src/serialization/resources/game/resources/common/types/StatFormatMethod.ts
var StatFormatMethod2;
var init_StatFormatMethod = __esm({
  "src/serialization/resources/game/resources/common/types/StatFormatMethod.ts"() {
    "use strict";
    init_core();
    StatFormatMethod2 = schemas_exports.enum_([
      "integer",
      "float_1",
      "float_2",
      "float_3",
      "duration_minute",
      "duration_second",
      "duration_hundredth_second"
    ]);
  }
});

// src/serialization/resources/game/resources/common/types/StatAggregationMethod.ts
var StatAggregationMethod2;
var init_StatAggregationMethod = __esm({
  "src/serialization/resources/game/resources/common/types/StatAggregationMethod.ts"() {
    "use strict";
    init_core();
    StatAggregationMethod2 = schemas_exports.enum_(["sum", "average", "min", "max"]);
  }
});

// src/serialization/resources/game/resources/common/types/StatSortingMethod.ts
var StatSortingMethod2;
var init_StatSortingMethod = __esm({
  "src/serialization/resources/game/resources/common/types/StatSortingMethod.ts"() {
    "use strict";
    init_core();
    StatSortingMethod2 = schemas_exports.enum_(["desc", "asc"]);
  }
});

// src/serialization/resources/game/resources/common/types/index.ts
var init_types40 = __esm({
  "src/serialization/resources/game/resources/common/types/index.ts"() {
    "use strict";
    init_Handle3();
    init_StatSummary();
    init_Stat();
    init_StatConfig();
    init_StatFormatMethod();
    init_StatAggregationMethod();
    init_StatSortingMethod();
  }
});

// src/serialization/resources/game/resources/common/index.ts
var common_exports20 = {};
__export(common_exports20, {
  Handle: () => Handle3,
  Stat: () => Stat,
  StatAggregationMethod: () => StatAggregationMethod2,
  StatConfig: () => StatConfig,
  StatFormatMethod: () => StatFormatMethod2,
  StatSortingMethod: () => StatSortingMethod2,
  StatSummary: () => StatSummary
});
var init_common8 = __esm({
  "src/serialization/resources/game/resources/common/index.ts"() {
    "use strict";
    init_types40();
  }
});

// src/serialization/resources/game/resources/index.ts
var init_resources13 = __esm({
  "src/serialization/resources/game/resources/index.ts"() {
    "use strict";
    init_common8();
    init_types40();
  }
});

// src/serialization/resources/game/index.ts
var game_exports2 = {};
__export(game_exports2, {
  Handle: () => Handle3,
  Stat: () => Stat,
  StatAggregationMethod: () => StatAggregationMethod2,
  StatConfig: () => StatConfig,
  StatFormatMethod: () => StatFormatMethod2,
  StatSortingMethod: () => StatSortingMethod2,
  StatSummary: () => StatSummary,
  common: () => common_exports20
});
var init_game = __esm({
  "src/serialization/resources/game/index.ts"() {
    "use strict";
    init_resources13();
  }
});

// src/serialization/resources/geo/resources/common/types/Coord.ts
var Coord;
var init_Coord = __esm({
  "src/serialization/resources/geo/resources/common/types/Coord.ts"() {
    "use strict";
    init_core();
    Coord = schemas_exports.object({
      latitude: schemas_exports.number(),
      longitude: schemas_exports.number()
    });
  }
});

// src/serialization/resources/geo/resources/common/types/Distance.ts
var Distance;
var init_Distance = __esm({
  "src/serialization/resources/geo/resources/common/types/Distance.ts"() {
    "use strict";
    init_core();
    Distance = schemas_exports.object({
      kilometers: schemas_exports.number(),
      miles: schemas_exports.number()
    });
  }
});

// src/serialization/resources/geo/resources/common/types/index.ts
var init_types41 = __esm({
  "src/serialization/resources/geo/resources/common/types/index.ts"() {
    "use strict";
    init_Coord();
    init_Distance();
  }
});

// src/serialization/resources/geo/resources/common/index.ts
var common_exports21 = {};
__export(common_exports21, {
  Coord: () => Coord,
  Distance: () => Distance
});
var init_common9 = __esm({
  "src/serialization/resources/geo/resources/common/index.ts"() {
    "use strict";
    init_types41();
  }
});

// src/serialization/resources/geo/resources/index.ts
var init_resources14 = __esm({
  "src/serialization/resources/geo/resources/index.ts"() {
    "use strict";
    init_common9();
    init_types41();
  }
});

// src/serialization/resources/geo/index.ts
var geo_exports2 = {};
__export(geo_exports2, {
  Coord: () => Coord,
  Distance: () => Distance,
  common: () => common_exports21
});
var init_geo = __esm({
  "src/serialization/resources/geo/index.ts"() {
    "use strict";
    init_resources14();
  }
});

// src/serialization/resources/matchmaker/resources/common/types/LobbyInfo.ts
var LobbyInfo;
var init_LobbyInfo = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/LobbyInfo.ts"() {
    "use strict";
    init_core();
    LobbyInfo = schemas_exports.object({
      regionId: schemas_exports.property("region_id", schemas_exports.string()),
      gameModeId: schemas_exports.property("game_mode_id", schemas_exports.string()),
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      maxPlayersNormal: schemas_exports.property("max_players_normal", schemas_exports.number()),
      maxPlayersDirect: schemas_exports.property("max_players_direct", schemas_exports.number()),
      maxPlayersParty: schemas_exports.property("max_players_party", schemas_exports.number()),
      totalPlayerCount: schemas_exports.property("total_player_count", schemas_exports.number())
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/GameModeInfo.ts
var GameModeInfo;
var init_GameModeInfo = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/GameModeInfo.ts"() {
    "use strict";
    init_core();
    GameModeInfo = schemas_exports.object({
      gameModeId: schemas_exports.property(
        "game_mode_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/RegionInfo.ts
var RegionInfo;
var init_RegionInfo = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/RegionInfo.ts"() {
    "use strict";
    init_core();
    RegionInfo = schemas_exports.object({
      regionId: schemas_exports.property(
        "region_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      ),
      providerDisplayName: schemas_exports.property("provider_display_name", schemas_exports.string()),
      regionDisplayName: schemas_exports.property("region_display_name", schemas_exports.string()),
      datacenterCoord: schemas_exports.property(
        "datacenter_coord",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).geo.Coord)
      ),
      datacenterDistanceFromClient: schemas_exports.property(
        "datacenter_distance_from_client",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).geo.Distance)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinLobby.ts
var JoinLobby;
var init_JoinLobby = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinLobby.ts"() {
    "use strict";
    init_core();
    JoinLobby = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      region: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinRegion),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort)
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinRegion.ts
var JoinRegion;
var init_JoinRegion = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinRegion.ts"() {
    "use strict";
    init_core();
    JoinRegion = schemas_exports.object({
      regionId: schemas_exports.property(
        "region_id",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier)
      ),
      displayName: schemas_exports.property(
        "display_name",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).DisplayName)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinPort.ts
var JoinPort;
var init_JoinPort = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinPort.ts"() {
    "use strict";
    init_core();
    JoinPort = schemas_exports.object({
      host: schemas_exports.string().optional(),
      hostname: schemas_exports.string(),
      port: schemas_exports.number().optional(),
      portRange: schemas_exports.property(
        "port_range",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPortRange).optional()
      ),
      isTls: schemas_exports.property("is_tls", schemas_exports.boolean())
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinPortRange.ts
var JoinPortRange;
var init_JoinPortRange = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinPortRange.ts"() {
    "use strict";
    init_core();
    JoinPortRange = schemas_exports.object({
      min: schemas_exports.number(),
      max: schemas_exports.number()
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/JoinPlayer.ts
var JoinPlayer;
var init_JoinPlayer = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/JoinPlayer.ts"() {
    "use strict";
    init_core();
    JoinPlayer = schemas_exports.object({
      token: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt)
    });
  }
});

// src/serialization/resources/matchmaker/resources/common/types/index.ts
var init_types42 = __esm({
  "src/serialization/resources/matchmaker/resources/common/types/index.ts"() {
    "use strict";
    init_LobbyInfo();
    init_GameModeInfo();
    init_RegionInfo();
    init_JoinLobby();
    init_JoinRegion();
    init_JoinPort();
    init_JoinPortRange();
    init_JoinPlayer();
  }
});

// src/serialization/resources/matchmaker/resources/common/index.ts
var common_exports22 = {};
__export(common_exports22, {
  GameModeInfo: () => GameModeInfo,
  JoinLobby: () => JoinLobby,
  JoinPlayer: () => JoinPlayer,
  JoinPort: () => JoinPort,
  JoinPortRange: () => JoinPortRange,
  JoinRegion: () => JoinRegion,
  LobbyInfo: () => LobbyInfo,
  RegionInfo: () => RegionInfo
});
var init_common10 = __esm({
  "src/serialization/resources/matchmaker/resources/common/index.ts"() {
    "use strict";
    init_types42();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/FindLobbyResponse.ts
var FindLobbyResponse;
var init_FindLobbyResponse = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/FindLobbyResponse.ts"() {
    "use strict";
    init_core();
    FindLobbyResponse = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinLobby),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort)
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/JoinLobbyResponse.ts
var JoinLobbyResponse;
var init_JoinLobbyResponse = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/JoinLobbyResponse.ts"() {
    "use strict";
    init_core();
    JoinLobbyResponse = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinLobby),
      ports: schemas_exports.record(
        schemas_exports.string(),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPort)
      ),
      player: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.JoinPlayer)
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/ListLobbiesResponse.ts
var ListLobbiesResponse;
var init_ListLobbiesResponse = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/ListLobbiesResponse.ts"() {
    "use strict";
    init_core();
    ListLobbiesResponse = schemas_exports.object({
      gameModes: schemas_exports.property(
        "game_modes",
        schemas_exports.list(
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.GameModeInfo)
        )
      ),
      regions: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.RegionInfo)
      ),
      lobbies: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.LobbyInfo)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/types/index.ts
var init_types43 = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/types/index.ts"() {
    "use strict";
    init_FindLobbyResponse();
    init_JoinLobbyResponse();
    init_ListLobbiesResponse();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/SetLobbyClosedRequest.ts
var SetLobbyClosedRequest;
var init_SetLobbyClosedRequest = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/SetLobbyClosedRequest.ts"() {
    "use strict";
    init_core();
    SetLobbyClosedRequest = schemas_exports.object({
      isClosed: schemas_exports.property("is_closed", schemas_exports.boolean())
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/FindLobbyRequest.ts
var FindLobbyRequest;
var init_FindLobbyRequest = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/FindLobbyRequest.ts"() {
    "use strict";
    init_core();
    FindLobbyRequest = schemas_exports.object({
      gameModes: schemas_exports.property("game_modes", schemas_exports.list(schemas_exports.string())),
      regions: schemas_exports.list(schemas_exports.string()).optional(),
      preventAutoCreateLobby: schemas_exports.property(
        "prevent_auto_create_lobby",
        schemas_exports.boolean().optional()
      ),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/JoinLobbyRequest.ts
var JoinLobbyRequest;
var init_JoinLobbyRequest = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/JoinLobbyRequest.ts"() {
    "use strict";
    init_core();
    JoinLobbyRequest = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/requests/index.ts
var init_requests2 = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/requests/index.ts"() {
    "use strict";
    init_SetLobbyClosedRequest();
    init_FindLobbyRequest();
    init_JoinLobbyRequest();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/client/index.ts
var init_client2 = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/client/index.ts"() {
    "use strict";
    init_requests2();
  }
});

// src/serialization/resources/matchmaker/resources/lobbies/index.ts
var lobbies_exports2 = {};
__export(lobbies_exports2, {
  FindLobbyRequest: () => FindLobbyRequest,
  FindLobbyResponse: () => FindLobbyResponse,
  JoinLobbyRequest: () => JoinLobbyRequest,
  JoinLobbyResponse: () => JoinLobbyResponse,
  ListLobbiesResponse: () => ListLobbiesResponse,
  SetLobbyClosedRequest: () => SetLobbyClosedRequest
});
var init_lobbies = __esm({
  "src/serialization/resources/matchmaker/resources/lobbies/index.ts"() {
    "use strict";
    init_types43();
    init_client2();
  }
});

// src/serialization/resources/matchmaker/resources/players/types/GetStatisticsResponse.ts
var GetStatisticsResponse;
var init_GetStatisticsResponse = __esm({
  "src/serialization/resources/matchmaker/resources/players/types/GetStatisticsResponse.ts"() {
    "use strict";
    init_core();
    GetStatisticsResponse = schemas_exports.object({
      playerCount: schemas_exports.property("player_count", schemas_exports.number()),
      gameModes: schemas_exports.property(
        "game_modes",
        schemas_exports.record(
          schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier),
          schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.GameModeStatistics)
        )
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/players/types/GameModeStatistics.ts
var GameModeStatistics;
var init_GameModeStatistics = __esm({
  "src/serialization/resources/matchmaker/resources/players/types/GameModeStatistics.ts"() {
    "use strict";
    init_core();
    GameModeStatistics = schemas_exports.object({
      playerCount: schemas_exports.property("player_count", schemas_exports.number()),
      regions: schemas_exports.record(
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Identifier),
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.RegionStatistics)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/players/types/RegionStatistics.ts
var RegionStatistics;
var init_RegionStatistics = __esm({
  "src/serialization/resources/matchmaker/resources/players/types/RegionStatistics.ts"() {
    "use strict";
    init_core();
    RegionStatistics = schemas_exports.object({
      playerCount: schemas_exports.property("player_count", schemas_exports.number())
    });
  }
});

// src/serialization/resources/matchmaker/resources/players/types/index.ts
var init_types44 = __esm({
  "src/serialization/resources/matchmaker/resources/players/types/index.ts"() {
    "use strict";
    init_GetStatisticsResponse();
    init_GameModeStatistics();
    init_RegionStatistics();
  }
});

// src/serialization/resources/matchmaker/resources/players/client/requests/PlayerConnectedRequest.ts
var PlayerConnectedRequest;
var init_PlayerConnectedRequest = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/requests/PlayerConnectedRequest.ts"() {
    "use strict";
    init_core();
    PlayerConnectedRequest = schemas_exports.object({
      playerToken: schemas_exports.property("player_token", schemas_exports.string())
    });
  }
});

// src/serialization/resources/matchmaker/resources/players/client/requests/PlayerDisconnectedRequest.ts
var PlayerDisconnectedRequest;
var init_PlayerDisconnectedRequest = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/requests/PlayerDisconnectedRequest.ts"() {
    "use strict";
    init_core();
    PlayerDisconnectedRequest = schemas_exports.object({
      playerToken: schemas_exports.property("player_token", schemas_exports.string())
    });
  }
});

// src/serialization/resources/matchmaker/resources/players/client/requests/index.ts
var init_requests3 = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/requests/index.ts"() {
    "use strict";
    init_PlayerConnectedRequest();
    init_PlayerDisconnectedRequest();
  }
});

// src/serialization/resources/matchmaker/resources/players/client/index.ts
var init_client3 = __esm({
  "src/serialization/resources/matchmaker/resources/players/client/index.ts"() {
    "use strict";
    init_requests3();
  }
});

// src/serialization/resources/matchmaker/resources/players/index.ts
var players_exports2 = {};
__export(players_exports2, {
  GameModeStatistics: () => GameModeStatistics,
  GetStatisticsResponse: () => GetStatisticsResponse,
  PlayerConnectedRequest: () => PlayerConnectedRequest,
  PlayerDisconnectedRequest: () => PlayerDisconnectedRequest,
  RegionStatistics: () => RegionStatistics
});
var init_players = __esm({
  "src/serialization/resources/matchmaker/resources/players/index.ts"() {
    "use strict";
    init_types44();
    init_client3();
  }
});

// src/serialization/resources/matchmaker/resources/regions/types/ListRegionsResponse.ts
var ListRegionsResponse;
var init_ListRegionsResponse = __esm({
  "src/serialization/resources/matchmaker/resources/regions/types/ListRegionsResponse.ts"() {
    "use strict";
    init_core();
    ListRegionsResponse = schemas_exports.object({
      regions: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).matchmaker.RegionInfo)
      )
    });
  }
});

// src/serialization/resources/matchmaker/resources/regions/types/index.ts
var init_types45 = __esm({
  "src/serialization/resources/matchmaker/resources/regions/types/index.ts"() {
    "use strict";
    init_ListRegionsResponse();
  }
});

// src/serialization/resources/matchmaker/resources/regions/index.ts
var regions_exports2 = {};
__export(regions_exports2, {
  ListRegionsResponse: () => ListRegionsResponse
});
var init_regions = __esm({
  "src/serialization/resources/matchmaker/resources/regions/index.ts"() {
    "use strict";
    init_types45();
  }
});

// src/serialization/resources/matchmaker/resources/index.ts
var init_resources15 = __esm({
  "src/serialization/resources/matchmaker/resources/index.ts"() {
    "use strict";
    init_common10();
    init_types42();
    init_lobbies();
    init_types43();
    init_players();
    init_types44();
    init_regions();
    init_types45();
    init_requests2();
    init_requests3();
  }
});

// src/serialization/resources/matchmaker/index.ts
var matchmaker_exports7 = {};
__export(matchmaker_exports7, {
  FindLobbyRequest: () => FindLobbyRequest,
  FindLobbyResponse: () => FindLobbyResponse,
  GameModeInfo: () => GameModeInfo,
  GameModeStatistics: () => GameModeStatistics,
  GetStatisticsResponse: () => GetStatisticsResponse,
  JoinLobby: () => JoinLobby,
  JoinLobbyRequest: () => JoinLobbyRequest,
  JoinLobbyResponse: () => JoinLobbyResponse,
  JoinPlayer: () => JoinPlayer,
  JoinPort: () => JoinPort,
  JoinPortRange: () => JoinPortRange,
  JoinRegion: () => JoinRegion,
  ListLobbiesResponse: () => ListLobbiesResponse,
  ListRegionsResponse: () => ListRegionsResponse,
  LobbyInfo: () => LobbyInfo,
  PlayerConnectedRequest: () => PlayerConnectedRequest,
  PlayerDisconnectedRequest: () => PlayerDisconnectedRequest,
  RegionInfo: () => RegionInfo,
  RegionStatistics: () => RegionStatistics,
  SetLobbyClosedRequest: () => SetLobbyClosedRequest,
  common: () => common_exports22,
  lobbies: () => lobbies_exports2,
  players: () => players_exports2,
  regions: () => regions_exports2
});
var init_matchmaker3 = __esm({
  "src/serialization/resources/matchmaker/index.ts"() {
    "use strict";
    init_resources15();
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/types/FindMatchmakerLobbyForPartyRequest.ts
var FindMatchmakerLobbyForPartyRequest;
var init_FindMatchmakerLobbyForPartyRequest = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/types/FindMatchmakerLobbyForPartyRequest.ts"() {
    "use strict";
    init_core();
    FindMatchmakerLobbyForPartyRequest = schemas_exports.object({
      gameModes: schemas_exports.property("game_modes", schemas_exports.list(schemas_exports.string())),
      regions: schemas_exports.list(schemas_exports.string()).optional(),
      preventAutoCreateLobby: schemas_exports.property(
        "prevent_auto_create_lobby",
        schemas_exports.boolean().optional()
      ),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/types/JoinMatchmakerLobbyForPartyRequest.ts
var JoinMatchmakerLobbyForPartyRequest;
var init_JoinMatchmakerLobbyForPartyRequest = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/types/JoinMatchmakerLobbyForPartyRequest.ts"() {
    "use strict";
    init_core();
    JoinMatchmakerLobbyForPartyRequest = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string()),
      captcha: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).captcha.Config).optional()
    });
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/types/index.ts
var init_types46 = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/types/index.ts"() {
    "use strict";
    init_FindMatchmakerLobbyForPartyRequest();
    init_JoinMatchmakerLobbyForPartyRequest();
  }
});

// src/serialization/resources/party/resources/activity/resources/matchmaker/index.ts
var matchmaker_exports8 = {};
__export(matchmaker_exports8, {
  FindMatchmakerLobbyForPartyRequest: () => FindMatchmakerLobbyForPartyRequest,
  JoinMatchmakerLobbyForPartyRequest: () => JoinMatchmakerLobbyForPartyRequest
});
var init_matchmaker4 = __esm({
  "src/serialization/resources/party/resources/activity/resources/matchmaker/index.ts"() {
    "use strict";
    init_types46();
  }
});

// src/serialization/resources/party/resources/activity/resources/index.ts
var init_resources16 = __esm({
  "src/serialization/resources/party/resources/activity/resources/index.ts"() {
    "use strict";
    init_matchmaker4();
    init_types46();
  }
});

// src/serialization/resources/party/resources/activity/index.ts
var activity_exports2 = {};
__export(activity_exports2, {
  FindMatchmakerLobbyForPartyRequest: () => FindMatchmakerLobbyForPartyRequest,
  JoinMatchmakerLobbyForPartyRequest: () => JoinMatchmakerLobbyForPartyRequest,
  matchmaker: () => matchmaker_exports8
});
var init_activity = __esm({
  "src/serialization/resources/party/resources/activity/index.ts"() {
    "use strict";
    init_resources16();
  }
});

// src/serialization/resources/party/resources/common/types/CreatePublicityConfig.ts
var CreatePublicityConfig;
var init_CreatePublicityConfig = __esm({
  "src/serialization/resources/party/resources/common/types/CreatePublicityConfig.ts"() {
    "use strict";
    init_core();
    CreatePublicityConfig = schemas_exports.object({
      public: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional(),
      mutualFollowers: schemas_exports.property(
        "mutual_followers",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
      ),
      groups: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
    });
  }
});

// src/serialization/resources/party/resources/common/types/CreateInviteConfig.ts
var CreateInviteConfig;
var init_CreateInviteConfig = __esm({
  "src/serialization/resources/party/resources/common/types/CreateInviteConfig.ts"() {
    "use strict";
    init_core();
    CreateInviteConfig = schemas_exports.object({
      alias: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/party/resources/common/types/CreatedInvite.ts
var CreatedInvite;
var init_CreatedInvite = __esm({
  "src/serialization/resources/party/resources/common/types/CreatedInvite.ts"() {
    "use strict";
    init_core();
    CreatedInvite = schemas_exports.object({
      alias: schemas_exports.string().optional(),
      token: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/JoinInvite.ts
var JoinInvite;
var init_JoinInvite = __esm({
  "src/serialization/resources/party/resources/common/types/JoinInvite.ts"() {
    "use strict";
    init_core();
    JoinInvite = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string().optional()),
      token: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).Jwt).optional(),
      alias: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/party/resources/common/types/Summary.ts
var Summary4;
var init_Summary4 = __esm({
  "src/serialization/resources/party/resources/common/types/Summary.ts"() {
    "use strict";
    init_core();
    Summary4 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      activity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Activity),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ExternalLinks),
      publicity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Publicity),
      partySize: schemas_exports.property("party_size", schemas_exports.number()),
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberSummary)
      ),
      threadId: schemas_exports.property("thread_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/common/types/Handle.ts
var Handle4;
var init_Handle4 = __esm({
  "src/serialization/resources/party/resources/common/types/Handle.ts"() {
    "use strict";
    init_core();
    Handle4 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      activity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Activity),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ExternalLinks)
    });
  }
});

// src/serialization/resources/party/resources/common/types/Activity.ts
var Activity;
var init_Activity = __esm({
  "src/serialization/resources/party/resources/common/types/Activity.ts"() {
    "use strict";
    init_core();
    Activity = schemas_exports.object({
      idle: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      matchmakerFindingLobby: schemas_exports.property(
        "matchmaker_finding_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ActivityMatchmakerFindingLobby).optional()
      ),
      matchmakerLobby: schemas_exports.property(
        "matchmaker_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ActivityMatchmakerLobby).optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/common/types/ActivityMatchmakerFindingLobby.ts
var ActivityMatchmakerFindingLobby;
var init_ActivityMatchmakerFindingLobby = __esm({
  "src/serialization/resources/party/resources/common/types/ActivityMatchmakerFindingLobby.ts"() {
    "use strict";
    init_core();
    ActivityMatchmakerFindingLobby = schemas_exports.object({
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle)
    });
  }
});

// src/serialization/resources/party/resources/common/types/ActivityMatchmakerLobby.ts
var ActivityMatchmakerLobby;
var init_ActivityMatchmakerLobby = __esm({
  "src/serialization/resources/party/resources/common/types/ActivityMatchmakerLobby.ts"() {
    "use strict";
    init_core();
    ActivityMatchmakerLobby = schemas_exports.object({
      lobby: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MatchmakerLobby),
      game: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).game.Handle)
    });
  }
});

// src/serialization/resources/party/resources/common/types/ExternalLinks.ts
var ExternalLinks3;
var init_ExternalLinks3 = __esm({
  "src/serialization/resources/party/resources/common/types/ExternalLinks.ts"() {
    "use strict";
    init_core();
    ExternalLinks3 = schemas_exports.object({
      chat: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/MatchmakerLobby.ts
var MatchmakerLobby;
var init_MatchmakerLobby = __esm({
  "src/serialization/resources/party/resources/common/types/MatchmakerLobby.ts"() {
    "use strict";
    init_core();
    MatchmakerLobby = schemas_exports.object({
      lobbyId: schemas_exports.property("lobby_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/common/types/Publicity.ts
var Publicity3;
var init_Publicity2 = __esm({
  "src/serialization/resources/party/resources/common/types/Publicity.ts"() {
    "use strict";
    init_core();
    Publicity3 = schemas_exports.object({
      public: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel),
      mutualFollowers: schemas_exports.property(
        "mutual_followers",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel)
      ),
      groups: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel)
    });
  }
});

// src/serialization/resources/party/resources/common/types/PublicityLevel.ts
var PublicityLevel2;
var init_PublicityLevel = __esm({
  "src/serialization/resources/party/resources/common/types/PublicityLevel.ts"() {
    "use strict";
    init_core();
    PublicityLevel2 = schemas_exports.enum_(["none", "view", "join"]);
  }
});

// src/serialization/resources/party/resources/common/types/MemberSummary.ts
var MemberSummary;
var init_MemberSummary = __esm({
  "src/serialization/resources/party/resources/common/types/MemberSummary.ts"() {
    "use strict";
    init_core();
    MemberSummary = schemas_exports.object({
      identity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).identity.Handle),
      isLeader: schemas_exports.property("is_leader", schemas_exports.boolean()),
      joinTs: schemas_exports.property("join_ts", schemas_exports.date()),
      state: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberState)
    });
  }
});

// src/serialization/resources/party/resources/common/types/MemberState.ts
var MemberState;
var init_MemberState = __esm({
  "src/serialization/resources/party/resources/common/types/MemberState.ts"() {
    "use strict";
    init_core();
    MemberState = schemas_exports.object({
      idle: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional(),
      matchmakerPending: schemas_exports.property(
        "matchmaker_pending",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional()
      ),
      matchmakerFindingLobby: schemas_exports.property(
        "matchmaker_finding_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).EmptyObject).optional()
      ),
      matchmakerLobby: schemas_exports.property(
        "matchmaker_lobby",
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberStateMatchmakerLobby).optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/common/types/MemberStateMatchmakerLobby.ts
var MemberStateMatchmakerLobby;
var init_MemberStateMatchmakerLobby = __esm({
  "src/serialization/resources/party/resources/common/types/MemberStateMatchmakerLobby.ts"() {
    "use strict";
    init_core();
    MemberStateMatchmakerLobby = schemas_exports.object({
      playerId: schemas_exports.property("player_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/common/types/Profile.ts
var Profile3;
var init_Profile3 = __esm({
  "src/serialization/resources/party/resources/common/types/Profile.ts"() {
    "use strict";
    init_core();
    Profile3 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      activity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Activity),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.ExternalLinks),
      publicity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Publicity),
      partySize: schemas_exports.property("party_size", schemas_exports.number().optional()),
      members: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.MemberSummary)
      ),
      threadId: schemas_exports.property("thread_id", schemas_exports.string()),
      invites: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Invite)
      )
    });
  }
});

// src/serialization/resources/party/resources/common/types/Invite.ts
var Invite;
var init_Invite = __esm({
  "src/serialization/resources/party/resources/common/types/Invite.ts"() {
    "use strict";
    init_core();
    Invite = schemas_exports.object({
      inviteId: schemas_exports.property("invite_id", schemas_exports.string()),
      createTs: schemas_exports.property("create_ts", schemas_exports.date()),
      token: schemas_exports.string(),
      alias: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.InviteAlias).optional(),
      external: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.InviteExternalLinks)
    });
  }
});

// src/serialization/resources/party/resources/common/types/InviteAlias.ts
var InviteAlias;
var init_InviteAlias = __esm({
  "src/serialization/resources/party/resources/common/types/InviteAlias.ts"() {
    "use strict";
    init_core();
    InviteAlias = schemas_exports.object({
      namespaceId: schemas_exports.property("namespace_id", schemas_exports.string()),
      alias: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/InviteExternalLinks.ts
var InviteExternalLinks;
var init_InviteExternalLinks = __esm({
  "src/serialization/resources/party/resources/common/types/InviteExternalLinks.ts"() {
    "use strict";
    init_core();
    InviteExternalLinks = schemas_exports.object({
      invite: schemas_exports.string()
    });
  }
});

// src/serialization/resources/party/resources/common/types/index.ts
var init_types47 = __esm({
  "src/serialization/resources/party/resources/common/types/index.ts"() {
    "use strict";
    init_CreatePublicityConfig();
    init_CreateInviteConfig();
    init_CreatedInvite();
    init_JoinInvite();
    init_Summary4();
    init_Handle4();
    init_Activity();
    init_ActivityMatchmakerFindingLobby();
    init_ActivityMatchmakerLobby();
    init_ExternalLinks3();
    init_MatchmakerLobby();
    init_Publicity2();
    init_PublicityLevel();
    init_MemberSummary();
    init_MemberState();
    init_MemberStateMatchmakerLobby();
    init_Profile3();
    init_Invite();
    init_InviteAlias();
    init_InviteExternalLinks();
  }
});

// src/serialization/resources/party/resources/common/index.ts
var common_exports23 = {};
__export(common_exports23, {
  Activity: () => Activity,
  ActivityMatchmakerFindingLobby: () => ActivityMatchmakerFindingLobby,
  ActivityMatchmakerLobby: () => ActivityMatchmakerLobby,
  CreateInviteConfig: () => CreateInviteConfig,
  CreatePublicityConfig: () => CreatePublicityConfig,
  CreatedInvite: () => CreatedInvite,
  ExternalLinks: () => ExternalLinks3,
  Handle: () => Handle4,
  Invite: () => Invite,
  InviteAlias: () => InviteAlias,
  InviteExternalLinks: () => InviteExternalLinks,
  JoinInvite: () => JoinInvite,
  MatchmakerLobby: () => MatchmakerLobby,
  MemberState: () => MemberState,
  MemberStateMatchmakerLobby: () => MemberStateMatchmakerLobby,
  MemberSummary: () => MemberSummary,
  Profile: () => Profile3,
  Publicity: () => Publicity3,
  PublicityLevel: () => PublicityLevel2,
  Summary: () => Summary4
});
var init_common11 = __esm({
  "src/serialization/resources/party/resources/common/index.ts"() {
    "use strict";
    init_types47();
  }
});

// src/serialization/resources/party/resources/parties/types/GetInviteResponse.ts
var GetInviteResponse2;
var init_GetInviteResponse2 = __esm({
  "src/serialization/resources/party/resources/parties/types/GetInviteResponse.ts"() {
    "use strict";
    init_core();
    GetInviteResponse2 = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateRequest.ts
var CreateRequest2;
var init_CreateRequest2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateRequest.ts"() {
    "use strict";
    init_core();
    CreateRequest2 = schemas_exports.object({
      partySize: schemas_exports.property("party_size", schemas_exports.number().optional()),
      publicity: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreatePublicityConfig).optional(),
      invites: schemas_exports.list(schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreateInviteConfig)).optional(),
      matchmakerCurrentPlayerToken: schemas_exports.property(
        "matchmaker_current_player_token",
        schemas_exports.string().optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateResponse.ts
var CreateResponse2;
var init_CreateResponse2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateResponse.ts"() {
    "use strict";
    init_core();
    CreateResponse2 = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string()),
      invites: schemas_exports.list(
        schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreatedInvite)
      )
    });
  }
});

// src/serialization/resources/party/resources/parties/types/JoinRequest.ts
var JoinRequest2;
var init_JoinRequest2 = __esm({
  "src/serialization/resources/party/resources/parties/types/JoinRequest.ts"() {
    "use strict";
    init_core();
    JoinRequest2 = schemas_exports.object({
      invite: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.JoinInvite),
      matchmakerAutoJoinLobby: schemas_exports.property(
        "matchmaker_auto_join_lobby",
        schemas_exports.boolean().optional()
      ),
      matchmakerCurrentPlayerToken: schemas_exports.property(
        "matchmaker_current_player_token",
        schemas_exports.string().optional()
      )
    });
  }
});

// src/serialization/resources/party/resources/parties/types/JoinResponse.ts
var JoinResponse;
var init_JoinResponse = __esm({
  "src/serialization/resources/party/resources/parties/types/JoinResponse.ts"() {
    "use strict";
    init_core();
    JoinResponse = schemas_exports.object({
      partyId: schemas_exports.property("party_id", schemas_exports.string())
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateInviteRequest.ts
var CreateInviteRequest2;
var init_CreateInviteRequest2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateInviteRequest.ts"() {
    "use strict";
    init_core();
    CreateInviteRequest2 = schemas_exports.object({
      alias: schemas_exports.string().optional()
    });
  }
});

// src/serialization/resources/party/resources/parties/types/CreateInviteResponse.ts
var CreateInviteResponse2;
var init_CreateInviteResponse2 = __esm({
  "src/serialization/resources/party/resources/parties/types/CreateInviteResponse.ts"() {
    "use strict";
    init_core();
    CreateInviteResponse2 = schemas_exports.object({
      invite: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.CreatedInvite)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetSelfProfileResponse.ts
var GetSelfProfileResponse;
var init_GetSelfProfileResponse = __esm({
  "src/serialization/resources/party/resources/parties/types/GetSelfProfileResponse.ts"() {
    "use strict";
    init_core();
    GetSelfProfileResponse = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Profile).optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/SetPublicityRequest.ts
var SetPublicityRequest;
var init_SetPublicityRequest = __esm({
  "src/serialization/resources/party/resources/parties/types/SetPublicityRequest.ts"() {
    "use strict";
    init_core();
    SetPublicityRequest = schemas_exports.object({
      public: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional(),
      mutualFollowers: schemas_exports.property(
        "mutual_followers",
        schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
      ),
      groups: schemas_exports.lazy(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.PublicityLevel).optional()
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetSelfSummaryResponse.ts
var GetSelfSummaryResponse;
var init_GetSelfSummaryResponse = __esm({
  "src/serialization/resources/party/resources/parties/types/GetSelfSummaryResponse.ts"() {
    "use strict";
    init_core();
    GetSelfSummaryResponse = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary).optional(),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetProfileResponse.ts
var GetProfileResponse3;
var init_GetProfileResponse3 = __esm({
  "src/serialization/resources/party/resources/parties/types/GetProfileResponse.ts"() {
    "use strict";
    init_core();
    GetProfileResponse3 = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Profile),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/GetSummaryResponse.ts
var GetSummaryResponse2;
var init_GetSummaryResponse2 = __esm({
  "src/serialization/resources/party/resources/parties/types/GetSummaryResponse.ts"() {
    "use strict";
    init_core();
    GetSummaryResponse2 = schemas_exports.object({
      party: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).party.Summary),
      watch: schemas_exports.lazyObject(async () => (await Promise.resolve().then(() => (init_serialization(), serialization_exports))).WatchResponse)
    });
  }
});

// src/serialization/resources/party/resources/parties/types/index.ts
var init_types48 = __esm({
  "src/serialization/resources/party/resources/parties/types/index.ts"() {
    "use strict";
    init_GetInviteResponse2();
    init_CreateRequest2();
    init_CreateResponse2();
    init_JoinRequest2();
    init_JoinResponse();
    init_CreateInviteRequest2();
    init_CreateInviteResponse2();
    init_GetSelfProfileResponse();
    init_SetPublicityRequest();
    init_GetSelfSummaryResponse();
    init_GetProfileResponse3();
    init_GetSummaryResponse2();
  }
});

// src/serialization/resources/party/resources/parties/index.ts
var parties_exports2 = {};
__export(parties_exports2, {
  CreateInviteRequest: () => CreateInviteRequest2,
  CreateInviteResponse: () => CreateInviteResponse2,
  CreateRequest: () => CreateRequest2,
  CreateResponse: () => CreateResponse2,
  GetInviteResponse: () => GetInviteResponse2,
  GetProfileResponse: () => GetProfileResponse3,
  GetSelfProfileResponse: () => GetSelfProfileResponse,
  GetSelfSummaryResponse: () => GetSelfSummaryResponse,
  GetSummaryResponse: () => GetSummaryResponse2,
  JoinRequest: () => JoinRequest2,
  JoinResponse: () => JoinResponse,
  SetPublicityRequest: () => SetPublicityRequest
});
var init_parties = __esm({
  "src/serialization/resources/party/resources/parties/index.ts"() {
    "use strict";
    init_types48();
  }
});

// src/serialization/resources/party/resources/index.ts
var init_resources17 = __esm({
  "src/serialization/resources/party/resources/index.ts"() {
    "use strict";
    init_activity();
    init_common11();
    init_types47();
    init_parties();
    init_types48();
  }
});

// src/serialization/resources/party/index.ts
var party_exports2 = {};
__export(party_exports2, {
  Activity: () => Activity,
  ActivityMatchmakerFindingLobby: () => ActivityMatchmakerFindingLobby,
  ActivityMatchmakerLobby: () => ActivityMatchmakerLobby,
  CreateInviteConfig: () => CreateInviteConfig,
  CreateInviteRequest: () => CreateInviteRequest2,
  CreateInviteResponse: () => CreateInviteResponse2,
  CreatePublicityConfig: () => CreatePublicityConfig,
  CreateRequest: () => CreateRequest2,
  CreateResponse: () => CreateResponse2,
  CreatedInvite: () => CreatedInvite,
  ExternalLinks: () => ExternalLinks3,
  GetInviteResponse: () => GetInviteResponse2,
  GetProfileResponse: () => GetProfileResponse3,
  GetSelfProfileResponse: () => GetSelfProfileResponse,
  GetSelfSummaryResponse: () => GetSelfSummaryResponse,
  GetSummaryResponse: () => GetSummaryResponse2,
  Handle: () => Handle4,
  Invite: () => Invite,
  InviteAlias: () => InviteAlias,
  InviteExternalLinks: () => InviteExternalLinks,
  JoinInvite: () => JoinInvite,
  JoinRequest: () => JoinRequest2,
  JoinResponse: () => JoinResponse,
  MatchmakerLobby: () => MatchmakerLobby,
  MemberState: () => MemberState,
  MemberStateMatchmakerLobby: () => MemberStateMatchmakerLobby,
  MemberSummary: () => MemberSummary,
  Profile: () => Profile3,
  Publicity: () => Publicity3,
  PublicityLevel: () => PublicityLevel2,
  SetPublicityRequest: () => SetPublicityRequest,
  Summary: () => Summary4,
  activity: () => activity_exports2,
  common: () => common_exports23,
  parties: () => parties_exports2
});
var init_party = __esm({
  "src/serialization/resources/party/index.ts"() {
    "use strict";
    init_resources17();
  }
});

// src/serialization/resources/upload/resources/common/types/PresignedRequest.ts
var PresignedRequest;
var init_PresignedRequest = __esm({
  "src/serialization/resources/upload/resources/common/types/PresignedRequest.ts"() {
    "use strict";
    init_core();
    PresignedRequest = schemas_exports.object({
      path: schemas_exports.string(),
      url: schemas_exports.string()
    });
  }
});

// src/serialization/resources/upload/resources/common/types/PrepareFile.ts
var PrepareFile;
var init_PrepareFile = __esm({
  "src/serialization/resources/upload/resources/common/types/PrepareFile.ts"() {
    "use strict";
    init_core();
    PrepareFile = schemas_exports.object({
      path: schemas_exports.string(),
      contentType: schemas_exports.property("content_type", schemas_exports.string().optional()),
      contentLength: schemas_exports.property("content_length", schemas_exports.number())
    });
  }
});

// src/serialization/resources/upload/resources/common/types/index.ts
var init_types49 = __esm({
  "src/serialization/resources/upload/resources/common/types/index.ts"() {
    "use strict";
    init_PresignedRequest();
    init_PrepareFile();
  }
});

// src/serialization/resources/upload/resources/common/index.ts
var common_exports24 = {};
__export(common_exports24, {
  PrepareFile: () => PrepareFile,
  PresignedRequest: () => PresignedRequest
});
var init_common12 = __esm({
  "src/serialization/resources/upload/resources/common/index.ts"() {
    "use strict";
    init_types49();
  }
});

// src/serialization/resources/upload/resources/index.ts
var init_resources18 = __esm({
  "src/serialization/resources/upload/resources/index.ts"() {
    "use strict";
    init_common12();
    init_types49();
  }
});

// src/serialization/resources/upload/index.ts
var upload_exports2 = {};
__export(upload_exports2, {
  PrepareFile: () => PrepareFile,
  PresignedRequest: () => PresignedRequest,
  common: () => common_exports24
});
var init_upload = __esm({
  "src/serialization/resources/upload/index.ts"() {
    "use strict";
    init_resources18();
  }
});

// src/serialization/resources/index.ts
var init_resources19 = __esm({
  "src/serialization/resources/index.ts"() {
    "use strict";
    init_chat();
    init_cloud();
    init_group();
    init_identity3();
    init_kv2();
    init_captcha();
    init_common7();
    init_types39();
    init_game();
    init_geo();
    init_matchmaker3();
    init_party();
    init_upload();
  }
});

// src/serialization/index.ts
var serialization_exports = {};
__export(serialization_exports, {
  AccountNumber: () => AccountNumber,
  Bio: () => Bio,
  DisplayName: () => DisplayName,
  Email: () => Email,
  EmptyObject: () => EmptyObject,
  ErrorBody: () => ErrorBody,
  ErrorMetadata: () => ErrorMetadata,
  Identifier: () => Identifier,
  Jwt: () => Jwt,
  ValidationError: () => ValidationError5,
  WatchQuery: () => WatchQuery,
  WatchResponse: () => WatchResponse,
  captcha: () => captcha_exports2,
  chat: () => chat_exports2,
  cloud: () => cloud_exports2,
  common: () => common_exports19,
  game: () => game_exports2,
  geo: () => geo_exports2,
  group: () => group_exports2,
  identity: () => identity_exports6,
  kv: () => kv_exports4,
  matchmaker: () => matchmaker_exports7,
  party: () => party_exports2,
  upload: () => upload_exports2
});
var init_serialization = __esm({
  "src/serialization/index.ts"() {
    "use strict";
    init_resources19();
  }
});

// src/api/index.ts
var api_exports = {};
__export(api_exports, {
  BadRequestError: () => BadRequestError,
  ForbiddenError: () => ForbiddenError,
  InternalError: () => InternalError,
  NotFoundError: () => NotFoundError,
  RateLimitError: () => RateLimitError,
  UnauthorizedError: () => UnauthorizedError,
  captcha: () => captcha_exports,
  chat: () => chat_exports,
  cloud: () => cloud_exports,
  common: () => common_exports7,
  game: () => game_exports,
  geo: () => geo_exports,
  group: () => group_exports,
  identity: () => identity_exports3,
  kv: () => kv_exports2,
  matchmaker: () => matchmaker_exports3,
  party: () => party_exports,
  upload: () => upload_exports
});

// src/api/resources/chat/index.ts
var chat_exports = {};
__export(chat_exports, {
  QueryDirection: () => QueryDirection,
  common: () => common_exports,
  identity: () => identity_exports
});

// src/api/resources/chat/resources/common/index.ts
var common_exports = {};
__export(common_exports, {
  QueryDirection: () => QueryDirection
});

// src/api/resources/chat/resources/common/types/QueryDirection.ts
var QueryDirection = {
  Before: "before",
  After: "after",
  BeforeAndAfter: "before_and_after"
};

// src/api/resources/chat/resources/identity/index.ts
var identity_exports = {};

// src/api/resources/cloud/index.ts
var cloud_exports = {};
__export(cloud_exports, {
  AnalyticsVariantQuery: () => AnalyticsVariantQuery,
  CdnAuthType: () => CdnAuthType,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus,
  GroupBillingStatus: () => GroupBillingStatus,
  auth: () => auth_exports,
  common: () => common_exports3,
  devices: () => devices_exports,
  games: () => games_exports2,
  groups: () => groups_exports,
  logs: () => logs_exports2,
  tiers: () => tiers_exports,
  uploads: () => uploads_exports,
  version: () => version_exports
});

// src/api/resources/cloud/resources/games/index.ts
var games_exports2 = {};
__export(games_exports2, {
  LogStream: () => LogStream,
  avatars: () => avatars_exports,
  builds: () => builds_exports,
  cdn: () => cdn_exports,
  games: () => games_exports,
  matchmaker: () => matchmaker_exports,
  namespaces: () => namespaces_exports,
  tokens: () => tokens_exports,
  versions: () => versions_exports
});

// src/api/resources/cloud/resources/games/resources/namespaces/index.ts
var namespaces_exports = {};
__export(namespaces_exports, {
  analytics: () => analytics_exports,
  logs: () => logs_exports
});

// src/api/resources/cloud/resources/games/resources/namespaces/resources/analytics/index.ts
var analytics_exports = {};

// src/api/resources/cloud/resources/games/resources/namespaces/resources/logs/index.ts
var logs_exports = {};

// src/api/resources/cloud/resources/games/resources/avatars/index.ts
var avatars_exports = {};

// src/api/resources/cloud/resources/games/resources/builds/index.ts
var builds_exports = {};

// src/api/resources/cloud/resources/games/resources/cdn/index.ts
var cdn_exports = {};

// src/api/resources/cloud/resources/games/resources/games/index.ts
var games_exports = {};

// src/api/resources/cloud/resources/games/resources/matchmaker/index.ts
var matchmaker_exports = {};
__export(matchmaker_exports, {
  LogStream: () => LogStream
});

// src/api/resources/cloud/resources/games/resources/matchmaker/types/LogStream.ts
var LogStream = {
  StdOut: "std_out",
  StdErr: "std_err"
};

// src/api/resources/cloud/resources/games/resources/tokens/index.ts
var tokens_exports = {};

// src/api/resources/cloud/resources/games/resources/versions/index.ts
var versions_exports = {};

// src/api/resources/cloud/resources/version/index.ts
var version_exports = {};
__export(version_exports, {
  cdn: () => cdn_exports2,
  identity: () => identity_exports2,
  kv: () => kv_exports,
  matchmaker: () => matchmaker_exports2
});

// src/api/resources/cloud/resources/version/resources/cdn/index.ts
var cdn_exports2 = {};

// src/api/resources/cloud/resources/version/resources/kv/index.ts
var kv_exports = {};

// src/api/resources/cloud/resources/version/resources/matchmaker/index.ts
var matchmaker_exports2 = {};
__export(matchmaker_exports2, {
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel,
  NetworkMode: () => NetworkMode,
  PortProtocol: () => PortProtocol,
  ProxyKind: () => ProxyKind,
  common: () => common_exports2,
  gameMode: () => gameMode_exports,
  lobbyGroup: () => lobbyGroup_exports
});

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/index.ts
var common_exports2 = {};
__export(common_exports2, {
  CaptchaHcaptchaLevel: () => CaptchaHcaptchaLevel,
  NetworkMode: () => NetworkMode,
  PortProtocol: () => PortProtocol,
  ProxyKind: () => ProxyKind
});

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/types/PortProtocol.ts
var PortProtocol = {
  Http: "http",
  Https: "https",
  Tcp: "tcp",
  TcpTls: "tcp_tls",
  Udp: "udp"
};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/types/ProxyKind.ts
var ProxyKind = {
  None: "none",
  GameGuard: "game_guard"
};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/types/CaptchaHcaptchaLevel.ts
var CaptchaHcaptchaLevel = {
  Easy: "easy",
  Moderate: "moderate",
  Difficult: "difficult",
  AlwaysOn: "always_on"
};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/common/types/NetworkMode.ts
var NetworkMode = {
  Bridge: "bridge",
  Host: "host"
};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/gameMode/index.ts
var gameMode_exports = {};

// src/api/resources/cloud/resources/version/resources/matchmaker/resources/lobbyGroup/index.ts
var lobbyGroup_exports = {};

// src/api/resources/cloud/resources/version/resources/identity/index.ts
var identity_exports2 = {};
__export(identity_exports2, {
  pacakge: () => pacakge_exports
});

// src/api/resources/cloud/resources/version/resources/identity/resources/pacakge/index.ts
var pacakge_exports = {};

// src/api/resources/cloud/resources/auth/index.ts
var auth_exports = {};

// src/api/resources/cloud/resources/common/index.ts
var common_exports3 = {};
__export(common_exports3, {
  AnalyticsVariantQuery: () => AnalyticsVariantQuery,
  CdnAuthType: () => CdnAuthType,
  CdnNamespaceDomainVerificationStatus: () => CdnNamespaceDomainVerificationStatus,
  GroupBillingStatus: () => GroupBillingStatus
});

// src/api/resources/cloud/resources/common/types/GroupBillingStatus.ts
var GroupBillingStatus = {
  Succeeded: "succeeded",
  Processing: "processing",
  Refunded: "refunded"
};

// src/api/resources/cloud/resources/common/types/CdnAuthType.ts
var CdnAuthType = {
  None: "none",
  Basic: "basic"
};

// src/api/resources/cloud/resources/common/types/CdnNamespaceDomainVerificationStatus.ts
var CdnNamespaceDomainVerificationStatus = {
  Active: "active",
  Pending: "pending",
  Failed: "failed"
};

// src/api/resources/cloud/resources/common/types/AnalyticsVariantQuery.ts
var AnalyticsVariantQuery = {
  MatchmakerOverview: "matchmaker_overview",
  PlayerCount: "player_count",
  PlayerCountByRegion: "player_count_by_region",
  PlayerCountByGameMode: "player_count_by_game_mode",
  LobbyCount: "lobby_count",
  LobbyCountByRegion: "lobby_count_by_region",
  LobbyCountByGameMode: "lobby_count_by_game_mode",
  AvgPlayDuration: "avg_play_duration",
  AvgPlayDurationByRegion: "avg_play_duration_by_region",
  AvgPlayDurationByGameMode: "avg_play_duration_by_game_mode",
  NewPlayersPerSecond: "new_players_per_second",
  NewLobbiesPerSecond: "new_lobbies_per_second",
  DestroyedLobbiesByFailure: "destroyed_lobbies_by_failure",
  DestroyedLobbiesByExitCode: "destroyed_lobbies_by_exit_code",
  FailedLobbies: "failed_lobbies",
  LobbyReadyTime: "lobby_ready_time",
  IdentityAccounts: "identity_accounts"
};

// src/api/resources/cloud/resources/devices/index.ts
var devices_exports = {};
__export(devices_exports, {
  links: () => links_exports
});

// src/api/resources/cloud/resources/devices/resources/links/index.ts
var links_exports = {};

// src/api/resources/cloud/resources/groups/index.ts
var groups_exports = {};

// src/api/resources/cloud/resources/logs/index.ts
var logs_exports2 = {};

// src/api/resources/cloud/resources/tiers/index.ts
var tiers_exports = {};

// src/api/resources/cloud/resources/uploads/index.ts
var uploads_exports = {};

// src/api/resources/group/index.ts
var group_exports = {};
__export(group_exports, {
  Publicity: () => Publicity,
  common: () => common_exports4,
  invites: () => invites_exports,
  joinRequests: () => joinRequests_exports
});

// src/api/resources/group/resources/common/index.ts
var common_exports4 = {};
__export(common_exports4, {
  Publicity: () => Publicity
});

// src/api/resources/group/resources/common/types/Publicity.ts
var Publicity = {
  Open: "open",
  Closed: "closed"
};

// src/api/resources/group/resources/invites/index.ts
var invites_exports = {};

// src/api/resources/group/resources/joinRequests/index.ts
var joinRequests_exports = {};

// src/api/resources/identity/index.ts
var identity_exports3 = {};
__export(identity_exports3, {
  DevState: () => DevState,
  GameLinkStatus: () => GameLinkStatus,
  Status: () => Status,
  common: () => common_exports5,
  events: () => events_exports,
  links: () => links_exports2
});

// src/api/resources/identity/resources/common/index.ts
var common_exports5 = {};
__export(common_exports5, {
  DevState: () => DevState,
  GameLinkStatus: () => GameLinkStatus,
  Status: () => Status
});

// src/api/resources/identity/resources/common/types/Status.ts
var Status = {
  Online: "online",
  Away: "away",
  Offline: "offline"
};

// src/api/resources/identity/resources/common/types/DevState.ts
var DevState = {
  Inactive: "inactive",
  Pending: "pending",
  Accepted: "accepted"
};

// src/api/resources/identity/resources/common/types/GameLinkStatus.ts
var GameLinkStatus = {
  Incomplete: "incomplete",
  Complete: "complete",
  Cancelled: "cancelled"
};

// src/api/resources/identity/resources/events/index.ts
var events_exports = {};

// src/api/resources/identity/resources/links/index.ts
var links_exports2 = {};

// src/api/resources/kv/index.ts
var kv_exports2 = {};
__export(kv_exports2, {
  common: () => common_exports6
});

// src/api/resources/kv/resources/common/index.ts
var common_exports6 = {};

// src/api/resources/captcha/index.ts
var captcha_exports = {};
__export(captcha_exports, {
  config: () => config_exports
});

// src/api/resources/captcha/resources/config/index.ts
var config_exports = {};

// src/api/resources/common/index.ts
var common_exports7 = {};
__export(common_exports7, {
  BadRequestError: () => BadRequestError,
  ForbiddenError: () => ForbiddenError,
  InternalError: () => InternalError,
  NotFoundError: () => NotFoundError,
  RateLimitError: () => RateLimitError,
  UnauthorizedError: () => UnauthorizedError
});

// src/errors/RivetError.ts
var RivetError = class extends Error {
  statusCode;
  body;
  constructor({ message, statusCode, body }) {
    super(message);
    Object.setPrototypeOf(this, RivetError.prototype);
    if (statusCode != null) {
      this.statusCode = statusCode;
    }
    if (body !== void 0) {
      this.body = body;
    }
  }
};

// src/errors/RivetTimeoutError.ts
var RivetTimeoutError = class extends Error {
  constructor() {
    super("Timeout");
    Object.setPrototypeOf(this, RivetTimeoutError.prototype);
  }
};

// src/api/resources/common/errors/InternalError.ts
var InternalError = class extends RivetError {
  constructor(body) {
    super({
      message: "InternalError",
      statusCode: 500,
      body
    });
    Object.setPrototypeOf(this, InternalError.prototype);
  }
};

// src/api/resources/common/errors/RateLimitError.ts
var RateLimitError = class extends RivetError {
  constructor(body) {
    super({
      message: "RateLimitError",
      statusCode: 429,
      body
    });
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
};

// src/api/resources/common/errors/ForbiddenError.ts
var ForbiddenError = class extends RivetError {
  constructor(body) {
    super({
      message: "ForbiddenError",
      statusCode: 403,
      body
    });
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
};

// src/api/resources/common/errors/UnauthorizedError.ts
var UnauthorizedError = class extends RivetError {
  constructor(body) {
    super({
      message: "UnauthorizedError",
      statusCode: 408,
      body
    });
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
};

// src/api/resources/common/errors/NotFoundError.ts
var NotFoundError = class extends RivetError {
  constructor(body) {
    super({
      message: "NotFoundError",
      statusCode: 404,
      body
    });
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
};

// src/api/resources/common/errors/BadRequestError.ts
var BadRequestError = class extends RivetError {
  constructor(body) {
    super({
      message: "BadRequestError",
      statusCode: 400,
      body
    });
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
};

// src/api/resources/game/index.ts
var game_exports = {};
__export(game_exports, {
  StatAggregationMethod: () => StatAggregationMethod,
  StatFormatMethod: () => StatFormatMethod,
  StatSortingMethod: () => StatSortingMethod,
  common: () => common_exports8
});

// src/api/resources/game/resources/common/index.ts
var common_exports8 = {};
__export(common_exports8, {
  StatAggregationMethod: () => StatAggregationMethod,
  StatFormatMethod: () => StatFormatMethod,
  StatSortingMethod: () => StatSortingMethod
});

// src/api/resources/game/resources/common/types/StatFormatMethod.ts
var StatFormatMethod = {
  Integer: "integer",
  Float1: "float_1",
  Float2: "float_2",
  Float3: "float_3",
  DurationMinute: "duration_minute",
  DurationSecond: "duration_second",
  DurationHundredthSecond: "duration_hundredth_second"
};

// src/api/resources/game/resources/common/types/StatAggregationMethod.ts
var StatAggregationMethod = {
  Sum: "sum",
  Average: "average",
  Min: "min",
  Max: "max"
};

// src/api/resources/game/resources/common/types/StatSortingMethod.ts
var StatSortingMethod = {
  Desc: "desc",
  Asc: "asc"
};

// src/api/resources/geo/index.ts
var geo_exports = {};
__export(geo_exports, {
  common: () => common_exports9
});

// src/api/resources/geo/resources/common/index.ts
var common_exports9 = {};

// src/api/resources/matchmaker/index.ts
var matchmaker_exports3 = {};
__export(matchmaker_exports3, {
  common: () => common_exports10,
  lobbies: () => lobbies_exports,
  players: () => players_exports,
  regions: () => regions_exports
});

// src/api/resources/matchmaker/resources/common/index.ts
var common_exports10 = {};

// src/api/resources/matchmaker/resources/lobbies/index.ts
var lobbies_exports = {};

// src/api/resources/matchmaker/resources/players/index.ts
var players_exports = {};

// src/api/resources/matchmaker/resources/regions/index.ts
var regions_exports = {};

// src/api/resources/party/index.ts
var party_exports = {};
__export(party_exports, {
  PublicityLevel: () => PublicityLevel,
  activity: () => activity_exports,
  common: () => common_exports11,
  parties: () => parties_exports
});

// src/api/resources/party/resources/activity/index.ts
var activity_exports = {};
__export(activity_exports, {
  matchmaker: () => matchmaker_exports4
});

// src/api/resources/party/resources/activity/resources/matchmaker/index.ts
var matchmaker_exports4 = {};

// src/api/resources/party/resources/common/index.ts
var common_exports11 = {};
__export(common_exports11, {
  PublicityLevel: () => PublicityLevel
});

// src/api/resources/party/resources/common/types/PublicityLevel.ts
var PublicityLevel = {
  None: "none",
  View: "view",
  Join: "join"
};

// src/api/resources/party/resources/parties/index.ts
var parties_exports = {};

// src/api/resources/upload/index.ts
var upload_exports = {};
__export(upload_exports, {
  common: () => common_exports12
});

// src/api/resources/upload/resources/common/index.ts
var common_exports12 = {};

// src/environments.ts
var RivetEnvironment = {
  Production: {
    admin: "https://admin.api.rivet.gg/v1",
    auth: "https://auth.api.rivet.gg/v1",
    chat: "https://chat.api.rivet.gg/v1",
    cloud: "https://cloud.api.rivet.gg/v1",
    group: "https://group.api.rivet.gg/v1",
    identity: "https://identity.api.rivet.gg/v1",
    job: "https://job.api.rivet.gg/v1",
    kv: "https://kv.api.rivet.gg/v1",
    matchmaker: "https://matchmaker.api.rivet.gg/v1",
    party: "https://party.api.rivet.gg/v1",
    portal: "https://portal.api.rivet.gg/v1"
  }
};

// src/api/resources/chat/client/Client.ts
init_core();
var import_url_join2 = __toESM(require_url_join());
init_serialization();

// src/api/resources/chat/resources/identity/client/Client.ts
init_core();
var import_url_join = __toESM(require_url_join());
init_serialization();
var Identity = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a thread ID with a given identity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getDirectThread(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `/identities/${identityId}/thread`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await chat_exports2.GetDirectThreadResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/chat/client/Client.ts
var Chat = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Sends a chat message to a given topic.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async sendMessage(request) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)((this.options.environment ?? RivetEnvironment.Production).chat, "messages"),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await chat_exports2.SendMessageRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await chat_exports2.SendMessageResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns message history for a given thread in a certain direction.
   * Defaults to querying messages before ts.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getThreadHistory(threadId, request) {
    const { ts, count, queryDirection } = request;
    const _queryParams = new URLSearchParams();
    if (ts != null) {
      _queryParams.append("ts", ts.toISOString());
    }
    _queryParams.append("count", count.toString());
    if (queryDirection != null) {
      _queryParams.append("query_direction", queryDirection);
    }
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/history`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await chat_exports2.GetThreadHistoryResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches all relevant changes from a thread that have happened since the
   * given watch index.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async watchThread(threadId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/live`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await chat_exports2.WatchThreadResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the current identity's last read timestamp in the given thread.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setThreadRead(threadId, request) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/read`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await chat_exports2.SetThreadReadRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches the topic of a thread.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getThreadTopic(threadId) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/topic`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await chat_exports2.GetThreadTopicResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the current identity's typing status in the given thread.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setTypingStatus(threadId, request) {
    const _response = await fetcher({
      url: (0, import_url_join2.default)(
        (this.options.environment ?? RivetEnvironment.Production).chat,
        `threads/${threadId}/typing-status`
      ),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await chat_exports2.SetTypingStatusRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _identity;
  get identity() {
    return this._identity ??= new Identity(this.options);
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/namespaces/client/Client.ts
init_core();
var import_url_join5 = __toESM(require_url_join());
init_serialization();

// src/api/resources/cloud/resources/games/resources/namespaces/resources/analytics/client/Client.ts
init_core();
var import_url_join3 = __toESM(require_url_join());
init_serialization();
var Analytics = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns live information about all active lobies for a given namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getAnalyticsMatchmakerLive(gameId, namespaceId) {
    const _response = await fetcher({
      url: (0, import_url_join3.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/namespaces/${namespaceId}/analytics/matchmaker/live`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.GetAnalyticsMatchmakerLiveResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true
        }
      );
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/namespaces/resources/logs/client/Client.ts
init_core();
var import_url_join4 = __toESM(require_url_join());
init_serialization();
var Logs = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of lobbies for the given game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listNamespaceLobbies(gameId, namespaceId, request = {}) {
    const { beforeCreateTs } = request;
    const _queryParams = new URLSearchParams();
    if (beforeCreateTs != null) {
      _queryParams.append("before_create_ts", beforeCreateTs.toISOString());
    }
    const _response = await fetcher({
      url: (0, import_url_join4.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/namespaces/${namespaceId}/logs/lobbies`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ListNamespaceLobbiesResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a lobby from the given game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getNamespaceLobby(gameId, namespaceId, lobbyId) {
    const _response = await fetcher({
      url: (0, import_url_join4.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/namespaces/${namespaceId}/logs/lobbies/${lobbyId}`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.GetNamespaceLobbyResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/namespaces/client/Client.ts
var Namespaces = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Creates a new namespace for the given game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createGameNamespace(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.CreateGameNamespaceRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.CreateGameNamespaceResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validateGameNamespace(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/validate`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.ValidateGameNamespaceRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ValidateGameNamespaceResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Gets a game namespace by namespace ID.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getGameNamespaceById(gameId, namespaceId) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.GetGameNamespaceByIdResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Adds an authenticated user to the given game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async updateNamespaceCdnAuthUser(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/auth-user`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.UpdateNamespaceCdnAuthUserRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Removes an authenticated user from the given game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async removeNamespaceCdnAuthUser(gameId, namespaceId, user) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/auth-user/${user}`
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the CDN authentication type of the given game namesapce.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setNamespaceCdnAuthType(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/cdn-auth`
      ),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.SetNamespaceCdnAuthTypeRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Toggles whether or not to allow authentication based on domain for the given game namesapce.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async toggleNamespaceDomainPublicAuth(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/domain-public-auth`
      ),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.ToggleNamespaceDomainPublicAuthRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Adds a domain to the given game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async addNamespaceDomain(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/domains`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.AddNamespaceDomainRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Removes a domain from the given game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async removeNamespaceDomain(gameId, namespaceId, domain) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/domains/${domain}`
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates matchmaker config for the given game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async updateGameNamespaceMatchmakerConfig(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/mm-config`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.UpdateGameNamespaceMatchmakerConfigRequest.jsonOrThrow(
        request,
        { unrecognizedObjectKeys: "strip" }
      )
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Gets the version history for a given namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getGameNamespaceVersionHistoryList(gameId, namespaceId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/version-history`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.GetGameNamespaceVersionHistoryResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true
        }
      );
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to update a game namespace's matchmaker config.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validateGameNamespaceMatchmakerConfig(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/mm-config/validate`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.ValidateGameNamespaceMatchmakerConfigRequest.jsonOrThrow(
        request,
        { unrecognizedObjectKeys: "strip" }
      )
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ValidateGameNamespaceMatchmakerConfigResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true
        }
      );
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a development token for the given namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createGameNamespaceTokenDevelopment(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/tokens/development`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.CreateGameNamespaceTokenDevelopmentRequest.jsonOrThrow(
        request,
        { unrecognizedObjectKeys: "strip" }
      )
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.CreateGameNamespaceTokenDevelopmentResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true
        }
      );
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game namespace development token.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validateGameNamespaceTokenDevelopment(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/tokens/development/validate`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.ValidateGameNamespaceTokenDevelopmentRequest.jsonOrThrow(
        request,
        { unrecognizedObjectKeys: "strip" }
      )
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.ValidateGameNamespaceTokenDevelopmentResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true
        }
      );
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a public token for the given namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createGameNamespaceTokenPublic(gameId, namespaceId) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/tokens/public`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.namespaces.CreateGameNamespaceTokenPublicResponse.parseOrThrow(
        _response.body,
        {
          unrecognizedObjectKeys: "passthrough",
          allowUnrecognizedUnionMembers: true,
          allowUnrecognizedEnumValues: true
        }
      );
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the version of a game namespace.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async updateGameNamespaceVersion(gameId, namespaceId, request) {
    const _response = await fetcher({
      url: (0, import_url_join5.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/namespaces/${namespaceId}/version`
      ),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.namespaces.UpdateGameNamespaceVersionRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _analytics;
  get analytics() {
    return this._analytics ??= new Analytics(this.options);
  }
  _logs;
  get logs() {
    return this._logs ??= new Logs(this.options);
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/avatars/client/Client.ts
init_core();
var import_url_join6 = __toESM(require_url_join());
init_serialization();
var Avatars = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Lists custom avatars for the given game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listGameCustomAvatars(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join6.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/avatars`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.ListGameCustomAvatarsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares a custom avatar image upload.
   * Complete upload with `rivet.api.cloud#CompleteCustomAvatarUpload`.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async prepareCustomAvatarUpload(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join6.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/prepare`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.PrepareCustomAvatarUploadRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.PrepareCustomAvatarUploadResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes a custom avatar image upload. Must be called after the file upload process completes.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async completeCustomAvatarUpload(gameId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join6.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/avatar-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/builds/client/Client.ts
init_core();
var import_url_join7 = __toESM(require_url_join());
init_serialization();
var Builds = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Lists game builds for the given game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listGameBuilds(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join7.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/builds`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.ListGameBuildsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new game build for the given game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createGameBuild(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join7.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/builds`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.CreateGameBuildRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameBuildResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/cdn/client/Client.ts
init_core();
var import_url_join8 = __toESM(require_url_join());
init_serialization();
var Cdn = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Lists CDN sites for a game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listGameCdnSites(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/cdn/sites`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.ListGameCdnSitesResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new CDN site for the given game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createGameCdnSite(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join8.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/cdn/sites`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.CreateGameCdnSiteRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameCdnSiteResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/games/client/Client.ts
init_core();
var import_url_join9 = __toESM(require_url_join());
init_serialization();
var Games = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of games in which the current identity is a group member of its development team.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getGames(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join9.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/games"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetGamesResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createGame(request) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/games"),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.CreateGameRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validateGame(request) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/games/validate"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.ValidateGameRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.ValidateGameResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a game by its game id.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getGameById(gameId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetGameByIdResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares a game banner image upload.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async gameBannerUploadPrepare(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/banner-upload/prepare`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.GameBannerUploadPrepareRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.GameBannerUploadPrepareResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes an game banner image upload. Must be called after the file upload process completes.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async gameBannerUploadComplete(gameId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/banner-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares a game logo image upload.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async gameLogoUploadPrepare(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/logo-upload/prepare`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.GameLogoUploadPrepareRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.GameLogoUploadPrepareResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes a game logo image upload. Must be called after the file upload process completes.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async gameLogoUploadComplete(gameId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/logo-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getAnalytics(request) {
    const { queryStart, queryEnd, gameIds, namespaceIds, variants } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("query_start", queryStart.toISOString());
    _queryParams.append("query_end", queryEnd.toISOString());
    if (gameIds != null) {
      if (Array.isArray(gameIds)) {
        for (const _item of gameIds) {
          _queryParams.append("game_ids", _item);
        }
      } else {
        _queryParams.append("game_ids", gameIds);
      }
    }
    if (namespaceIds != null) {
      if (Array.isArray(namespaceIds)) {
        for (const _item of namespaceIds) {
          _queryParams.append("namespace_ids", _item);
        }
      } else {
        _queryParams.append("namespace_ids", namespaceIds);
      }
    }
    if (Array.isArray(variants)) {
      for (const _item of variants) {
        _queryParams.append("variants", _item);
      }
    } else {
      _queryParams.append("variants", variants);
    }
    const _response = await fetcher({
      url: (0, import_url_join9.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/games/namespaces/analytics"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetAnalyticsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/matchmaker/client/Client.ts
init_core();
var import_url_join10 = __toESM(require_url_join());
init_serialization();
var Matchmaker = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Exports lobby history over a given query time span.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async exportMatchmakerLobbyHistory(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join10.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies/export-history`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.ExportMatchmakerLobbyHistoryRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.ExportMatchmakerLobbyHistoryResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Deletes a matchmaker lobby, stopping it immediately.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async deleteMatchmakerLobby(gameId, lobbyId) {
    const _response = await fetcher({
      url: (0, import_url_join10.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies/${lobbyId}`
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.DeleteMatchmakerLobbyResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns the logs for a given lobby.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getLobbyLogs(gameId, lobbyId, request) {
    const { stream, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("stream", stream);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join10.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies/${lobbyId}/logs`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetLobbyLogsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Generates a download URL for logs.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async exportLobbyLogs(gameId, lobbyId, request) {
    const _response = await fetcher({
      url: (0, import_url_join10.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/matchmaker/lobbies/${lobbyId}/logs/export`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.ExportLobbyLogsRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.ExportLobbyLogsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/tokens/client/Client.ts
init_core();
var import_url_join11 = __toESM(require_url_join());
init_serialization();
var Tokens = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Creates a new game cloud token.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createCloudToken(gameId) {
    const _response = await fetcher({
      url: (0, import_url_join11.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `games/${gameId}/tokens/cloud`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateCloudTokenResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/resources/versions/client/Client.ts
init_core();
var import_url_join12 = __toESM(require_url_join());
init_serialization();
var Versions = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Creates a new game version.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createGameVersion(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/versions`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.CreateGameVersionRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.CreateGameVersionResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validates information used to create a new game version.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validateGameVersion(gameId, request) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/versions/validate`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.games.ValidateGameVersionRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.games.ValidateGameVersionResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a game version by its version ID.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getGameVersionById(gameId, versionId) {
    const _response = await fetcher({
      url: (0, import_url_join12.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/games/${gameId}/versions/${versionId}`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.games.GetGameVersionByIdResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/games/client/Client.ts
var Games2 = class {
  constructor(options) {
    this.options = options;
  }
  _namespaces;
  get namespaces() {
    return this._namespaces ??= new Namespaces(this.options);
  }
  _avatars;
  get avatars() {
    return this._avatars ??= new Avatars(this.options);
  }
  _builds;
  get builds() {
    return this._builds ??= new Builds(this.options);
  }
  _cdn;
  get cdn() {
    return this._cdn ??= new Cdn(this.options);
  }
  _games;
  get games() {
    return this._games ??= new Games(this.options);
  }
  _matchmaker;
  get matchmaker() {
    return this._matchmaker ??= new Matchmaker(this.options);
  }
  _tokens;
  get tokens() {
    return this._tokens ??= new Tokens(this.options);
  }
  _versions;
  get versions() {
    return this._versions ??= new Versions(this.options);
  }
};

// src/api/resources/cloud/resources/auth/client/Client.ts
init_core();
var import_url_join13 = __toESM(require_url_join());
init_serialization();
var Auth = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns information about the current authenticated agent.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async inspect() {
    const _response = await fetcher({
      url: (0, import_url_join13.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/auth/inspect"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.InspectResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/devices/resources/links/client/Client.ts
init_core();
var import_url_join14 = __toESM(require_url_join());
init_serialization();
var Links = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async prepare() {
    const _response = await fetcher({
      url: (0, import_url_join14.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/devices/links"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.devices.PrepareDeviceLinkResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async get(request) {
    const { deviceLinkToken, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("device_link_token", deviceLinkToken);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join14.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/devices/links"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.devices.GetDeviceLinkResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/devices/client/Client.ts
var Devices = class {
  constructor(options) {
    this.options = options;
  }
  _links;
  get links() {
    return this._links ??= new Links(this.options);
  }
};

// src/api/resources/cloud/resources/groups/client/Client.ts
init_core();
var import_url_join15 = __toESM(require_url_join());
init_serialization();
var Groups = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Validates information used to create a new group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validate(request) {
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        "/groups/validate"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.ValidateGroupRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.ValidateGroupResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns billing information for the given group over the given query time span.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getBilling(groupId, request = {}) {
    const { queryStart, queryEnd } = request;
    const _queryParams = new URLSearchParams();
    if (queryStart != null) {
      _queryParams.append("query_start", queryStart.toISOString());
    }
    if (queryEnd != null) {
      _queryParams.append("query_end", queryEnd.toISOString());
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetBillingResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a list of invoices for the given group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getInvoicesList(groupId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing/invoices`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetInvoicesListResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a list of payments for the given group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getPaymentsList(groupId, request = {}) {
    const { startPaymentId } = request;
    const _queryParams = new URLSearchParams();
    if (startPaymentId != null) {
      _queryParams.append("start_payment_id", startPaymentId);
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing/payments`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetPaymentsListResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a list of bank transfers for the given group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getTransfersList(groupId, request = {}) {
    const { startTransferId } = request;
    const _queryParams = new URLSearchParams();
    if (startTransferId != null) {
      _queryParams.append("start_transfer_id", startTransferId);
    }
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/billing/transfers`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await cloud_exports2.GetTransfersListResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a checkout session for the given group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async billingCheckout(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/checkout`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await cloud_exports2.GroupBillingCheckoutRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await cloud_exports2.GroupBillingCheckoutResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Converts the given group into a developer group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async convertGroup(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join15.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/groups/${groupId}/convert`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/logs/client/Client.ts
init_core();
var import_url_join16 = __toESM(require_url_join());
init_serialization();
var Logs2 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns performance information about a Rivet Ray.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getRayPerfLogs(rayId) {
    const _response = await fetcher({
      url: (0, import_url_join16.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/rays/${rayId}/perf`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.GetRayPerfLogsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/tiers/client/Client.ts
init_core();
var import_url_join17 = __toESM(require_url_join());
init_serialization();
var Tiers = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns all available region tiers.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getRegionTiers() {
    const _response = await fetcher({
      url: (0, import_url_join17.default)((this.options.environment ?? RivetEnvironment.Production).cloud, "/region-tiers"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await cloud_exports2.GetRegionTiersResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/resources/uploads/client/Client.ts
init_core();
var import_url_join18 = __toESM(require_url_join());
init_serialization();
var Uploads = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Marks an upload as complete.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async completeUpload(uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join18.default)(
        (this.options.environment ?? RivetEnvironment.Production).cloud,
        `/uploads/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/cloud/client/Client.ts
var Cloud = class {
  constructor(options) {
    this.options = options;
  }
  _games;
  get games() {
    return this._games ??= new Games2(this.options);
  }
  _auth;
  get auth() {
    return this._auth ??= new Auth(this.options);
  }
  _devices;
  get devices() {
    return this._devices ??= new Devices(this.options);
  }
  _groups;
  get groups() {
    return this._groups ??= new Groups(this.options);
  }
  _logs;
  get logs() {
    return this._logs ??= new Logs2(this.options);
  }
  _tiers;
  get tiers() {
    return this._tiers ??= new Tiers(this.options);
  }
  _uploads;
  get uploads() {
    return this._uploads ??= new Uploads(this.options);
  }
};

// src/api/resources/group/client/Client.ts
init_core();
var import_url_join21 = __toESM(require_url_join());
init_serialization();

// src/api/resources/group/resources/invites/client/Client.ts
init_core();
var import_url_join19 = __toESM(require_url_join());
init_serialization();
var Invites = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Inspects a group invite returning information about the team that created it.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getInvite(groupInviteCode) {
    const _response = await fetcher({
      url: (0, import_url_join19.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `invites/${groupInviteCode}`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await group_exports2.GetInviteResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Consumes a group invite to join a group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async consumeInvite(groupInviteCode) {
    const _response = await fetcher({
      url: (0, import_url_join19.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `invites/${groupInviteCode}/consume`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await group_exports2.ConsumeInviteResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a group invite. Can be shared with other identities to let them join this group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createInvite(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join19.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `groups/${groupId}/invites`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await group_exports2.CreateInviteRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await group_exports2.CreateInviteResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/group/resources/joinRequests/client/Client.ts
init_core();
var import_url_join20 = __toESM(require_url_join());
init_serialization();
var JoinRequests = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Requests to join a group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createJoinRequest(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join20.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/join-request`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Resolves a join request for a given group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async resolveJoinRequest(groupId, identityId, request) {
    const _response = await fetcher({
      url: (0, import_url_join20.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/join-request/${identityId}`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await group_exports2.ResolveJoinRequestRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/group/client/Client.ts
var Group2 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of suggested groups.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listSuggested(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)((this.options.environment ?? RivetEnvironment.Production).group, "/groups"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.ListSuggestedResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async create(request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)((this.options.environment ?? RivetEnvironment.Production).group, "/groups"),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await group_exports2.CreateRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await group_exports2.CreateResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares an avatar image upload.
   * Complete upload with `rivet.api.group#CompleteAvatarUpload`.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async prepareAvatarUpload(request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        "/groups/avatar-upload/prepare"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await group_exports2.PrepareAvatarUploadRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await group_exports2.PrepareAvatarUploadResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validate contents of group profile. Use to provide immediate feedback on profile changes before committing them.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validateProfile(request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        "/groups/profile/validate"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await group_exports2.ValidateProfileRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await group_exports2.ValidateProfileResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fuzzy search for groups.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async search(request) {
    const { query, anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("query", query);
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        "/groups/search"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.SearchResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes an avatar image upload. Must be called after the file upload
   * process completes.
   * Call `rivet.api.group#PrepareAvatarUpload` first.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async completeAvatarUpload(groupId, uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/avatar-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group's bans. Must have valid permissions to view.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getBans(groupId, request = {}) {
    const { anchor, count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/bans`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetBansResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Bans an identity from a group. Must be the owner of the group to perform this action. The banned identity will no longer be able to create a join request or use a group invite.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async banIdentity(groupId, identityId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/bans/${identityId}`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Unbans an identity from a group. Must be the owner of the group to perform this action.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async unbanIdentity(groupId, identityId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/bans/${identityId}`
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group's join requests. Must have valid permissions to view.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getJoinRequests(groupId, request = {}) {
    const { anchor, count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/join-requests`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetJoinRequestsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Kicks an identity from a group. Must be the owner of the group to perform this action.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async kickMember(groupId, identityId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/kick/${identityId}`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Leaves a group.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async leave(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/leave`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group's members.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getMembers(groupId, request = {}) {
    const { anchor, count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/members`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetMembersResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a group profile.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getProfile(groupId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/profile`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await group_exports2.GetProfileResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async updateProfile(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/profile`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await group_exports2.UpdateProfileRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getSummary(groupId) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/summary`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await group_exports2.GetSummaryResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Transfers ownership of a group to another identity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async transferOwnership(groupId, request) {
    const _response = await fetcher({
      url: (0, import_url_join21.default)(
        (this.options.environment ?? RivetEnvironment.Production).group,
        `/groups/${groupId}/transfer-owner`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await group_exports2.TransferOwnershipRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _invites;
  get invites() {
    return this._invites ??= new Invites(this.options);
  }
  _joinRequests;
  get joinRequests() {
    return this._joinRequests ??= new JoinRequests(this.options);
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/identity/client/Client.ts
init_core();
var import_url_join24 = __toESM(require_url_join());
init_serialization();

// src/api/resources/identity/resources/events/client/Client.ts
init_core();
var import_url_join22 = __toESM(require_url_join());
init_serialization();
var Events = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns all events relative to the current identity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async watch(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join22.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/events/live"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.WatchEventsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/identity/resources/links/client/Client.ts
init_core();
var import_url_join23 = __toESM(require_url_join());
init_serialization();
var Links2 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Begins the process for linking an identity with the Rivet Hub.
   * # Importance of Linking Identities
   * When an identity is created via `rivet.api.identity#SetupIdentity`, the identity is temporary
   * and is not shared with other games the user plays.
   * In order to make the identity permanent and synchronize the identity with
   * other games, the identity must be linked with the hub.
   * # Linking Process
   * The linking process works by opening `identity_link_url` in a browser then polling
   * `rivet.api.identity#GetGameLink` to wait for it to complete.
   * This is designed to be as flexible as possible so `identity_link_url` can be opened
   * on any device. For example, when playing a console game, the user can scan a
   * QR code for `identity_link_url` to authenticate on their phone.
   *
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async prepare() {
    const _response = await fetcher({
      url: (0, import_url_join23.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/game-links"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await identity_exports6.PrepareGameLinkResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns the current status of a linking process. Once `status` is `complete`, the identity's profile should be fetched again since they may have switched accounts.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async get(request) {
    const { identityLinkToken, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("identity_link_token", identityLinkToken);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join23.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/game-links"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetGameLinkResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/identity/client/Client.ts
var Identity2 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Gets or creates an identity.
   * Passing an existing identity token in the body refreshes the token.
   * Temporary Accounts
   * Until the identity is linked with the Rivet Hub (see `PrepareGameLink`), this identity will be temporary but still behave like all other identities.
   * This is intended to allow users to play the game without signing up while still having the benefits of having an account. When they are ready to save their account, they should be instructed to link their account (see `PrepareGameLink`).
   * Storing Token
   * `identity_token` should be stored in some form of persistent storage. The token should be read from storage and passed to `Setup` every time the client starts.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setup(request = {}) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.SetupRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await identity_exports6.SetupResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches an identity profile.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getProfile(identityId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/profile`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetProfileResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches the current identity's profile.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getSelfProfile(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/profile"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetProfileResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches a list of identity handles.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getHandles(request) {
    const { identityIds } = request;
    const _queryParams = new URLSearchParams();
    if (Array.isArray(identityIds)) {
      for (const _item of identityIds) {
        _queryParams.append("identity_ids", _item);
      }
    } else {
      _queryParams.append("identity_ids", identityIds);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/batch/handle"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetHandlesResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fetches a list of identity summaries.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getSummaries(request) {
    const { identityIds } = request;
    const _queryParams = new URLSearchParams();
    if (Array.isArray(identityIds)) {
      for (const _item of identityIds) {
        _queryParams.append("identity_ids", _item);
      }
    } else {
      _queryParams.append("identity_ids", identityIds);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/batch/summary"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.GetSummariesResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates profile of the current identity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async updateProfile(request = {}) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/profile"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.UpdateProfileRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Validate contents of identity profile. Use to provide immediate feedback on profile changes before committing them.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async validateProfile(request = {}) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/profile/validate"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.ValidateProfileRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Fuzzy search for identities.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async search(request) {
    const { query, anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("query", query);
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit.toString());
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/search"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.SearchResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Sets the current identity's game activity. This activity will automatically be removed when the identity goes offline.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setGameActivity(request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/activity"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.SetGameActivityRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Removes the current identity's game activity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async removeGameActivity() {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/activity"
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Updates the current identity's status.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async updateStatus(request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/identities/self/status"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.UpdateStatusRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Follows the given identity. In order for identities to be "friends", the other identity has to also follow this identity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async follow(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/follow`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Unfollows the given identity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async unfollow(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/follow`
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Prepares an avatar image upload. Complete upload with `CompleteIdentityAvatarUpload`.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async prepareAvatarUpload(request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/avatar-upload/prepare"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.PrepareAvatarUploadRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await identity_exports6.PrepareAvatarUploadResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes an avatar image upload. Must be called after the file upload process completes.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async completeAvatarUpload(uploadId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/avatar-upload/${uploadId}/complete`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Completes an avatar image upload. Must be called after the file upload process completes.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async signupForBeta(request) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/beta-signup"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.SignupForBetaRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates an abuse report for an identity.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async report(identityId, request = {}) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/report`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await identity_exports6.ReportRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listFollowers(identityId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/followers`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListFollowersResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listFollowing(identityId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/following`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListFollowingResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listFriends(request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/friends"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListFriendsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listMutualFriends(identityId, request = {}) {
    const { anchor, limit } = request;
    const _queryParams = new URLSearchParams();
    if (anchor != null) {
      _queryParams.append("anchor", anchor);
    }
    if (limit != null) {
      _queryParams.append("limit", limit);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/${identityId}/mutual-friends`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListMutualFriendsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async listRecentFollowers(request = {}) {
    const { count, watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (count != null) {
      _queryParams.append("count", count.toString());
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/recent-followers"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await identity_exports6.ListRecentFollowersResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async ignoreRecentFollower(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        `/identities/self/recent-followers/${identityId}/ignore`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async markDeletion() {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/delete-request"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async unmarkDeletion() {
    const _response = await fetcher({
      url: (0, import_url_join24.default)(
        (this.options.environment ?? RivetEnvironment.Production).identity,
        "/identities/self/delete-request"
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _events;
  get events() {
    return this._events ??= new Events(this.options);
  }
  _links;
  get links() {
    return this._links ??= new Links2(this.options);
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/kv/client/Client.ts
init_core();
var import_url_join25 = __toESM(require_url_join());
init_serialization();
var Kv = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a specific key-value entry by key.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async get(request) {
    const { key, watchIndex, namespaceId } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("key", key);
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await kv_exports4.GetResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Puts (sets or overwrites) a key-value entry by key.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async put(request) {
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries"),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await kv_exports4.PutRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Deletes a key-value entry by key.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async delete(request) {
    const { key, namespaceId } = request;
    const _queryParams = new URLSearchParams();
    _queryParams.append("key", key);
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries"),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Gets multiple key-value entries by key(s).
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getBatch(request) {
    const { keys: keys2, watchIndex, namespaceId } = request;
    const _queryParams = new URLSearchParams();
    if (Array.isArray(keys2)) {
      for (const _item of keys2) {
        _queryParams.append("keys", _item);
      }
    } else {
      _queryParams.append("keys", keys2);
    }
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries/batch"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await kv_exports4.GetBatchResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Puts (sets or overwrites) multiple key-value entries by key(s).
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async putBatch(request) {
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries/batch"),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await kv_exports4.PutBatchRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Deletes multiple key-value entries by key(s).
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async deleteBatch(request) {
    const { keys: keys2, namespaceId } = request;
    const _queryParams = new URLSearchParams();
    if (Array.isArray(keys2)) {
      for (const _item of keys2) {
        _queryParams.append("keys", _item);
      }
    } else {
      _queryParams.append("keys", keys2);
    }
    if (namespaceId != null) {
      _queryParams.append("namespace_id", namespaceId);
    }
    const _response = await fetcher({
      url: (0, import_url_join25.default)((this.options.environment ?? RivetEnvironment.Production).kv, "/entries/batch"),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/party/resources/activity/client/Client.ts
init_core();
var import_url_join27 = __toESM(require_url_join());
init_serialization();

// src/api/resources/party/resources/activity/resources/matchmaker/client/Client.ts
init_core();
var import_url_join26 = __toESM(require_url_join());
init_serialization();
var Matchmaker2 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Attempts to make the current identity's party find a lobby based on the given criteria. If succeeds, all party members will receive a `GlobalEventMatchmakerLobbyJoin` event with all the information required to join the lobby. This request will use the party player count configured for the lobby group. See `FindLobby`.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async findLobbyForParty(request) {
    const _response = await fetcher({
      url: (0, import_url_join26.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/activity/matchmaker/lobbies/find"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await party_exports2.activity.FindMatchmakerLobbyForPartyRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Attempts to make the current identity's party join a specific matchmaker lobby. This request will use the party player count configured for the lobby group. If succeeds, all party members will receive a `GlobalEventMatchmakerLobbyJoin` event with all the information required to join the lobby. Identity must be the party leader. See `JoinLobby`.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async joinLobbyForParty(request) {
    const _response = await fetcher({
      url: (0, import_url_join26.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/activity/matchmaker/lobbies/join"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await party_exports2.activity.JoinMatchmakerLobbyForPartyRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async requestPlayer() {
    const _response = await fetcher({
      url: (0, import_url_join26.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/members/self/matchmaker/request-player"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/party/resources/activity/client/Client.ts
var Activity2 = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Sets the activity of the current identity's party to idle.
   * Identity must be the party leader.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setPartyToIdle() {
    const _response = await fetcher({
      url: (0, import_url_join27.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "/parties/self/activity"
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  _matchmaker;
  get matchmaker() {
    return this._matchmaker ??= new Matchmaker2(this.options);
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/party/resources/parties/client/Client.ts
init_core();
var import_url_join28 = __toESM(require_url_join());
init_serialization();
var Parties = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Fetches a party based on a given invite.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getFromInvite(request = {}) {
    const { token, alias } = request;
    const _queryParams = new URLSearchParams();
    if (token != null) {
      _queryParams.append("token", token);
    }
    if (alias != null) {
      _queryParams.append("alias", alias);
    }
    const _response = await fetcher({
      url: (0, import_url_join28.default)((this.options.environment ?? RivetEnvironment.Production).party, "invites"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetInviteResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new party.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async create(request) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)((this.options.environment ?? RivetEnvironment.Production).party, "parties"),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await party_exports2.CreateRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await party_exports2.CreateResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Joins a party using a given party invite.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async join(request) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)((this.options.environment ?? RivetEnvironment.Production).party, "parties/join"),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await party_exports2.JoinRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await party_exports2.JoinResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Creates a new party invite for the current identity's party.
   * Identity must be the party leader.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async createInvite(request) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/invites"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await party_exports2.CreateInviteRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await party_exports2.CreateInviteResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Revokes a party invite from the current identity's party.
   * Identity must be the party leader.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async revokeInvite(inviteId) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/self/invites/${inviteId}`
      ),
      method: "DELETE",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Leaves the current identity's party.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async leave() {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/leave"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Kicks a member from the current identity's current party.
   * Identity must be the party leader.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async kickMember(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/self/members/${identityId}/kick`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Transfers ownership of the party to another party member.
   * Identity must be the party leader.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async transferOwnership(identityId) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/self/members/${identityId}/transfer-ownership`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party profile for the party the current identity is a member of.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getSelfProfile(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/profile"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetSelfProfileResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Sets the publicity of a party.
   * This configures who can view and join the party.
   * Identity must be the party leader.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setPublicity(request) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/publicity"
      ),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await party_exports2.SetPublicityRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party summary for the party the current identity is a member of.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getSelfSummary(request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        "parties/self/summary"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetSelfSummaryResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async sendJoinRequest(partyId) {
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/${partyId}/join-request/send`
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party profile.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getProfile(partyId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/${partyId}/profile`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetProfileResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Returns a party summary.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getSummary(partyId, request = {}) {
    const { watchIndex } = request;
    const _queryParams = new URLSearchParams();
    if (watchIndex != null) {
      _queryParams.append("watch_index", watchIndex);
    }
    const _response = await fetcher({
      url: (0, import_url_join28.default)(
        (this.options.environment ?? RivetEnvironment.Production).party,
        `parties/${partyId}/summary`
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      queryParameters: _queryParams
    });
    if (_response.ok) {
      return await party_exports2.GetSummaryResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/party/client/Client.ts
var Party = class {
  constructor(options) {
    this.options = options;
  }
  _activity;
  get activity() {
    return this._activity ??= new Activity2(this.options);
  }
  _parties;
  get parties() {
    return this._parties ??= new Parties(this.options);
  }
};

// src/api/resources/matchmaker/resources/lobbies/client/Client.ts
init_core();
var import_url_join29 = __toESM(require_url_join());
init_serialization();
var Lobbies = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Marks the current lobby as ready to accept connections.  Players will not be able to connect to this lobby until the  lobby is flagged as ready.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async ready() {
    const _response = await fetcher({
      url: (0, import_url_join29.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/ready"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * If `is_closed` is `true`, players will be prevented from joining the lobby.
   * Does not shutdown the lobby.
   *
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async setClosed(request) {
    const _response = await fetcher({
      url: (0, import_url_join29.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/closed"
      ),
      method: "PUT",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await matchmaker_exports7.SetLobbyClosedRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Finds a lobby based on the given criteria.
   * If a lobby is not found and `prevent_auto_create_lobby` is `true`,
   * a new lobby will be created.
   *
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async find(request) {
    const { origin, ..._body } = request;
    const _response = await fetcher({
      url: (0, import_url_join29.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/find"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader(),
        origin
      },
      contentType: "application/json",
      body: await matchmaker_exports7.FindLobbyRequest.jsonOrThrow(_body, { unrecognizedObjectKeys: "strip" })
    });
    if (_response.ok) {
      return await matchmaker_exports7.FindLobbyResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Joins a specific lobby.
   * This request will use the direct player count configured for the
   * lobby group.
   *
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async join(request) {
    const _response = await fetcher({
      url: (0, import_url_join29.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/join"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await matchmaker_exports7.JoinLobbyRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return await matchmaker_exports7.JoinLobbyResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Lists all open lobbies.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async list() {
    const _response = await fetcher({
      url: (0, import_url_join29.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/lobbies/list"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await matchmaker_exports7.ListLobbiesResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/matchmaker/resources/players/client/Client.ts
init_core();
var import_url_join30 = __toESM(require_url_join());
init_serialization();
var Players = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Validates the player token is valid and has not already been consumed then
   * marks the player as connected.
   * # Player Tokens and Reserved Slots
   * Player tokens reserve a spot in the lobby until they expire. This allows for
   * precise matchmaking up to exactly the lobby's player limit, which is
   * important for games with small lobbies and a high influx of players.
   * By calling this endpoint with the player token, the player's spot is marked
   * as connected and will not expire. If this endpoint is never called, the
   * player's token will expire and this spot will be filled by another player.
   * # Anti-Botting
   * Player tokens are only issued by caling `lobbies.join`, calling `lobbies.find`, or
   * from the `GlobalEventMatchmakerLobbyJoin` event.
   * These endpoints have anti-botting measures (i.e. enforcing max player
   * limits, captchas, and detecting bots), so valid player tokens provide some
   * confidence that the player is not a bot.
   * Therefore, it's important to make sure the token is valid by waiting for
   * this endpoint to return OK before allowing the connected socket to do
   * anything else. If this endpoint returns an error, the socket should be
   * disconnected immediately.
   * # How to Transmit the Player Token
   * The client is responsible for acquiring the player token by caling
   * `lobbies.join`, calling `lobbies.find`, or from the `GlobalEventMatchmakerLobbyJoin`
   * event.  Beyond that, it's up to the developer how the player token is
   * transmitted to the lobby.
   * If using WebSockets, the player token can be transmitted as a query
   * parameter.
   * Otherwise, the player token will likely be automatically sent by the client
   * once the socket opens. As mentioned above, nothing else should happen until
   * the player token is validated.
   *
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async connected(request) {
    const _response = await fetcher({
      url: (0, import_url_join30.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/players/connected"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await matchmaker_exports7.PlayerConnectedRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Marks a player as disconnected. # Ghost Players If players are not marked as disconnected, lobbies will result with "ghost players" that the matchmaker thinks exist but are no longer connected to the lobby.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async disconnected(request) {
    const _response = await fetcher({
      url: (0, import_url_join30.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/players/disconnected"
      ),
      method: "POST",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json",
      body: await matchmaker_exports7.PlayerDisconnectedRequest.jsonOrThrow(request, {
        unrecognizedObjectKeys: "strip"
      })
    });
    if (_response.ok) {
      return;
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  /**
   * Gives matchmaker statistics about the players in game.
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async getStatistics() {
    const _response = await fetcher({
      url: (0, import_url_join30.default)(
        (this.options.environment ?? RivetEnvironment.Production).matchmaker,
        "/players/statistics"
      ),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await matchmaker_exports7.GetStatisticsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/matchmaker/resources/regions/client/Client.ts
init_core();
var import_url_join31 = __toESM(require_url_join());
init_serialization();
var Regions = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Returns a list of regions available to this namespace.
   * Regions are sorted by most optimal to least optimal. The player's IP address
   * is used to calculate the regions' optimality.
   *
   * @throws {Rivet.InternalError}
   * @throws {Rivet.RateLimitError}
   * @throws {Rivet.ForbiddenError}
   * @throws {Rivet.UnauthorizedError}
   * @throws {Rivet.NotFoundError}
   * @throws {Rivet.BadRequestError}
   */
  async list() {
    const _response = await fetcher({
      url: (0, import_url_join31.default)((this.options.environment ?? RivetEnvironment.Production).matchmaker, "/regions"),
      method: "GET",
      headers: {
        Authorization: await this._getAuthorizationHeader()
      },
      contentType: "application/json"
    });
    if (_response.ok) {
      return await matchmaker_exports7.ListRegionsResponse.parseOrThrow(_response.body, {
        unrecognizedObjectKeys: "passthrough",
        allowUnrecognizedUnionMembers: true,
        allowUnrecognizedEnumValues: true
      });
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 500:
          throw new api_exports.InternalError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 429:
          throw new api_exports.RateLimitError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 403:
          throw new api_exports.ForbiddenError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 408:
          throw new api_exports.UnauthorizedError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 404:
          throw new api_exports.NotFoundError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        case 400:
          throw new api_exports.BadRequestError(
            await ErrorBody.parseOrThrow(_response.error.body, {
              unrecognizedObjectKeys: "passthrough",
              allowUnrecognizedUnionMembers: true,
              allowUnrecognizedEnumValues: true
            })
          );
        default:
          throw new RivetError({
            statusCode: _response.error.statusCode,
            body: _response.error.body
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new RivetError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody
        });
      case "timeout":
        throw new RivetTimeoutError();
      case "unknown":
        throw new RivetError({
          message: _response.error.errorMessage
        });
    }
  }
  async _getAuthorizationHeader() {
    const bearer = await Supplier.get(this.options.token);
    if (bearer != null) {
      return `Bearer ${bearer}`;
    }
    return void 0;
  }
};

// src/api/resources/matchmaker/client/Client.ts
var Matchmaker3 = class {
  constructor(options) {
    this.options = options;
  }
  _lobbies;
  get lobbies() {
    return this._lobbies ??= new Lobbies(this.options);
  }
  _players;
  get players() {
    return this._players ??= new Players(this.options);
  }
  _regions;
  get regions() {
    return this._regions ??= new Regions(this.options);
  }
};

// src/Client.ts
var RivetClient = class {
  constructor(options) {
    this.options = options;
  }
  _chat;
  get chat() {
    return this._chat ??= new Chat(this.options);
  }
  _cloud;
  get cloud() {
    return this._cloud ??= new Cloud(this.options);
  }
  _group;
  get group() {
    return this._group ??= new Group2(this.options);
  }
  _identity;
  get identity() {
    return this._identity ??= new Identity2(this.options);
  }
  _kv;
  get kv() {
    return this._kv ??= new Kv(this.options);
  }
  _party;
  get party() {
    return this._party ??= new Party(this.options);
  }
  _matchmaker;
  get matchmaker() {
    return this._matchmaker ??= new Matchmaker3(this.options);
  }
};
export {
  api_exports as Rivet,
  RivetClient,
  RivetEnvironment,
  RivetError,
  RivetTimeoutError
};