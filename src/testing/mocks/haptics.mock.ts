import { vi } from 'vitest';

export const mockHaptics = {
  impact: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@capacitor/haptics', () => ({
  Haptics: mockHaptics,
  ImpactStyle: {
    Light: 'LIGHT',
  },
}));