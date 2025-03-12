class FieldsFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleListeners("add");
    if (this.calc === "fuel") {
      this.getFuelsPrices();
    }
  }

  disconnectedCallback() {
    this.handleListeners("remove");
  }

  static get observeAttributes() {
    return ["calc"];
  }

  get calc() {
    return this.getAttribute("calc");
  }
  set calc(val) {
    return this.setAttribute("calc", val);
  }

  get message() {
    return this.getAttribute("message");
  }
  set message(val) {
    return this.setAttribute("message", val);
  }

  num(val) {
    return +Number.parseFloat(val).toFixed(2);
  }

  async getFuelsPrices() {
    if (window.app?.api && window.app?.store) {
      const prices = await window.app.api.fetchFuelPrices();
      window.app.store.petrolPrice = prices.petrol.price;
      window.app.store.dieselPrice = prices.diesel.price;
      window.app.store.electricityPrice = prices.electricity.price;
    }
  }

  handleListeners(action) {
    if (!this.calc) return;

    const eventMap = {
      rent: ["financeDataChange"],
      fuel: ["fuelDataChange", "carTypeChange"],
      tax: ["taxDataChange"],
    };

    const events = eventMap[this.calc] || [];

    for (let i = 0; i < events.length; i++) {
      window[`${action}EventListener`](events[i], this.handleDataChange);
    }
  }

  handleDataChange() {
    this.render();
  }

  getEngineKwPower(power, unit) {
    if (!power || power <= 0) return 0;

    const conversionFactor = 0.73549875;
    return unit === "cv" ? Math.round(power * conversionFactor) : power;
  }

  calcRent() {
    if (window.app && window.app.store) {
      const store = window.app.store;

      if (
        store.upfront !== null &&
        store.monthly !== null &&
        store.months !== null
      ) {
        const deferredUpfrontPayment = this.num(
          (store.upfront / store.months) * 12,
        );
        const yearlyRent = store.monthly * 12;
        const fullYearly = yearlyRent + deferredUpfrontPayment;
        store.rentCost = this.num(fullYearly);
        console.log("store.rentCost", store.rentCost);

        const monthly = store.rentCost / 12;
        store.rentMonthlyCost = this.num(monthly);

        return store.rentCost;
      }
    }
    return 0;
  }

  calcElectric() {
    const efficiency = window.app.store.electricFuelEfficiency;
    if (!efficiency) return 0;
    const distance = window.app.store.distance;

    const unit = window.app.store.electricFuelEfficiencyUnit;
    let kW;
    if (unit === "km/kWh") {
      kW = distance / efficiency;
    } else {
      kW = (distance / 100) * efficiency;
    }

    console.log("efficiency", efficiency);
    console.log("unit", unit);
    console.log("kW", kW);
    console.log(
      "window.app.store.electricityPrice",
      window.app.store.electricityPrice,
    );

    return kW * window.app.store.electricityPrice;
  }

  calcPlugIn() {
    const {
      distance,
      distanceInElectric: electricShare,
      batteryCapacity: battery,
      tankCapacity: tank,
      electricAutonomy: eAutonomy,
      fullAutonomy: autonomy,
      electricityPrice,
      petrolPrice,
    } = window.app.store;

    if (
      electricShare == null ||
      !battery ||
      !tank ||
      !eAutonomy ||
      !autonomy ||
      autonomy < eAutonomy
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
    const thermicCost = petrolPrice * requiredLitres;

    return electricityCost + thermicCost;
  }

  calcThermic() {
    const efficiency = window.app.store.thermicFuelEfficiency;

    if (!efficiency) return 0;
    const distance = window.app.store.distance;
    const unit = window.app.store.thermicFuelEfficiencyUnit;

    let litres = 0;
    if (unit === "km/L") {
      litres = distance / efficiency;
    } else {
      litres = (distance / 100) * efficiency;
    }

    return litres * window.app.store.petrolPrice;
  }

  calcFuel() {
    if (window.app?.store) {
      if (!window.app.store.distance) return 0;

      let annualCost = 0;
      if (window.app.store.isItPlugIn === true) {
        annualCost = this.calcPlugIn();
      } else if (window.app.store.isItElectric === true) {
        annualCost = this.calcElectric();
      } else {
        annualCost = this.calcThermic();
      }

      window.app.store.fuelCost = this.num(annualCost);
      window.app.store.monthlyFuelCost = this.num(annualCost / 12);

      return window.app.store.fuelCost;
    }
    return 0;
  }

  async calcBollo(power) {
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
      return 100 * baseEuroPerKw + (power - 100) * surplusEuroPerKw;
    }

    const tax = power * baseEuroPerKw;
    return minPayment > tax ? minPayment : this.num(tax);
  }

  calcSuperbollo(power) {
    const kwLimit = 185;
    const excessKw = power - kwLimit;
    const pricePerKw = 20;
    return power > kwLimit ? this.num(Math.round(excessKw * pricePerKw)) : 0;
  }

  async calcTaxes() {
    if (window.app && window.app.store && window.app.api) {
      const store = window.app.store;
      if (store.region && store.region !== "") {
        let engineKwPower = this.getEngineKwPower(
          store.enginePower,
          store.enginePowerUnit,
        );

        window.app.store.bollo = await this.calcBollo(engineKwPower);
        window.app.store.superbollo = this.calcSuperbollo(engineKwPower);

        window.app.store.taxes = this.num(
          window.app.store.bollo + window.app.store.superbollo,
        );
        return window.app.store.taxes;
      }
    }
    return 0;
  }

  async render() {
    let html;
    if (
      this.calc &&
      (this.calc === "rent" || this.calc === "fuel" || this.calc === "tax")
    ) {
      let annualCost = 0;
      if (this.calc === "rent") {
        annualCost = this.calcRent();
      } else if (this.calc === "fuel") {
        annualCost = this.calcFuel();
      } else if (this.calc === "tax") {
        annualCost = await this.calcTaxes();
      }
      html = `
         <div class="result">
            <div class="left">
                <p>Costo annuo</p>
            </div>
            <div class="right">
                <p>€ ${annualCost}</p>
            </div>
        </div>
      `;
    } else if (this.message) {
      html = `
        <div class="result">
            <div class="left"></div>
            <div class="right">
                <p>${this.message}</p>
            </div>
        </div>
      `;
    } else {
      html = `
        <div class="result">
            <div class="left"></div>
            <div class="right"></div>
        </div>
          `;
    }
    this.innerHTML = html;
  }
}

customElements.define("fields-footer", FieldsFooter);
