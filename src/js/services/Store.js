const Store = {
  upfront: null,
  monthly: null,
  months: null,
  rentMonthlyCost: 0,
  //
  isItHybrid: null,
  isItPlugIn: null,
  isItElectric: null,
  displayPreMessage: false,
  //
  distance: null,
  //
  thermicFuelEfficiency: null,
  thermicFuelEfficiencyUnit: null,
  //
  electricFuelEfficiency: null,
  electricFuelEfficiencyUnit: null,
  //
  distanceInElectric: null,
  batteryCapacity: null,
  tankCapacity: null,
  electricAutonomy: null,
  fullAutonomy: null,
  monthlyFuelCost: 0,
  //
  region: null,
  thermicEnginePower: null,
  enginePowerUnit: null,
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;

    // window.dispatchEvent(new Event("storechange"));

    if (property === "upfront") {
      window.dispatchEvent(new Event("upfrontchange"));
    }
    if (property === "monthly") {
      window.dispatchEvent(new Event("monthlychange"));
    }
    if (property === "months") {
      window.dispatchEvent(new Event("monthschange"));
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
    if (property === "thermicEnginePower") {
      window.dispatchEvent(new Event("thermicEnginePowerchange"));
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
