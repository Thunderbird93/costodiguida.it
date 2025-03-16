import Store from "../services/Store.js";
import API from "../services/API.js";
import Router from "../services/Router.js";

window.app = {};
app.store = Store;
app.router = Router;
app.api = API;

document.addEventListener("DOMContentLoaded", async () => {
  console.info("Page loaded.");

  const prices = await app.api.fetchFuelPrices();
  app.store.petrolPrice = prices.petrol.price;
  app.store.dieselPrice = prices.diesel.price;
  app.store.electricityPrice = prices.electricity.price;

  const $$ = (args) => document.querySelectorAll(args);
  HTMLElement.prototype.$$ = (s) => this.querySelectorAll(s);

  const carIsHybrid = $$("#carIsHybrid")[0];
  const carIsNotHybrid = $$("#carIsNotHybrid")[0];
  const thermicChoice = $$("#thermicChoice")[0];
  const isItPlugIn = $$("input[name='isItPlugIn']");
  const isItElectric = $$("input[name='isItElectric']");
  const displayPreMessage = $$("#displayPreMessage");

  // 2 - Data
  const fuelCostCard = $$("#fuelCostCard");
  const thermic = $$(".thermic");
  const electric = $$(".electric");
  const plugIn = $$(".plugIn");
  const taxCard = $$("#taxCard");

  // pre - functions
  const setRadioButtonsToDefineCarEngine = () => {
    const isItHybrid = app.store.isItHybrid;

    app.store.isItPlugIn = null;
    app.store.isItElectric = null;

    isItPlugIn.forEach((el) => (el.checked = false));
    isItElectric.forEach((el) => (el.checked = false));

    if (isItHybrid === true) {
      carIsHybrid.style.display = "flex";
      carIsNotHybrid.style.display = "none";
    } else if (isItHybrid === false) {
      carIsHybrid.style.display = "none";
      carIsNotHybrid.style.display = "flex";
    }
  };

  const setDisplayPreMessageInStore = () => {
    if (app.store.isItHybrid != null) {
      if (app.store.isItPlugIn != null || app.store.isItElectric != null) {
        app.store.displayPreMessage = true;
        return;
      }
    }
    app.store.displayPreMessage = false;
  };

  const displayPreMessageOnPage = () => {
    const display = app.store.displayPreMessage;
    displayPreMessage.forEach((el) => {
      el.style.display = display ? "flex" : "none";
    });
  };

  const displayFuelCostCard = () => {
    const display = app.store.displayPreMessage;
    fuelCostCard.forEach((el) => {
      el.style.display = display ? "block" : "none";
    });
  };

  const displayTaxCardAndFieldsInFuelCard = () => {
    const car = app.store;

    taxCard.forEach((el) => {
      let display = "none";

      if (
        (car.isItHybrid === true && car.isItPlugIn !== null) ||
        (car.isItHybrid === false && car.isItElectric === false)
      ) {
        display = "block";
      }

      el.style.display = display;
    });

    const setDisplay = (elements, displayValue) => {
      elements.forEach((el) => (el.style.display = displayValue));
    };

    if (car.isItPlugIn) {
      setDisplay(plugIn, "flex");
      setDisplay(electric, "none");
      setDisplay(thermic, "none");
    } else if (car.isItElectric) {
      setDisplay(electric, "flex");
      setDisplay(plugIn, "none");
      setDisplay(thermic, "none");
    } else {
      setDisplay(thermic, "flex");
      setDisplay(electric, "none");
      setDisplay(plugIn, "none");
    }
  };

  isItPlugIn.forEach((el) => {
    el.addEventListener("change", () => {
      app.store.isItPlugIn = el.value === "true";
    });
  });

  isItElectric.forEach((el) => {
    el.addEventListener("change", () => {
      app.store.isItElectric = el.value === "true";
    });
  });

  const setThermicFuelType = () => {
    if (
      (app.store.isItPlugIn == null && app.store.isItElectric == null) ||
      app.store.isItElectric === true
    ) {
      thermicChoice.style.display = "none";
      return;
    }

    thermicChoice.style.display = "flex";
  };

  // pre - listeners
  window.addEventListener("isItHybridChange", () => {
    setRadioButtonsToDefineCarEngine();
    setDisplayPreMessageInStore();
    displayTaxCardAndFieldsInFuelCard();
  });
  window.addEventListener("isItPlugInChange", () => {
    setDisplayPreMessageInStore();
    displayTaxCardAndFieldsInFuelCard();
    setThermicFuelType();
  });
  window.addEventListener("isItElectricChange", () => {
    setDisplayPreMessageInStore();
    displayTaxCardAndFieldsInFuelCard();
    setThermicFuelType();
  });
  window.addEventListener("displayPreMessageChange", () => {
    displayPreMessageOnPage();
    displayFuelCostCard();
  });
});
