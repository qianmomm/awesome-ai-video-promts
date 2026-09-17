// Dependency-free validator for the documented subset used by case.schema.json.
// Unsupported keywords fail closed; this is not a general JSON Schema engine.
const supported = new Set(['$schema', '$id', 'title', 'description', 'type', 'properties', 'required', 'additionalProperties', 'items', 'minItems', 'uniqueItems', 'minLength', 'maxLength', 'pattern', 'enum', 'format']);

export function assertSupported(schema) {
  for (const key of Object.keys(schema)) {
    if (!supported.has(key)) throw new Error(`Unsupported schema keyword: ${key}`);
  }
  for (const child of Object.values(schema.properties ?? {})) assertSupported(child);
  if (schema.items) assertSupported(schema.items);
}

export function validURL(value) {
  if (typeof value !== 'string' || /[\s<>\x00-\x1f\x7f]/u.test(value)) return false;
  try {
    const u = new URL(value);
    return ['http:', 'https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password;
  } catch { return false; }
}

export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(+d) && d.toISOString().slice(0, 10) === value;
}

export function validateSchema(value, schema, path = '$') {
  assertSupported(schema);
  const errors = [];
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  if (!types.includes(type)) return [`${path}: expected ${types.join('/')}, got ${type}`];
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: invalid enum value`);
  if (type === 'string') {
    if (schema.minLength && value.trim().length < schema.minLength) errors.push(`${path}: empty or too short`);
    if (schema.maxLength && [...value].length > schema.maxLength) errors.push(`${path}: too long`);
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) errors.push(`${path}: invalid pattern`);
    if (schema.format === 'uri' && !validURL(value)) errors.push(`${path}: expected an HTTP(S) URL without credentials`);
    if (schema.format === 'date' && !validDate(value)) errors.push(`${path}: invalid calendar date`);
    if (schema.format && !['uri', 'date'].includes(schema.format)) throw new Error(`Unsupported format: ${schema.format}`);
  }
  if (type === 'array') {
    if (schema.minItems && value.length < schema.minItems) errors.push(`${path}: too few items`);
    if (schema.uniqueItems && new Set(value.map(x => JSON.stringify(x))).size !== value.length) errors.push(`${path}: duplicate items`);
    for (let i = 0; i < value.length; i++) if (schema.items) errors.push(...validateSchema(value[i], schema.items, `${path}[${i}]`));
  }
  if (type === 'object') {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: required`);
    for (const [key, child] of Object.entries(value)) {
      if (Object.hasOwn(schema.properties ?? {}, key)) errors.push(...validateSchema(child, schema.properties[key], `${path}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${path}.${key}: unknown field`);
    }
  }
  return errors;
}
