export type SQLiteValue = string | number | boolean | null;
export type SQLiteValues = SQLiteValue[];

export type EntityRowData = Record<string, SQLiteValue>;
export type DatabaseRow = Record<string, SQLiteValue>;

export interface QueryBuilder {
  columns: string;
  placeholders: string;
  values: SQLiteValues;
}

export interface UpdateQueryBuilder {
  setClause: string;
  values: SQLiteValues;
}
