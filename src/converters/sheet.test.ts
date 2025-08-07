import { describe, expect, it } from 'vitest';
import { SheetConverter } from './sheet';

interface User {
  id: string;
  name: string;
  email: string;
}

describe('SheetConverter', () => {
  const users: User[] = [
    { id: '1', name: 'Alice', email: 'a@x.com' },
    { id: '2', name: 'Bob', email: 'b@x.com' },
  ];

  const sheetData = [
    ['id', 'name', 'email'],
    ['1', 'Alice', 'a@x.com'],
    ['2', 'Bob', 'b@x.com'],
  ];

  it('should serialize object array to sheet array', () => {
    const result = SheetConverter.serialize(users);
    expect(result).toEqual(sheetData.slice(1));
  });

  it('should deserialize sheet array to object array', () => {
    const result = SheetConverter.deserialize<User>(sheetData);
    expect(result).toEqual(users);
  });

  it('should return empty array when serializing empty input', () => {
    expect(SheetConverter.serialize([])).toEqual([]);
  });

  it('should return empty array when deserializing empty input', () => {
    expect(SheetConverter.deserialize([])).toEqual([]);
  });

  it('should handle missing values as null in deserialization', () => {
    const partialSheet = [
      ['id', 'name', 'email'],
      ['3', 'Charlie'], // email is missing
    ];

    const expected = [
      { id: '3', name: 'Charlie', email: null },
    ];

    const result = SheetConverter.deserialize<User>(partialSheet);
    expect(result).toEqual(expected);
  });
});
