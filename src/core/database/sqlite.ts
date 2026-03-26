import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import type { SQLiteValues, DatabaseRow } from '../types/sqlite.types';
import { migrations } from './migrations';

function errorToString(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
}

export class SQLiteManager {
  private static instance: SQLiteManager;
  private sqliteConnection: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'icarapp.db';
  private readonly dbVersion = 1;
  private isInitialized = false;

  private constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }

  public static getInstance(): SQLiteManager {
    if (!SQLiteManager.instance) {
      SQLiteManager.instance = new SQLiteManager();
    }
    return SQLiteManager.instance;
  }

  // ── Initialization ───────────────────────────────────────────────

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const retCC = await this.sqliteConnection.checkConnectionsConsistency();
      const isConn = (await this.sqliteConnection.isConnection(this.dbName, false)).result;

      if (retCC.result && isConn) {
        this.db = await this.sqliteConnection.retrieveConnection(this.dbName, false);
      } else {
        this.db = await this.sqliteConnection.createConnection(
          this.dbName,
          false,
          'no-encryption',
          this.dbVersion,
          false,
        );
      }

      await this.db.open();
      await this.runMigrations();
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Database initialization failed: ${errorToString(error)}`);
    }
  }

  // ── Migrations ───────────────────────────────────────────────────

  private async runMigrations(): Promise<void> {
    await this.execute(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const currentVersion = await this.getCurrentSchemaVersion();

    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        await this.execute(migration.sql);
        await this.execute('INSERT INTO schema_version (version) VALUES (?)', [migration.version]);
      }
    }
  }

  private async getCurrentSchemaVersion(): Promise<number> {
    try {
      const result = await this.query('SELECT MAX(version) as version FROM schema_version');
      const version = result[0]?.version;
      return typeof version === 'number' ? version : 0;
    } catch {
      return 0;
    }
  }

  // ── Core operations ──────────────────────────────────────────────

  public async execute(sql: string, values: SQLiteValues = []): Promise<void> {
    this.assertConnected();
    try {
      await this.db!.run(sql, values);
    } catch (error) {
      throw new Error(`SQL execution failed: ${errorToString(error)}`);
    }
  }

  public async query<T = DatabaseRow>(sql: string, values: SQLiteValues = []): Promise<T[]> {
    this.assertConnected();
    try {
      const result = await this.db!.query(sql, values);
      return (result.values as T[]) ?? [];
    } catch (error) {
      throw new Error(`SQL query failed: ${errorToString(error)}`);
    }
  }

  public async transaction(operations: (() => Promise<void>)[]): Promise<void> {
    this.assertConnected();
    try {
      await this.execute('BEGIN TRANSACTION');
      for (const operation of operations) {
        await operation();
      }
      await this.execute('COMMIT');
    } catch (error) {
      await this.execute('ROLLBACK');
      throw new Error(`Transaction failed: ${errorToString(error)}`);
    }
  }

  // ── Utility ──────────────────────────────────────────────────────

  public isConnected(): boolean {
    return this.isInitialized && this.db !== null;
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }

  public generateId(): string {
    return crypto.randomUUID();
  }

  private assertConnected(): void {
    if (!this.isConnected()) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }
}
