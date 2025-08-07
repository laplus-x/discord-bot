import { Functions } from '@/utilities';
import { Err } from 'ts-results';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { mock } from "vitest-mock-extended";
import { GoogleSheet, GoogleSheetOptions, GoogleSheetRangeType } from './sheet';

const { getMock, appendMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  appendMock: vi.fn(),
}))

vi.mock('googleapis', async () => {
  return {
    google: {
      sheets: vi.fn(() => ({
        spreadsheets: {
          values: {
            get: getMock,
            append: appendMock,
          },
          get: vi.fn(),
        },
      })),
      auth: {
        GoogleAuth: vi.fn(() => ({
          getClient: vi.fn(() => ({
            getAccessToken: vi.fn().mockResolvedValue('mock_token')
          }))
        })),
      },
    },
  };
});

vi.mock('@/utilities', () => ({
  Functions: {
    wrapAsync: vi.fn(() => mock<ReturnType<typeof Functions.wrapAsync>>()),
  },
}));

vi.mock('path', async () => {
  const actual = await vi.importActual<typeof import('path')>('path');
  return {
    ...actual,
    resolve: vi.fn(() => '/mocked/path/to/keyfile.json'),
  };
});

describe('GoogleSheet', () => {
  const options: GoogleSheetOptions = {
    spreadsheetId: 'test-spreadsheet-id',
    keyFile: 'test-keyfile.json',
  };

  let sheet: GoogleSheet;

  beforeAll(async () => {
    sheet = await GoogleSheet.getInstance(options);
  });

  it('should return a singleton instance', async () => {
    const instance1 = await GoogleSheet.getInstance(options);
    const instance2 = await GoogleSheet.getInstance(options);
    expect(instance1).toBe(instance2);
  });

  it('should throw an error if verify fails', async () => {
    vi.mocked(Functions.wrapAsync).mockResolvedValueOnce(Err("Google Sheets API client does not have permission"));

    const badSheet = new GoogleSheet(options);
    await expect(badSheet.setup()).rejects.toThrow('Google Sheets API client does not have permission');
  });

  it('should retrieve sheet values', async () => {
    const mockedValues = [['A1', 'B1'], ['A2', 'B2']];
    getMock.mockResolvedValueOnce({
      data: {
        values: mockedValues,
      },
    })

    const values = await sheet.get(new GoogleSheetRangeType('Sheet1', 'A1', 'B2'));
    expect(values).toEqual(mockedValues);
  });

  it('should append values to sheet', async () => {
    const mockedValues = ['test1', 'test2'];
    await sheet.append('Sheet1', mockedValues);

    expect(appendMock).toHaveBeenCalledWith({
      spreadsheetId: options.spreadsheetId,
      range: 'Sheet1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [mockedValues],
      },
    });
  });
});
