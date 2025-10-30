import { parse } from "csv-parse/sync";

export type ReportRow = {
  eventName: string;
  grossRevenue: string;
  feesPaid?: string;
  hours?: string;
  date?: string;
  notes?: string;
};

export function parseReportsCsv(csvText: string): ReportRow[] {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  return records as ReportRow[];
}
