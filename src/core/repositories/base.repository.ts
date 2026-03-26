import { SQLiteManager } from '../database/sqlite';
import type { BaseEntity, QueryOptions } from '../types/base.types';
import type {
  SQLiteValues,
  DatabaseRow,
  EntityRowData,
  QueryBuilder,
  UpdateQueryBuilder,
} from '../types/sqlite.types';

/**
 * Abstract SQLite adapter for the Repository port.
 * Concrete repositories extend this class and implement the row↔entity mappers.
 * When migrating to a cloud backend, replace these adapters without touching
 * services or domain types.
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected db: SQLiteManager;
  protected abstract tableName: string;

  constructor() {
    this.db = SQLiteManager.getInstance();
  }

  // ── Abstract mappers (subclass responsibility) ───────────────────

  protected abstract mapRowToEntity(row: DatabaseRow): T;
  protected abstract mapEntityToRow(entity: Partial<T>): EntityRowData;

  // ── CRUD ─────────────────────────────────────────────────────────

  public async create(entityData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const id = this.db.generateId();
    const now = new Date().toISOString();

    const entity = {
      ...entityData,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    } as T;

    const row = this.mapEntityToRow(entity);
    const { columns, placeholders, values } = this.buildInsertQuery(row);

    await this.db.execute(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
      values,
    );

    return entity;
  }

  public async findById(id: string): Promise<T | null> {
    const rows = await this.db.query(
      `SELECT * FROM ${this.tableName} WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );
    return rows.length > 0 && rows[0] ? this.mapRowToEntity(rows[0]) : null;
  }

  public async findAll(options: QueryOptions = {}): Promise<T[]> {
    const { limit, offset, orderBy, orderDirection } = options;
    let sql = `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL`;
    const values: SQLiteValues = [];

    if (orderBy) {
      sql += ` ORDER BY ${orderBy} ${orderDirection ?? 'ASC'}`;
    }
    if (limit) {
      sql += ' LIMIT ?';
      values.push(limit);
    }
    if (offset) {
      sql += ' OFFSET ?';
      values.push(offset);
    }

    const rows = await this.db.query(sql, values);
    return rows.map((row) => this.mapRowToEntity(row));
  }

  public async update(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date() } as T;
    const row = this.mapEntityToRow(updated);
    const { setClause, values } = this.buildUpdateQuery(row);

    await this.db.execute(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);

    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );

    if (!result[0] || result[0].count === 0) return false;

    const now = new Date().toISOString();
    await this.db.execute(
      `UPDATE ${this.tableName} SET deleted_at = ?, updated_at = ? WHERE id = ?`,
      [now, now, id],
    );
    return true;
  }

  public async count(): Promise<number> {
    const result = await this.db.query(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE deleted_at IS NULL`,
    );
    const count = result[0]?.count;
    return typeof count === 'number' ? count : 0;
  }

  // ── Protected helpers for subclasses ─────────────────────────────

  protected async executeQuery<U = DatabaseRow>(
    sql: string,
    values: SQLiteValues = [],
  ): Promise<U[]> {
    return this.db.query<U>(sql, values);
  }

  protected async executeCommand(sql: string, values: SQLiteValues = []): Promise<void> {
    await this.db.execute(sql, values);
  }

  protected dateToString(date: Date): string {
    return date.toISOString();
  }

  protected stringToDate(dateString: string): Date {
    return new Date(dateString);
  }

  protected formatDateOnly(date: Date): string {
    const part = date.toISOString().split('T')[0];
    if (!part) throw new Error('Failed to format date');
    return part;
  }

  // ── Private query builders ───────────────────────────────────────

  private buildInsertQuery(row: EntityRowData): QueryBuilder {
    const keys = Object.keys(row).filter((k) => row[k] !== undefined);
    return {
      columns: keys.join(', '),
      placeholders: keys.map(() => '?').join(', '),
      values: keys.map((k) => row[k]).filter((v): v is NonNullable<typeof v> => v !== undefined),
    };
  }

  private buildUpdateQuery(row: EntityRowData): UpdateQueryBuilder {
    const keys = Object.keys(row).filter((k) => row[k] !== undefined && k !== 'id');
    return {
      setClause: keys.map((k) => `${k} = ?`).join(', '),
      values: keys.map((k) => row[k]).filter((v): v is NonNullable<typeof v> => v !== undefined),
    };
  }
}
