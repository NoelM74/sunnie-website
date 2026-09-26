export interface D1Like {
  prepare(sql: string): {
    bind(...v: unknown[]): {
      run(): Promise<unknown>;
      first<T = Record<string, unknown>>(): Promise<T | null>;
    };
  };
}
