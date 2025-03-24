class PeriodCost extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    window.addEventListener("annualCostChange", this.render.bind(this));
    window.addEventListener("engineTypeChange", this.render.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("annualCostChange", this.render.bind(this));
    window.removeEventListener("engineTypeChange", this.render.bind(this));
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
      const { store } = app;

      const fuel = store.fuelCost;
      const rent = store.rentCost;
      const tax = store.taxes;

      const annualCost = rent + fuel + tax;

      switch (this.cost) {
        case "yearly":
          int = parseFloat(annualCost).toFixed(0);
          break;
        case "monthly":
          int = parseFloat(annualCost / 12).toFixed(0);
          break;
        case "daily":
          int = parseFloat(annualCost / 365).toFixed(2);
          break;
        default:
          int = annualCost.toString();
      }
    }
    this.innerHTML = `€ ${int}`;
  }

  render() {
    this.setElement();
  }
}

customElements.define("period-cost", PeriodCost);
