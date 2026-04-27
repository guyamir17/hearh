import { initialData } from './localData';

const clone = (value) => JSON.parse(JSON.stringify(value));

const sortRecords = (records, sortBy) => {
  if (!sortBy) {
    return records;
  }

  const descending = sortBy.startsWith('-');
  const field = descending ? sortBy.slice(1) : sortBy;

  return [...records].sort((a, b) => {
    const left = a[field] ?? '';
    const right = b[field] ?? '';

    if (left < right) {
      return descending ? 1 : -1;
    }

    if (left > right) {
      return descending ? -1 : 1;
    }

    return 0;
  });
};

const matchesQuery = (record, query = {}) => (
  Object.entries(query).every(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return true;
    }

    return record[key] === value;
  })
);

const withLimit = (records, limit) => (
  typeof limit === 'number' ? records.slice(0, limit) : records
);

const createEntity = (entityName) => ({
  async list(sortBy, limit) {
    const records = clone(initialData[entityName] || []);
    return withLimit(sortRecords(records, sortBy), limit);
  },

  async filter(query, sortBy, limit) {
    const records = clone(initialData[entityName] || []).filter((record) => matchesQuery(record, query));
    return withLimit(sortRecords(records, sortBy), limit);
  },

  async get(id) {
    return clone((initialData[entityName] || []).find((record) => record.id === id) || null);
  }
});

const entities = new Proxy({}, {
  get(target, entityName) {
    if (!target[entityName]) {
      target[entityName] = createEntity(entityName);
    }

    return target[entityName];
  }
});

export const staticClient = {
  entities
};
