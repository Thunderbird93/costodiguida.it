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
      const hybrid = store.isItHybrid;
      const plugin = store.isItPlugIn;
      const electric = store.isItElectric;

      let fuel = store.fuelCost;

      if (hybrid === true) {
        if (plugin === null) {
          fuel = 0;
        }
      } else if (hybrid === false) {
        if (electric === null) {
          fuel = 0;
        }
      }

      const rent = store.rentCost;
      const tax = store.taxes;

      let annualCost = 0;

      if (electric) {
        annualCost = rent + fuel;
      } else {
        annualCost = rent + fuel + tax;
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
