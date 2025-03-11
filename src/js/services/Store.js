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

    if (property === "rentMonthlyCost") {
      window.dispatchEvent(new Event("rentMonthlyCostchange"));
    }
    if (property === "isItHybrid") {
      window.dispatchEvent(new Event("isItHybridchange"));
    }
    if (property === "isItPlugIn") {
      window.dispatchEvent(new Event("isItPlugInchange"));
    }
    if (property === "isItElectric") {
      window.dispatchEvent(new Event("isItElectricchange"));
    }
    if (property === "displayPreMessage") {
      window.dispatchEvent(new Event("displayPreMessagechange"));
    }
    if (property === "distance") {
      window.dispatchEvent(new Event("distancechange"));
    }
    if (property === "thermicFuelEfficiency") {
      window.dispatchEvent(new Event("thermicFuelEfficiencychange"));
    }
    if (property === "thermicFuelEfficiencyUnit") {
      window.dispatchEvent(new Event("thermicFuelEfficiencyUnitchange"));
    }
    if (property === "electricFuelEfficiency") {
      window.dispatchEvent(new Event("electricFuelEfficiencychange"));
    }
    if (property === "electricFuelEfficiencyUnit") {
      window.dispatchEvent(new Event("electricFuelEfficiencyUnitchange"));
    }
    if (property === "distanceInElectric") {
      window.dispatchEvent(new Event("distanceInElectricchange"));
    }

    if (property === "batteryCapacity") {
      window.dispatchEvent(new Event("batteryCapacitychange"));
    }
    if (property === "tankCapacity") {
      window.dispatchEvent(new Event("tankCapacitychange"));
    }
    if (property === "electricAutonomy") {
      window.dispatchEvent(new Event("electricAutonomychange"));
    }
    if (property === "fullAutonomy") {
      window.dispatchEvent(new Event("fullAutonomychange"));
    }
    if (property === "monthlyFuelCost") {
      window.dispatchEvent(new Event("monthlyFuelCostchange"));
    }
    if (property === "region") {
      window.dispatchEvent(new Event("regionchange"));
    }
    if (property === "enginePower") {
      window.dispatchEvent(new Event("enginePowerchange"));
    }
    if (property === "enginePowerUnit") {
      window.dispatchEvent(new Event("enginePowerUnitchange"));
    }
    return true;
  },

  get(target, property) {
    return target[property];
  },
});

export default proxiedStore;
