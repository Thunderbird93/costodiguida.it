import Store from "../services/Store.js";
import API from "../services/API.js";

window.app = {};
app.store = Store;
app.api = API;

(async () => {
  await import("../../components/index.js");
})();

document.addEventListener("DOMContentLoaded", async () => {
  console.info("Page loaded.");

  const prices = await app.api.fetchFuelPrices();
  app.store.petrolPrice = prices.petrol.price;
  app.store.dieselPrice = prices.diesel.price;
  app.store.electricityPrice = prices.electricity.price;
});
