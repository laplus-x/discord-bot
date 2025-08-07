import { ClassConverter, SheetConverter } from "@/converters";
import { EventTrackingResource } from "@/types";
import { GoogleSheet, GoogleSheetRangeType } from "./sheet";

export class EventTracking {
  private sheets: GoogleSheet;

  private static instance?: EventTracking;

  public static async getInstance() {
    if (!this.instance) {
      this.instance = new EventTracking();
      await this.instance.setup()
    }
    return this.instance
  }

  public async setup() {
    this.sheets = await GoogleSheet.getInstance();
  }

  public async get(start: GoogleSheetRangeType["start"], end: GoogleSheetRangeType["end"]): Promise<EventTrackingResource[]> {
    const range = new GoogleSheetRangeType('events', start, end)
    const data = await this.sheets.get(range);

    const header = start.endsWith("1") ? data.shift() : await this.sheets.head('events');
    const rows = SheetConverter.deserialize(data, header)
    return ClassConverter.deserialize(rows, EventTrackingResource)
  }

  public async append(event: EventTrackingResource) {
    const data = ClassConverter.serialize(event)

    const workbook = 'events'
    const header = await this.sheets.head(workbook)
    const rows = SheetConverter.serialize([data], header)
    this.sheets.append(workbook, rows[0]);
  }
}