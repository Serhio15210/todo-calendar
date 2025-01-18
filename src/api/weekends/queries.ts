import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ICountry, ICountryCode, IHoliday, IWeekend } from "@/api/types.ts";
import { queryIds } from "@/api/weekends/constants.ts";
import {
  getAvailableCountries,
  getCountry,
  getCountryHolidays,
  getLongWeekend,
} from "@/api/weekends/actions.ts";

export const useAvailableCountriesQuery = (): UseQueryResult<
  ICountryCode[]
> => {
  return useQuery({
    queryKey: [queryIds.AVAILABLE_COUNTRY],
    queryFn: getAvailableCountries,
    refetchOnWindowFocus: false,
  });
};
export const useCountryQuery = (code: string): UseQueryResult<ICountry> => {
  return useQuery({
    queryKey: [queryIds.COUNTRY],
    queryFn: () => getCountry(code),
    enabled: !!code,
    refetchOnWindowFocus: false,
  });
};
export const useLongWeekendQuery = (
  year: string,
  code: string,
): UseQueryResult<IWeekend[]> => {
  return useQuery({
    queryKey: [queryIds.WEEKEND],
    queryFn: () => getLongWeekend(year, code),
    enabled: !!(year && code),
    refetchOnWindowFocus: false,
  });
};

export const useHolidayQuery = (
  year: string,
  code: string,
): UseQueryResult<IHoliday[]> => {
  return useQuery({
    queryKey: [queryIds.HOLIDAY],
    queryFn: () => getCountryHolidays(year, code),
    enabled: !!(year && code),
    refetchOnWindowFocus: false,
  });
};
