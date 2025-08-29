'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MonthYearPickerProps {
  period: { month: number; year: number };
  onPeriodChange: (period: { month: number; year: number }) => void;
}

export function MonthYearPicker({ period, onPeriodChange }: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex gap-4">
      <Select
        value={String(period.month)}
        onValueChange={(value) => onPeriodChange({ ...period, month: parseInt(value, 10) })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((month, index) => (
            <SelectItem key={month} value={String(index + 1)}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(period.year)}
        onValueChange={(value) => onPeriodChange({ ...period, year: parseInt(value, 10) })}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
