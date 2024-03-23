import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./App.css";
import Countries from "./components/Countries";
import { CountriesContext } from "./hooks/contexts/CountriesContext";
import useSWRImmutable from "swr/immutable";

const App = () => {
  const [displayCountry, setDisplayCountry] = useState();
  const url = "https://restcountries.com/v3.1/all";
  const fetcher = (url) =>
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const modifiedData = data.map((country) => ({ ...country, id: uuidv4() }));
        setDisplayCountry(modifiedData);
        return modifiedData;
      });
  const { data, error, isLoading, mutate: setData } = useSWRImmutable(url, fetcher);

  const handleChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredCountry = displayCountry.filter((country) => {
      const countryName = country.name.common.toLowerCase();
      return countryName.startsWith(searchValue);
    });
    setData(filteredCountry, false);
  };

  return (
    <CountriesContext.Provider value={{ data, setData }}>
      <div id="all">
        <h1>All Country</h1>

        <div id="form">
          <input type="text" required onChange={handleChange} />
        </div>

        {error && <p id="error">{error}</p>}
        {isLoading ? <p id="load">Loading data...</p> : <Countries />}
      </div>
    </CountriesContext.Provider>
  );
};

export default App;
