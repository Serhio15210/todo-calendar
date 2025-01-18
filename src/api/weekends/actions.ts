import { api } from "@/api/api.ts";
import { ICountry, ICountryCode } from "@/api/types.ts";

export const getAvailableCountries = async () => {
  const response = await api.get<ICountryCode[]>("/api/v3/AvailableCountries");
  return response.data;
};

export const getCountry = async (code: string) => {
  const response = await api.get<ICountry>(`/api/v3/CountryInfo/${code}`);
  return response.data;
};
export const getLongWeekend = async (year: string, code: string) => {
  const response = await api.get<ICountry>(
    `/api/v3/LongWeekend/${year}/${code}`,
  );
  return response.data;
};
export const getCountryHolidays = async (year: string, code: string) => {
  const response = await api.get<ICountry>(
    `/api/v3/PublicHolidays/${year}/${code}`,
  );
  return response.data;
};
