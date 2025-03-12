import { num } from "../mocks/helpers.js";

export function calcElectric() {
  const efficiency = window.app.store.electricFuelEfficiency;
  if (!efficiency) return 0;
  const distance = window.app.store.distance;

  const unit = window.app.store.electricFuelEfficiencyUnit;
  let kW;
  if (unit === "km/kWh") {
    kW = distance / efficiency;
  } else {
    kW = (distance / 100) * efficiency;
  }

  console.log("efficiency", efficiency);
  console.log("unit", unit);
  console.log("kW", kW);
  console.log(
    "window.app.store.electricityPrice",
    window.app.store.electricityPrice,
  );

  return kW * window.app.store.electricityPrice;
}

export function calcPlugIn() {
  const {
    distance,
    distanceInElectric: electricShare,
    batteryCapacity: battery,
    tankCapacity: tank,
    electricAutonomy: eAutonomy,
    fullAutonomy: autonomy,
    electricityPrice,
    petrolPrice,
  } = window.app.store;

  if (
    electricShare == null ||
    !battery ||
    !tank ||
    !eAutonomy ||
    !autonomy ||
    autonomy < eAutonomy
  ) {
    return 0;
  }

  // electric
  const electricDistance = (distance / 100) * electricShare;
  const electricFuelEfficiency = eAutonomy / battery;
  const requiredKW = electricDistance / electricFuelEfficiency;
  const electricityCost = electricityPrice * requiredKW;

  // thermic
  const thermicDistance = distance - electricDistance;
  const thermicAutonomy = autonomy - eAutonomy;
  const fuelEfficiency = thermicAutonomy / tank;
  const requiredLitres = thermicDistance / fuelEfficiency;
  const thermicCost = petrolPrice * requiredLitres;

  return electricityCost + thermicCost;
}

export function calcThermic() {
  const efficiency = window.app.store.thermicFuelEfficiency;

  if (!efficiency) return 0;
  const distance = window.app.store.distance;
  const unit = window.app.store.thermicFuelEfficiencyUnit;

  let litres = 0;
  if (unit === "km/L") {
    litres = distance / efficiency;
  } else {
    litres = (distance / 100) * efficiency;
  }

  return litres * window.app.store.petrolPrice;
}

export function calcFuel() {
  if (window.app?.store) {
    if (!window.app.store.distance) return 0;

    let annualCost = 0;
    if (window.app.store.isItPlugIn === true) {
      annualCost = calcPlugIn();
    } else if (window.app.store.isItElectric === true) {
      annualCost = calcElectric();
    } else {
      annualCost = calcThermic();
    }

    window.app.store.fuelCost = num(annualCost);
    window.app.store.monthlyFuelCost = num(annualCost / 12);

    return window.app.store.fuelCost;
  }
  return 0;
}
