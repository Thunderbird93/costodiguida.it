class FieldsTaxResult extends HTMLElement {
  constructor() {
    super();
    this.handleDataChange = this.handleDataChange.bind(this);
    window.addEventListener("taxDataChange", this.handleDataChange);
    this.render();
  }

  async handleDataChange() {
    await this.render();
  }

  getEngineKwPower(power, unit) {
    if (!power || power <= 0) return 0;

    const conversionFactor = 0.73549875;
    return unit === "cv" ? Math.round(power * conversionFactor) : power;
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
    return minPayment > tax ? minPayment : +Number.parseFloat(tax).toFixed(2);
  }

  calcSuperbollo(power) {
    const kwLimit = 185;
    return power > kwLimit
      ? +Number.parseFloat(Math.round((power - kwLimit) * 20)).toFixed(2)
      : 0;
  }

  async calcTaxes() {
    if (window.app && window.app.store && window.app.api) {
      const store = window.app.store;
      if (store.region && store.region !== "") {
        let engineKwPower = this.getEngineKwPower(
          store.thermicEnginePower,
          store.enginePowerUnit,
        );

        window.app.store.bollo = await this.calcBollo(engineKwPower);
        window.app.store.superbollo = this.calcSuperbollo(engineKwPower);

        window.app.store.taxes = +Number.parseFloat(
          window.app.store.bollo + window.app.store.superbollo,
        ).toFixed(2);
        return window.app.store.taxes;
      }
    }
    return 0;
  }

  async render() {
    const annualCost = await this.calcTaxes();
    this.innerHTML = `
       <div class="result">
                    <div class="left">Costo annuo</div>
                    <div class="right">
                     € ${annualCost}
                    </div>
                  </div>
      `;
  }
}

customElements.define("fields-tax-result", FieldsTaxResult);
