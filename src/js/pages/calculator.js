import Store from "../services/Store.js";
import API from "../services/API.js";
import Router from "../services/Router.js";

window.app = {};
app.store = Store;
app.router = Router;

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
  const upfront = $$("#upfront");
  const monthly = $$("#monthly");
  const months = $$("#months");
  const monthlyRentalCost = $$("#monthlyRentalCost");

  // pre - Data
  const isItHybrid = $$("input[name='isItHybrid']");
  const carIsHybrid = $$("#carIsHybrid");
  const carIsNotHybrid = $$("#carIsNotHybrid");
  const isItPlugIn = $$("input[name='isItPlugIn']");
  const isItElectric = $$("input[name='isItElectric']");
  const displayPreMessage = $$("#displayPreMessage");

  // 2 - Data
  const fuelCostCard = $$("#fuelCostCard");
  const thermic = $$(".thermic");
  const electric = $$(".electric");
  const plugIn = $$(".plugIn");
  const taxCard = $$("#taxCard");

  // 1 - functions
  const displayMonthlyRentalCost = (num = null) => {
    if (num == null) {
      monthlyRentalCost[0].innerText = 0;
      return;
    }
    monthlyRentalCost[0].innerText = num;
  };

  const calcRent = () => {
    const i = app.store;
    if (
      typeof i.upfront === "number" &&
      typeof i.monthly === "number" &&
      typeof i.months === "number"
    ) {
      const deferedUpfrontPayment = +Number.parseFloat(
        i.upfront / i.months,
      ).toFixed(2);
      app.store.rentMonthlyCost = Math.round(i.monthly + deferedUpfrontPayment);
    } else {
      displayMonthlyRentalCost();
    }
  };

  upfront.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.upfront = filterElementsValueToNumber(el);
    });
  });

  monthly.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.monthly = filterElementsValueToNumber(el);
    });
  });

  months.forEach((el) => {
    app.store.months = filterElementsValueToNumber(el);
    el.addEventListener("input", () => {
      app.store.months = filterElementsValueToNumber(el);
    });
  });

  // 1 - listeners
  window.addEventListener("upfrontchange", () => {
    calcRent();
  });
  window.addEventListener("monthlychange", () => {
    calcRent();
  });
  window.addEventListener("monthschange", () => {
    calcRent();
  });
  window.addEventListener("rentMonthlyCostchange", () => {
    displayMonthlyRentalCost(app.store.rentMonthlyCost);
  });

  // pre - functions
  const setRadioButtonsToDefineCarEngine = () => {
    const isItHybrid = app.store.isItHybrid;

    app.store.isItPlugIn = null;
    isItPlugIn.forEach((el) => (el.checked = false));
    isItElectric.forEach((el) => (el.checked = false));

    app.store.isItElectric = null;

    carIsHybrid.forEach((el) => {
      el.style.display = isItHybrid ? "flex" : "none";
    });

    carIsNotHybrid.forEach((el) => {
      el.style.display = isItHybrid ? "none" : "flex";
    });
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

  isItHybrid.forEach((el) => {
    el.addEventListener("change", () => {
      app.store.isItHybrid = el.value === "true";
    });
  });

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
