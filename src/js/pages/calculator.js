import Store from "../services/Store.js";
import API from "../services/API.js";
import Router from "../services/Router.js";

window.app = {};
app.store = Store;
app.router = Router;
app.api = API;

document.addEventListener("DOMContentLoaded", async () => {
  const $$ = (args) => document.querySelectorAll(args);
  HTMLElement.prototype.$$ = (s) => this.querySelectorAll(s);

  const hero = $$("#hero");
  const toggleMenu = $$("#hamburger-menu");

  const observer = new IntersectionObserver(
    ([entry]) => {
      const int = entry.isIntersecting ? 1 : 0;
      toggleMenu[0].style.filter = `invert(${int})`;
    },
    { root: null, threshold: 0.05 },
  );

  observer.observe(hero[0]);

  // Filter data to numbers
  const filterElementsValueToNumber = (el) => {
    if (el == null || el.value == null) {
      return null;
    }
    return +el.value;
  };

  filterElementsValueToNumber();

  // 1 - Data
  // const upfront = $$("#upfront");
  // const monthly = $$("#monthly");
  // const months = $$("#months");
  const thermicFuelEfficiencyUnit = $$(
    'input[name="thermicFuelEfficiencyUnit"',
  );
  thermicFuelEfficiencyUnit.forEach((el) => {
    if (el.checked === true) {
      app.store.thermicFuelEfficiencyUnit = el.value;
    }

    el.addEventListener("change", () => {
      app.store.thermicFuelEfficiencyUnit = el.value;
    });
  });

  // pre - Data

  const carIsHybrid = $$("#carIsHybrid")[0];
  const carIsNotHybrid = $$("#carIsNotHybrid")[0];
  const isItPlugIn = $$("input[name='isItPlugIn']");
  const isItElectric = $$("input[name='isItElectric']");
  const displayPreMessage = $$("#displayPreMessage");

  // 2 - Data
  const fuelCostCard = $$("#fuelCostCard");
  const thermic = $$(".thermic");
  const electric = $$(".electric");
  const plugIn = $$(".plugIn");
  const taxCard = $$("#taxCard");

  const fuelPrices = await app.api.fetchFuelPrices();
  window.app.store.petrolPrice = fuelPrices.petrol.price;
  window.app.store.dieselPrice = fuelPrices.diesel.price;
  window.app.store.electricityPrice = fuelPrices.electricity.price;

  const regionsTaxation = await app.api.fetchRegionsTaxation();

  const bollo = $$("#bollo")[0];
  const superbollo = $$("#superbollo")[0];

  const displayAnnualTaxes = (type, value) => {
    if (!type) return;
    if (type === "bollo") {
      bollo.innerText = value;
    } else {
      superbollo.innerText = value;
    }
  };

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
  // pre - listeners
  window.addEventListener("isItHybridchange", () => {
    setRadioButtonsToDefineCarEngine();
    setDisplayPreMessageInStore();
    displayTaxCardAndFieldsInFuelCard();
  });
  window.addEventListener("isItPlugInchange", () => {
    setDisplayPreMessageInStore();
    displayTaxCardAndFieldsInFuelCard();
  });
  window.addEventListener("isItElectricchange", () => {
    setDisplayPreMessageInStore();
    displayTaxCardAndFieldsInFuelCard();
  });
  window.addEventListener("displayPreMessagechange", () => {
    displayPreMessageOnPage();
    displayFuelCostCard();
  });
});
