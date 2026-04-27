import { initialData } from './localData';

const STORAGE_KEY = 'hearh_static_data_v1';

const clone = (value) => JSON.parse(JSON.stringify(value));

const readStore = () => {
  if (typeof window === 'undefined') {
    return clone(initialData);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seeded = clone(initialData);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  return { ...clone(initialData), ...JSON.parse(stored) };
};

const writeStore = (store) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
};

const getCollection = (store, entityName) => {
  if (!store[entityName]) {
    store[entityName] = [];
  }
  return store[entityName];
};

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
    const store = readStore();
    return withLimit(sortRecords(clone(getCollection(store, entityName)), sortBy), limit);
  },

  async filter(query, sortBy, limit) {
    const store = readStore();
    const records = getCollection(store, entityName).filter((record) => matchesQuery(record, query));
    return withLimit(sortRecords(clone(records), sortBy), limit);
  },

  async get(id) {
    const store = readStore();
    return clone(getCollection(store, entityName).find((record) => record.id === id) || null);
  },

  async create(data) {
    const store = readStore();
    const now = new Date().toISOString();
    const record = {
      id: data.id || `${entityName.toLowerCase()}-${crypto.randomUUID()}`,
      created_date: data.created_date || now,
      updated_date: now,
      ...data
    };

    getCollection(store, entityName).push(record);
    writeStore(store);
    return clone(record);
  },

  async update(id, data) {
    const store = readStore();
    const collection = getCollection(store, entityName);
    const index = collection.findIndex((record) => record.id === id);

    if (index === -1) {
      throw new Error(`${entityName} record was not found: ${id}`);
    }

    collection[index] = {
      ...collection[index],
      ...data,
      updated_date: new Date().toISOString()
    };
    writeStore(store);
    return clone(collection[index]);
  },

  async delete(id) {
    const store = readStore();
    store[entityName] = getCollection(store, entityName).filter((record) => record.id !== id);
    writeStore(store);
  },

  async bulkCreate(records) {
    return Promise.all(records.map((record) => this.create(record)));
  },

  async updateMany(query, data) {
    const store = readStore();
    const collection = getCollection(store, entityName);

    collection.forEach((record, index) => {
      if (matchesQuery(record, query)) {
        collection[index] = {
          ...record,
          ...data,
          updated_date: new Date().toISOString()
        };
      }
    });

    writeStore(store);
    return clone(collection.filter((record) => matchesQuery(record, query)));
  }
});

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
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
  entities,
  auth: {
    async me() {
      return {
        id: 'local-admin',
        email: 'local@hearh.static',
        full_name: 'Local Admin',
        role: 'admin'
      };
    },
    logout() {},
    redirectToLogin() {}
  },
  appLogs: {
    async logUserInApp() {}
  },
  integrations: {
    Core: {
      async UploadFile({ file }) {
        return { file_url: await fileToDataUrl(file) };
      },
      async SendEmail() {
        return { success: true };
      },
      async SendSMS() {
        return { success: true };
      },
      async InvokeLLM() {
        return {
          title: '',
          excerpt: '',
          content: '',
          message: 'AI generation is unavailable in the static GitHub Pages version.'
        };
      },
      async GenerateImage() {
        return { url: '' };
      },
      async ExtractDataFromUploadedFile() {
        return { data: null };
      }
    }
  }
};
