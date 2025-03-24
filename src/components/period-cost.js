class PeriodCost extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    window.addEventListener("annualCostChange", this.render.bind(this));
    window.addEventListener("carTypeChange", this.render.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("annualCostChange", this.render.bind(this));
    window.removeEventListener("carTypeChange", this.render.bind(this));
  }

  get cost() {
    return this.getAttribute("cost");
  }
  set cost(val) {
    return this.setAttribute("cost", val);
  }

  setElement() {
    let int = 0;
    if (app?.store) {
      const store = app.store;

      let fuel = store.fuelCost;

      if (store.isItHybrid === true) {
        if (store.isItPlugIn === null) {
          fuel = 0;
        }
      } else if (store.isItHybrid === false) {
        if (store.isItElectric === null) {
          fuel = 0;
        }
      }

      const rent = store.rentCost;
      const tax = store.taxes;

      let annualCost = 0;

      if (app.store.isItElectric) {
        annualCost = rent + fuel;
      } else {
        annualCost = rent + fuel + tax;
      }

      const hybrid = app.store.isItHybrid;
      const plugin = app.store.isItPlugIn;
      const electric = app.store.isItElectric;

      if (hybrid === electric) {
        annualCost = rent;
      }

      if (this.cost === "yearly") {
        int = Number.parseFloat(annualCost).toFixed(0);
      } else if (this.cost === "monthly") {
        int = Number.parseFloat(annualCost / 12).toFixed(0);
      } else if (this.cost === "daily") {
        int = Number.parseFloat(annualCost / 365).toFixed(2);
      }
    }
    this.innerHTML = `€ ${int}`;
  }

  render() {
    this.setElement();
  }
}

customElements.define("period-cost", PeriodCost);
