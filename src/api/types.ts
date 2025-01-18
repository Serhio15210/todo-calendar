export type TaskStatus = "done" | "in progress" | "canceled";
export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
};
export type CountryCode = {
  value: string;
  label: string;
};
export type MonthData = Record<string, Record<string, Task["id"][]>>;
export type MonthExpandData = Record<string, Task[]>;
export interface ICountryCode {
  countryCode: string;
  name: string;
}
export interface ICountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: string[];
}
export interface IWeekend {
  startDate: string;
  endDate: string;
  dayCount: number;
  needBridgeDay: boolean;
  bridgeDays: string[];
}
export interface IHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties: string[];
  launchYear: number;
  types: string[];
}
