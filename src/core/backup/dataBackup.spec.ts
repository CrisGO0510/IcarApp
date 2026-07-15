import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportAllData,
  importAllData,
  BACKUP_APP,
  BACKUP_VERSION,
  type BackupFile,
} from './dataBackup';

const store = new Map<string, string>();

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    keys: vi.fn(() => Promise.resolve({ keys: [...store.keys()] })),
    get: vi.fn(({ key }: { key: string }) => Promise.resolve({ value: store.get(key) ?? null })),
    set: vi.fn(({ key, value }: { key: string; value: string }) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    remove: vi.fn(({ key }: { key: string }) => {
      store.delete(key);
      return Promise.resolve();
    }),
  },
}));

const NOW = new Date('2026-07-12T23:00:00.000Z');

describe('dataBackup', () => {
  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
  });

  describe('exportAllData', () => {
    it('bundles domain tables with metadata', async () => {
      // Arrange
      store.set('icarapp:user_profile', '[{"id":"1"}]');
      store.set('icarapp:exercises', '[{"id":"e1"}]');

      // Act
      const raw = await exportAllData(NOW);
      const backup = JSON.parse(raw) as BackupFile;

      // Assert
      expect(backup.app).toBe(BACKUP_APP);
      expect(backup.version).toBe(BACKUP_VERSION);
      expect(backup.exportedAt).toBe(NOW.toISOString());
      expect(backup.data['icarapp:user_profile']).toBe('[{"id":"1"}]');
      expect(backup.data['icarapp:exercises']).toBe('[{"id":"e1"}]');
    });

    it('excludes ephemeral rest-timer keys and non-app keys', async () => {
      // Arrange
      store.set('icarapp:exercises', '[]');
      store.set('icarapp:rest_ends_at', '{"endsAt":1}');
      store.set('icarapp:rest_corner', 'bottom-left');
      store.set('other:thing', 'x');

      // Act
      const backup = JSON.parse(await exportAllData(NOW)) as BackupFile;

      // Assert
      expect(Object.keys(backup.data)).toEqual(['icarapp:exercises']);
    });
  });

  describe('importAllData', () => {
    it('replaces current domain data with the backup contents', async () => {
      // Arrange
      store.set('icarapp:exercises', '[{"id":"old"}]');
      store.set('icarapp:routines', '[{"id":"stale"}]');
      const backup: BackupFile = {
        app: BACKUP_APP,
        version: BACKUP_VERSION,
        exportedAt: NOW.toISOString(),
        data: { 'icarapp:exercises': '[{"id":"new"}]' },
      };

      // Act
      await importAllData(JSON.stringify(backup));

      // Assert
      expect(store.get('icarapp:exercises')).toBe('[{"id":"new"}]');
      expect(store.has('icarapp:routines')).toBe(false);
    });

    it('preserves ephemeral rest-timer keys through an import', async () => {
      // Arrange
      store.set('icarapp:rest_corner', 'top-right');
      const backup: BackupFile = {
        app: BACKUP_APP,
        version: BACKUP_VERSION,
        exportedAt: NOW.toISOString(),
        data: { 'icarapp:exercises': '[]' },
      };

      // Act
      await importAllData(JSON.stringify(backup));

      // Assert
      expect(store.get('icarapp:rest_corner')).toBe('top-right');
    });

    it('ignores non-app keys embedded in a backup', async () => {
      // Arrange
      const backup = {
        app: BACKUP_APP,
        version: BACKUP_VERSION,
        exportedAt: NOW.toISOString(),
        data: { 'icarapp:exercises': '[]', 'evil:key': 'nope' },
      };

      // Act
      await importAllData(JSON.stringify(backup));

      // Assert
      expect(store.has('evil:key')).toBe(false);
    });

    it('rejects malformed JSON', async () => {
      // Act / Assert
      await expect(importAllData('{not json')).rejects.toThrow();
    });

    it('rejects a file that is not an IcarApp backup', async () => {
      // Act / Assert
      await expect(importAllData(JSON.stringify({ app: 'Other', data: {} }))).rejects.toThrow();
    });
  });
});
