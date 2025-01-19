import { useMemo } from "react";
import { useAvailableCountriesQuery } from "@/api/weekends/queries.ts";
import Select, { SingleValue } from "react-select";
import { useTodoStore } from "@/zustand/store.ts";
import { CountryCode } from "@/api/types.ts";

const SelectRegion = () => {
  const { data } = useAvailableCountriesQuery();
  const setCountryCode = useTodoStore((state) => state.setCountryCode);
  const countryCode = useTodoStore((state) => state.countryCode);

  const selectData = useMemo(() => {
    return data?.map((entry) => ({
      value: entry.countryCode,
      label: entry.name,
    }));
  }, [data]);
  return (
    <Select<CountryCode>
      options={selectData}
      onChange={setCountryCode as (val: SingleValue<CountryCode>) => void}
      value={countryCode}
      defaultValue={{ value: "UA", label: "Ukraine" }}
      placeholder={"Select region"}
      className={"selectRegion"}
    />
  );
};

export default SelectRegion;
