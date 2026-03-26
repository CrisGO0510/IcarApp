export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Generic repository port (hexagonal architecture).
 * Domain services depend on this interface, not on the SQLite implementation.
 * Future adapters (REST API, etc.) must satisfy this contract.
 */
export interface Repository<T extends BaseEntity> {
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(options?: QueryOptions): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
