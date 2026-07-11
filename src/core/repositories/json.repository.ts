import { Preferences } from '@capacitor/preferences';
import type { BaseEntity, QueryOptions, Repository } from '../types/base.types';
import { generateUuid } from '../utils/uuid';

/**
 * Local-storage adapter for the Repository port.
 * Persists each table as a JSON array under a single Preferences key.
 * Works on web (localStorage) and native (NSUserDefaults / SharedPreferences)
 * with no platform branching. When a backend arrives, replace this adapter
 * with an HTTP one that satisfies the same Repository<T> contract.
 */
export abstract class JsonRepository<T extends BaseEntity> implements Repository<T> {
  protected abstract storageKey: string;

  // ── CRUD ─────────────────────────────────────────────────────────

  public async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const items = await this.loadAll();
    const now = new Date();
    const entity = {
      ...data,
      id: generateUuid(),
      createdAt: now,
      updatedAt: now,
    } as T;
    items.push(entity);
    await this.saveAll(items);
    return entity;
  }

  public async findById(id: string): Promise<T | null> {
    const items = await this.loadAll();
    return items.find((e) => e.id === id && !e.deletedAt) ?? null;
  }

  public async findAll(options: QueryOptions = {}): Promise<T[]> {
    let items = (await this.loadAll()).filter((e) => !e.deletedAt);
    const { orderBy, orderDirection = 'ASC', limit, offset } = options;

    if (orderBy) {
      const key = orderBy as keyof T;
      items = [...items].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av === bv) return 0;
        const cmp = (av as unknown as number) < (bv as unknown as number) ? -1 : 1;
        return orderDirection === 'ASC' ? cmp : -cmp;
      });
    }
    if (offset) items = items.slice(offset);
    if (limit) items = items.slice(0, limit);
    return items;
  }

  public async update(id: string, data: Partial<T>): Promise<T | null> {
    const items = await this.loadAll();
    const idx = items.findIndex((e) => e.id === id && !e.deletedAt);
    if (idx === -1) return null;

    const current = items[idx]!;
    const merged: T = {
      ...current,
      ...data,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
    };
    items[idx] = merged;
    await this.saveAll(items);
    return merged;
  }

  public async delete(id: string): Promise<boolean> {
    const items = await this.loadAll();
    const idx = items.findIndex((e) => e.id === id && !e.deletedAt);
    if (idx === -1) return false;

    const now = new Date();
    items[idx] = { ...items[idx]!, deletedAt: now, updatedAt: now };
    await this.saveAll(items);
    return true;
  }

  public async count(): Promise<number> {
    return (await this.loadAll()).filter((e) => !e.deletedAt).length;
  }

  // ── Storage helpers (overridable by subclasses with extra Date fields) ──

  protected async loadAll(): Promise<T[]> {
    const { value } = await Preferences.get({ key: this.storageKey });
    if (!value) return [];
    try {
      const parsed = JSON.parse(value) as unknown[];
      return parsed.map((row) => this.deserialize(row));
    } catch {
      return [];
    }
  }

  protected async saveAll(items: T[]): Promise<void> {
    const serialized = items.map((e) => this.serialize(e));
    await Preferences.set({
      key: this.storageKey,
      value: JSON.stringify(serialized),
    });
  }

  protected serialize(entity: T): unknown {
    return entity;
  }

  protected deserialize(raw: unknown): T {
    const obj = raw as Record<string, unknown>;
    const result: Record<string, unknown> = {
      ...obj,
      createdAt: new Date(obj.createdAt as string),
      updatedAt: new Date(obj.updatedAt as string),
    };
    if (obj.deletedAt) result.deletedAt = new Date(obj.deletedAt as string);
    return result as T;
  }
}
