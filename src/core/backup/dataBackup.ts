import { Preferences } from '@capacitor/preferences';

export const BACKUP_APP = 'IcarApp';
export const BACKUP_VERSION = 1;

const KEY_PREFIX = 'icarapp:';
const EPHEMERAL_KEYS = ['icarapp:rest_ends_at', 'icarapp:rest_corner'];

export interface BackupFile {
  app: string;
  version: number;
  exportedAt: string;
  data: Record<string, string>;
}

function isDomainKey(key: string): boolean {
  return key.startsWith(KEY_PREFIX) && !EPHEMERAL_KEYS.includes(key);
}

export async function exportAllData(now: Date): Promise<string> {
  const { keys } = await Preferences.keys();
  const data: Record<string, string> = {};

  for (const key of keys.filter(isDomainKey)) {
    const { value } = await Preferences.get({ key });
    if (value !== null) data[key] = value;
  }

  const backup: BackupFile = {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    data,
  };
  return JSON.stringify(backup, null, 2);
}

export async function importAllData(raw: string): Promise<void> {
  let parsed: BackupFile;
  try {
    parsed = JSON.parse(raw) as BackupFile;
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }

  if (parsed?.app !== BACKUP_APP || typeof parsed.data !== 'object' || parsed.data === null) {
    throw new Error('El archivo no es una copia válida de IcarApp.');
  }

  const { keys } = await Preferences.keys();
  for (const key of keys.filter(isDomainKey)) {
    await Preferences.remove({ key });
  }

  for (const [key, value] of Object.entries(parsed.data)) {
    if (isDomainKey(key) && typeof value === 'string') {
      await Preferences.set({ key, value });
    }
  }
}
