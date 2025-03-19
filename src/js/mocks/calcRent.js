import { num } from "../mocks/helpers.js";

export function calcRent() {
  if (window.app && window.app.store) {
    const store = window.app.store;

    if (
      store.upfront !== null &&
      store.monthly !== null &&
      store.months !== null
    ) {
      const deferredUpfrontPayment = num((store.upfront / store.months) * 12);
      const yearlyRent = store.monthly * 12;
      const fullYearly = yearlyRent + deferredUpfrontPayment;
      store.rentCost = num(fullYearly);

      const monthly = store.rentCost / 12;
      store.rentMonthlyCost = num(monthly);
      console.log("store", store.annualRent);

      return store.rentCost;
    }
  }
  return 0;
}
