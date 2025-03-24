import { num, getEngineKwPower } from "../mocks/helpers.js";

export async function calcBollo(power) {
  const { store } = app;

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
  if (!app) return 0;
  const { store, api } = app;

  if (
    !store ||
    store.engineType === "electric" ||
    store.enginePower === null ||
    !store.region ||
    store.region === "" ||
    !api
  ) {
    return 0;
  }

  let engineKwPower = getEngineKwPower(
    store.enginePower,
    store.enginePowerUnit,
  );

  app.store.bollo = await calcBollo(engineKwPower);
  app.store.superbollo = calcSuperbollo(engineKwPower);

  app.store.taxes = num(app.store.bollo + app.store.superbollo);

  return app.store.taxes;
}
