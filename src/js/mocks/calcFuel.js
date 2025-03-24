import { num } from "../mocks/helpers.js";

export function calcElectric() {
  const efficiency = app.store.electricFuelEfficiency;
  if (!efficiency) return 0;
  const distance = app.store.distance;

  const unit = app.store.electricFuelEfficiencyUnit;
  let kW;
  if (unit === "km/kWh") {
    kW = distance / efficiency;
  } else {
    kW = (distance / 100) * efficiency;
  }

  return kW * app.store.electricityPrice;
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
  } = app.store;

  if (
    electricShare == null ||
    !battery ||
    !tank ||
    !eAutonomy ||
    !autonomy ||
    autonomy <= eAutonomy
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
  const fuelType = `${app.store.thermicFuelType}Price`;
  const thermicCost = app.store[fuelType] * requiredLitres;

  return electricityCost + thermicCost;
}

export function calcThermic() {
  const efficiency = app.store.thermicFuelEfficiency;

  if (!efficiency) return 0;
  const distance = app.store.distance;
  const unit = app.store.thermicFuelEfficiencyUnit;

  let litres = 0;
  if (unit === "km/L") {
    litres = distance / efficiency;
  } else {
    litres = (distance / 100) * efficiency;
  }
  const fuelType = `${app.store.thermicFuelType}Price`;
  const thermicCost = app.store[fuelType];

  return litres * thermicCost;
}

export function calcFuel() {
  if (
    !app ||
    !app.store ||
    app.store.distance == null ||
    app.store.distance === 0
  ) {
    return 0;
  }

  let annualCost;

  switch (app.store.engineType) {
    case "electric":
      annualCost = calcElectric();
      break;
    case "plugin-hybrid":
      annualCost = calcPlugIn();
      break;
    case "thermic":
    case "full-hybrid":
      annualCost = calcThermic();
      break;
    default:
      annualCost = 0;
      break;
  }

  app.store.fuelCost = num(annualCost);

  return app.store.fuelCost;
}
