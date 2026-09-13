import { vi } from 'vitest';

export const mockDb = {
  exec: vi.fn().mockResolvedValue([]),
  query: vi.fn().mockResolvedValue({ rows: [{ count: 0 }] }),
};

vi.mock('@electric-sql/pglite', () => {
  return {
    PGlite: vi.fn().mockImplementation(function () {
      return mockDb;
    }),
  };
});