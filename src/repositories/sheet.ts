import { EnvironmentType } from '@/types';
import { Config, Functions } from '@/utilities';
import { google } from 'googleapis';
import path from 'path';

const config = Config.bind(EnvironmentType)

export class GoogleSheetRangeType {
  workbook: string;
  start: string;
  end: string;

  constructor(workbook: string, start: string = "1", end: string = "1") {
    this.workbook = workbook;
    this.start = start;
    this.end = end;
  }

  public toString() {
    return `${this.workbook}!${this.start}:${this.end}`;
  }
}

export interface GoogleSheetOptions {
  spreadsheetId: string;
  keyFile: string;
}

export class GoogleSheet {
  private readonly options: GoogleSheetOptions;
  private client: ReturnType<typeof google.sheets>;

  private static instance?: GoogleSheet;

  constructor(options: GoogleSheetOptions = { spreadsheetId: config.SHEET_ID, keyFile: config.GOOGLE_APPLICATION_CREDENTIALS }) {
    this.options = options;
  }

  public static async getInstance(options?: GoogleSheetOptions) {
    if (!this.instance) {
      this.instance = new GoogleSheet(options);
      await this.instance.setup()
    }
    return this.instance
  }

  private async auth() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(process.cwd(), this.options.keyFile),
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    if (!token) {
      throw new Error('Failed to obtain access token for Google Sheets API');
    }
    return auth;
  }

  private async verify(): Promise<boolean> {
    const { ok } = await Functions.wrapAsync(() => this.client.spreadsheets.get({
      spreadsheetId: this.options.spreadsheetId,
    }));
    return ok
  }

  public async setup() {
    const auth = await this.auth()
    this.client = google.sheets({ version: 'v4', auth });

    const valid = await this.verify();
    if (!valid) {
      throw new Error('Google Sheets API client does not have permission');
    }
  }

  public async head(workbook: GoogleSheetRangeType["workbook"]) {
    const res = await this.get(new GoogleSheetRangeType(workbook))
    return res?.at(0) ?? []
  }

  public async get(range: GoogleSheetRangeType) {
    const res = await this.client.spreadsheets.values.get({
      spreadsheetId: this.options.spreadsheetId,
      range: range.toString(),
      valueRenderOption: 'UNFORMATTED_VALUE',
    });
    return res.data.values ?? [];
  }

  public async update(range: GoogleSheetRangeType, values: string[]) {
    await this.client.spreadsheets.values.update({
      spreadsheetId: this.options.spreadsheetId,
      range: range.toString(),
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });
  }

  public async append(workbook: GoogleSheetRangeType["workbook"], values: string[]) {
    await this.client.spreadsheets.values.append({
      spreadsheetId: this.options.spreadsheetId,
      range: new GoogleSheetRangeType(workbook).toString(),
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });
  }

  public async clear(range: GoogleSheetRangeType) {
    await this.client.spreadsheets.values.clear({
      spreadsheetId: this.options.spreadsheetId,
      range: range.toString(),
    });
  }
}