const API = {
  fuelUrl: "/src/js/data/fuel_costs.json",
  regionsUrl: "/src/js/data/italian_regions.json",
  regionsTaxesUrl: "/src/js/data/regions_bollo_taxation.json",

  fetchFuelPrices: async () => {
    const result = await fetch(API.fuelUrl);
    return await result.json();
  },
  fetchRegions: async () => {
    const result = await fetch(API.regionsUrl);
    return await result.json();
  },
  fetchRegionsTaxation: async () => {
    const result = await fetch(API.regionsTaxesUrl);
    return await result.json();
  },
};

export default API;
