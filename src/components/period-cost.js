class PeriodCost extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    window.addEventListener("annualCostChange", this.render.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("annualCostChange", this.render.bind(this));
  }

  get cost() {
    return this.getAttribute("cost");
  }
  set cost(val) {
    return this.setAttribute("cost", val);
  }

  setElement() {
    let int = 0;
    if (window.app?.store) {
      const rent = window.app.store.rentCost;
      const fuel = window.app.store.fuelCost;
      const tax = window.app.store.taxes;

      const annualCost = rent + fuel + tax;

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
