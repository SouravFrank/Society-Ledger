export type MeetingMinute = {
  id?: string; // Made optional
  date: string; // YYYY-MM-DD
  url: string;
  title?: string; // Made optional
  formattedDate?: string; // Precomputed formatted date
};

export type FinancialStatement = {
  period: string; // YYYY-MM
  url: string;
  title?: string; // Made optional
  formattedDate?: string; // Precomputed formatted date
};
