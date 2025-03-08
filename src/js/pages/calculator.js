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

  const distance = $$("#distance");
  const thermicFuelEfficiency = $$("#thermicFuelEfficiency");
  const thermicFuelEfficiencyUnit = $$(
    'input[name="thermicFuelEfficiencyUnit"',
  );
  const electricFuelEfficiency = $$("#electricFuelEfficiency");
  const electricFuelEfficiencyUnit = $$(
    'input[name="electricFuelEfficiencyUnit"]',
  );
  const distanceInElectric = $$("#distanceInElectric");
  const batteryCapacity = $$("#batteryCapacity");
  const tankCapacity = $$("#tankCapacity");
  const electricAutonomy = $$("#electricAutonomy");
  const fullAutonomy = $$("#fullAutonomy");

  const fuelPrices = await app.api.fetchFuelPrices();
  const petrolPrice = fuelPrices.petrol.price;
  const dieselPrice = fuelPrices.diesel.price;
  const electricityPrice = fuelPrices.electricity.price;

  const monthlyFuelCost = $$("#monthlyFuelCost")[0];

  const italianRegions = await app.api.fetchRegions();
  const regionsTaxation = await app.api.fetchRegionsTaxation();
  const regions = $$("#regions")[0];
  const thermicEnginePower = $$("#thermicEnginePower")[0];
  const enginePowerUnit = $$('input[name="enginePowerUnit"]');

  const annualTaxes = $$("annualTaxes")[0];

  enginePowerUnit.forEach((el) => {
    el.addEventListener("change", () => {
      app.store.enginePowerUnit = el.value;
    });
  });

  const setRegionsInSelect = () => {
    const init = document.createElement("option");
    init.textContent = "- Seleziona -";
    init.value = null;
    regions.appendChild(init);

    for (const region of italianRegions.list) {
      const el = document.createElement("option");
      el.textContent = region;
      el.value = region;
      regions.appendChild(el);
    }
  };
  setRegionsInSelect();

  regions.addEventListener("change", (event) => {
    app.store.region = event.target.value;
  });
  const calcTaxes = () => {
    const region = app.store.region;
    const unit = app.store.enginePowerUnit;
    let power = app.store.thermicEnginePower;
    let bollo;
    if (region !== null && power !== null && unit !== null) {
      //calcolo bollo
      console.time();

      if (unit === "cv") {
        power = Math.round(power * 0.735);
      }
      if (regionsTaxation[region].payment.minimum !== null) {
        bollo = regionsTaxation[region].payment.minimum;
      }
      if (power <= 100) {
        bollo = power * regionsTaxation[region].payment.fares.base;
      } else {
        const base = 100 * regionsTaxation[region].payment.fares.base;
        const surplus =
          (power - 100) * regionsTaxation[region].payment.fares.surplus;
        bollo = base + surplus;
      }
      bollo = Math.round(bollo);
      let superBollo = 0;
      if (power >= 185) {
        superBollo = (power - 185) * 20;
      }
    }
  };

  window.addEventListener("regionchange", () => {
    calcTaxes();
  });
  window.addEventListener("thermicEnginePowerchange", () => {
    calcTaxes();
  });
  window.addEventListener("enginePowerUnitchange", () => {
    calcTaxes();
  });

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

  const calcFuelConsumption = () => {
    console.log("entro");

    const distance = app.store.distance;
    if (!distance) return;
    let cost = 0;
    if (app.store.isItPlugIn === true) {
      const electricShare = app.store.distanceInElectric;
      const battery = app.store.batteryCapacity;
      const tank = app.store.tankCapacity;
      const eAutonomy = app.store.electricAutonomy;
      const autonomy = app.store.fullAutonomy;
      if (!electricShare || !battery || !tank || !eAutonomy || !autonomy) {
        return;
      }
      const eDistance = (distance / 100) * electricShare;
      // e
      const eFuelEfficiency = eAutonomy / battery;
      const kW = eDistance / eFuelEfficiency;
      const electricityConsumption = electricityPrice * kW;
      // b
      const tDistance = distance - eDistance;
      const tAutonomy = autonomy - eAutonomy;
      const fuelEfficiency = tAutonomy / tank;
      const litres = tDistance / fuelEfficiency;
      const thermicConsumption = petrolPrice * litres;
      //
      const annualPrice = electricityConsumption + thermicConsumption;
      cost = annualPrice / 12;
    } else if (app.store.isItElectric === true) {
      const efficiency = app.store.electricFuelEfficiency;
      if (!efficiency) return;
      const unit = app.store.electricFuelEfficiencyUnit;

      let kW;
      if (unit === "km/kWh") {
        kW = distance / efficiency;
      } else {
        kW = (distance / 100) * efficiency;
      }
      const annualPrice = kW * electricityPrice;
      cost = annualPrice / 12;
    } else {
      const efficiency = app.store.thermicFuelEfficiency;
      if (!efficiency) return;
      const unit = app.store.thermicFuelEfficiencyUnit;

      let litres = 0;
      if (unit === "km/L") {
        litres = distance / efficiency;
      } else {
        litres = (distance / 100) * efficiency;
      }
      const annualPrice = litres * petrolPrice;
      cost = annualPrice / 12;
    }
    monthlyFuelCost.innerText = Math.trunc(cost);
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

  // 2 - function
  distance.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.distance = filterElementsValueToNumber(el);
    });
  });

  thermicFuelEfficiency.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.thermicFuelEfficiency = filterElementsValueToNumber(el);
    });
  });

  thermicFuelEfficiencyUnit.forEach((el) => {
    if (el.checked === true) {
      app.store.thermicFuelEfficiencyUnit = el.value;
    }

    el.addEventListener("change", () => {
      app.store.thermicFuelEfficiencyUnit = el.value;
    });
  });

  electricFuelEfficiency.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.electricFuelEfficiency = filterElementsValueToNumber(el);
    });
  });

  thermicEnginePower.addEventListener("input", () => {
    app.store.thermicEnginePower =
      filterElementsValueToNumber(thermicEnginePower);
  });

  electricFuelEfficiencyUnit.forEach((el) => {
    if (el.checked === true) {
      app.store.electricFuelEfficiencyUnit = el.value;
    }

    el.addEventListener("change", () => {
      app.store.electricFuelEfficiencyUnit = el.value;
      console.log(
        "app.store.electricFuelEfficiencyUnit",
        app.store.electricFuelEfficiencyUnit,
      );
    });
  });

  distanceInElectric.forEach((el) => {
    app.store.distanceInElectric = filterElementsValueToNumber(el);

    el.addEventListener("input", () => {
      app.store.distanceInElectric = filterElementsValueToNumber(el);
    });
  });

  batteryCapacity.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.batteryCapacity = filterElementsValueToNumber(el);
    });
  });

  tankCapacity.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.tankCapacity = filterElementsValueToNumber(el);
    });
  });

  electricAutonomy.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.electricAutonomy = filterElementsValueToNumber(el);
    });
  });
  fullAutonomy.forEach((el) => {
    el.addEventListener("input", () => {
      app.store.fullAutonomy = filterElementsValueToNumber(el);
    });
  });

  // 2 - listeners
  window.addEventListener("distancechange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("thermicFuelEfficiencychange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("thermicFuelEfficiencyUnitchange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("electricFuelEfficiencychange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("electricFuelEfficiencyUnitchange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("distanceInElectricchange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("batteryCapacitychange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("tankCapacitychange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("electricAutonomychange", () => {
    calcFuelConsumption();
  });
  window.addEventListener("fullAutonomychange", () => {
    calcFuelConsumption();
  });

  // window.addEventListener("storechange", () => {
  //   console.log("app", app.store);
  // });
});
