import { num, getEngineKwPower } from "../mocks/helpers.js";

export async function calcBollo(power) {
  const { store } = window.app;

  if (!store.italianRegionsTaxation) {
    store.italianRegionsTaxation = await app.api.fetchRegionsTaxation();
  }
  const { region, italianRegionsTaxation: regions } = store;
  const { payment } = regions[region];
  const {
    minimum: minPayment,
    fares: { base: baseEuroPerKw, surplus: surplusEuroPerKw },
  } = payment;

  if (power > 100) {
    return num(100 * baseEuroPerKw + (power - 100) * surplusEuroPerKw);
  }

  const tax = num(power * baseEuroPerKw);

  return minPayment > tax ? minPayment : tax;
}

export function calcSuperbollo(power) {
  const kwLimit = 185;
  const excessKw = power - kwLimit;
  const pricePerKw = 20;
  return power > kwLimit ? num(Math.round(excessKw * pricePerKw)) : 0;
}

export async function calcTaxes() {
  if (window.app && window.app.store && window.app.api) {
    const store = window.app.store;
    if (store.region && store.region !== "" && store.enginePower !== null) {
      let engineKwPower = getEngineKwPower(
        store.enginePower,
        store.enginePowerUnit,
      );

      window.app.store.bollo = await calcBollo(engineKwPower);
      window.app.store.superbollo = calcSuperbollo(engineKwPower);

      window.app.store.taxes = num(
        window.app.store.bollo + window.app.store.superbollo,
      );
      return window.app.store.taxes;
    }
  }
  return 0;
}
