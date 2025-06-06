const Store = {
  engineType: null,
  upfront: null,
  monthly: null,
  months: 36,
  rentCost: 0,
  //
  isItHybrid: null,
  isItPlugIn: null,
  isItElectric: null,
  displayPreMessage: false,
  thermicFuelType: "petrol",
  //
  distance: null,
  //
  thermicFuelEfficiency: null,
  thermicFuelEfficiencyUnit: "km/L",
  //
  electricFuelEfficiency: null,
  electricFuelEfficiencyUnit: "kWh/100km",
  //
  distanceInElectric: 50,
  batteryCapacity: null,
  tankCapacity: null,
  electricAutonomy: null,
  fullAutonomy: null,
  fuelCost: 0,
  //
  region: "",
  enginePower: null,
  enginePowerUnit: "cv",
  taxes: 0,
  bollo: 0,
  superbollo: 0,
  //
  petrolPrice: null,
  dieselPrice: null,
  electricityPrice: null,
  //
  italianRegions: null,
  italianRegionsTaxation: null,
  //
  navMenu: null,
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;

    if (
      property === "upfront" ||
      property === "monthly" ||
      property === "months"
    ) {
      window.dispatchEvent(new Event("financeDataChange"));
    }

    if (
      property === "region" ||
      property === "enginePower" ||
      property === "enginePowerUnit"
    ) {
      window.dispatchEvent(new Event("taxDataChange"));
    }

    if (
      property === "distance" ||
      property === "thermicFuelEfficiency" ||
      property === "thermicFuelEfficiencyUnit" ||
      property === "electricFuelEfficiency" ||
      property === "electricFuelEfficiencyUnit" ||
      property === "distanceInElectric" ||
      property === "batteryCapacity" ||
      property === "tankCapacity" ||
      property === "electricAutonomy" ||
      property === "fullAutonomy" ||
      property === "thermicFuelType" ||
      property === "petrolPrice" ||
      property === "dieselPrice" ||
      property === "electricityPrice"
    ) {
      window.dispatchEvent(new Event("fuelDataChange"));
    }

    if (
      property === "rentCost" ||
      property === "fuelCost" ||
      property === "taxes"
    ) {
      window.dispatchEvent(new Event("annualCostChange"));
    }

    window.dispatchEvent(new Event(`${property}Change`));

    return true;
  },

  get(target, property) {
    return target[property];
  },
});

export default proxiedStore;
