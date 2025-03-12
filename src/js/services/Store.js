const Store = {
  upfront: null,
  monthly: null,
  months: 36,
  rentMonthlyCost: 0,
  rentCost: 0,
  //
  isItHybrid: null,
  isItPlugIn: null,
  isItElectric: null,
  displayPreMessage: false,
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
  monthlyFuelCost: 0,
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
      property === "isItHybrid" ||
      property === "isItPlugIn" ||
      property === "isItElectric"
    ) {
      window.dispatchEvent(new Event("carTypeChange"));
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
      property === "fullAutonomy"
    ) {
      window.dispatchEvent(new Event("fuelDataChange"));
    }

    window.dispatchEvent(new Event(`${property}Change`));

    return true;
  },

  get(target, property) {
    return target[property];
  },
});

export default proxiedStore;
