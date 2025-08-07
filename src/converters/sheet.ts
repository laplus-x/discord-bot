
export class SheetConverter {

  public static serialize<T extends object>(data: T[], header?: string[]): any[][] {
    if (!data || data.length === 0) return [];

    const keys = header?.filter(Boolean) ?? Object.keys(data[0]);
    return data.map(row => keys.map(key => row[key] ?? null));
  }

  public static deserialize<T extends object>(data: any[][], header?: string[]): T[] {
    if (!data || data.length === 0) return [];

    const keys = header?.filter(Boolean) ?? data.shift() ?? []
    return data.map(row => {
      return keys.reduce((prev, curr, i) => {
        prev[curr] = row[i] ?? null;
        return prev
      }, {});
    });
  }
}
