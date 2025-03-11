class FieldsFuelResult extends HTMLElement {
  constructor() {
    super();
    this.handleDataChange = this.handleDataChange.bind(this);
    window.addEventListener("fuelDataChange", this.handleDataChange);
    window.addEventListener("carTypeChange", this.handleDataChange);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("fuelDataChange", this.handleDataChange);
    window.removeEventListener("carTypeChange", this.handleDataChange);
  }

  handleDataChange() {
    this.render();
  }

  calcFuelConsumption() {
    if (window.app && window.app.store) {
      const store = window.app.store;
      const distance = store.distance;
      if (!distance) return 0;
      let cost = 0;
      if (store.isItPlugIn === true) {
        const electricShare = store.distanceInElectric;
        const battery = store.batteryCapacity;
        const tank = store.tankCapacity;
        const eAutonomy = store.electricAutonomy;
        const autonomy = store.fullAutonomy;
        if (
          !electricShare ||
          !battery ||
          !tank ||
          !eAutonomy ||
          !autonomy ||
          autonomy < eAutonomy
        ) {
          return 0;
        }
        const eDistance = (distance / 100) * electricShare;
        const eFuelEfficiency = eAutonomy / battery;
        const kW = eDistance / eFuelEfficiency;
        const electricityConsumption = store.electricityPrice * kW;
        const tDistance = distance - eDistance;
        const tAutonomy = autonomy - eAutonomy;
        const fuelEfficiency = tAutonomy / tank;
        const litres = tDistance / fuelEfficiency;
        const thermicConsumption = store.petrolPrice * litres;
        const annualPrice = electricityConsumption + thermicConsumption;
        cost = annualPrice / 12;
      } else if (store.isItElectric === true) {
        const efficiency = store.electricFuelEfficiency;
        if (!efficiency) return 0;
        const unit = store.electricFuelEfficiencyUnit;

        let kW;
        if (unit === "km/kWh") {
          kW = distance / efficiency;
        } else {
          kW = (distance / 100) * efficiency;
        }
        const annualPrice = kW * store.electricityPrice;
        cost = annualPrice / 12;
      } else {
        const efficiency = store.thermicFuelEfficiency;

        if (!efficiency) return 0;
        const unit = store.thermicFuelEfficiencyUnit;

        let litres = 0;
        if (unit === "km/L") {
          litres = distance / efficiency;
        } else {
          litres = (distance / 100) * efficiency;
        }

        const annualPrice = litres * store.petrolPrice;

        cost = annualPrice / 12;
      }

      store.monthlyFuelCost = Number.parseFloat(cost).toFixed(2);
      store.fuelCost = Number.parseFloat(cost * 12).toFixed(2);

      return store.fuelCost;
    }
    return 0;
  }

  render() {
    const annualCost = this.calcFuelConsumption();
    this.innerHTML = `
        <div class="result">
          <div class="left">
            Costo annuo
          </div>
          <div class="right">
            €${annualCost}
          </div>
        </div>
      `;
  }
}

customElements.define("fields-fuel-result", FieldsFuelResult);
