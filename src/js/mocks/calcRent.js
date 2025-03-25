import { num } from "../mocks/helpers.js";

export function calcRent() {
  if (!app || !app.store) return 0;

  const { store } = app;

  if (store.months <= 0) {
    store.rentCost = 0;
    return store.rentCost;
  }

  if (!isNaN(store.upfront) && !isNaN(store.monthly) && !isNaN(store.months)) {
    const deferredUpfrontPayment = num((store.upfront / store.months) * 12);
    const yearlyRent = store.monthly * 12;
    const fullYearly = yearlyRent + deferredUpfrontPayment;
    store.rentCost = num(fullYearly);

    return store.rentCost;
  }
}
