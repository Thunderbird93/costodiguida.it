class PeriodCost extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    document.addEventListener("annualCostChange", this.render());
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
      //   const store = window.app.store;
      //   let fuel = 0;
      //   if (store.fuelCost != null) {
      //     fuel = store.fuelCost;
      //   }
      //   if (store.rentCost != null) {
      //     fuel = store.rentCost;
      //   }
      // to be continued
    }
    this.innerHTML = `€ ${int}`;
  }

  render() {
    this.setElement();
  }
}

customElements.define("period-cost", PeriodCost);
