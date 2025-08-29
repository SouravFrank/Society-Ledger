export type MeetingMinute = {
  id: string;
  date: string; // YYYY-MM-DD
  url: string;
  title: string;
};

export type FinancialStatement = {
  period: string; // YYYY-MM
  url: string;
  title: string;
  summary: string;
};