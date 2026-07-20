import { hasAnyDomainData, importAllData } from './dataBackup';

const exampleBackups = import.meta.glob('/icarapp-backup-*.json', {
  query: '?raw',
  import: 'default',
});

export async function seedFromExampleBackup(): Promise<void> {
  const [latestPath] = Object.keys(exampleBackups).sort().reverse();
  if (!latestPath) return;

  const loadBackup = exampleBackups[latestPath];
  if (!loadBackup) return;

  if (await hasAnyDomainData()) return;

  try {
    const raw = (await loadBackup()) as string;
    await importAllData(raw);
    console.info(`[devSeed] Datos de ejemplo cargados desde ${latestPath}`);
  } catch (error) {
    console.warn('[devSeed] No se pudo cargar el backup de ejemplo:', error);
  }
}
